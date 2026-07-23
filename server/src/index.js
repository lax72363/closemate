import express from "express";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config.js";
import { systemPrompt, leadTool } from "./prompt.js";
import { saveLead, listLeads } from "./leads.js";
import { mockReply } from "./mock.js";

const app = express();
app.use(express.json({ limit: "64kb" }));

// CORS: the widget may be embedded on the client's own website (different origin).
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "content-type, x-dashboard-token");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---- simple per-IP rate limit (protects API spend) ----
const buckets = new Map();
function rateLimited(ip) {
  const now = Date.now();
  let b = buckets.get(ip);
  if (!b || now - b.start > 3600_000) {
    b = { start: now, count: 0 };
    buckets.set(ip, b);
  }
  b.count += 1;
  return b.count > config.rateLimitPerHour;
}
setInterval(() => {
  const cutoff = Date.now() - 3600_000;
  for (const [ip, b] of buckets) if (b.start < cutoff) buckets.delete(ip);
}, 600_000).unref();

const anthropic = config.mock ? null : new Anthropic({ apiKey: config.apiKey });

app.get("/health", (_req, res) =>
  res.json({ ok: true, mock: config.mock, agent: config.agentName })
);

// Widget bootstrap info (greeting, agent name) so the embed needs zero config.
app.get("/api/widget-config", (_req, res) => {
  res.json({
    agentName: config.agentName,
    brokerage: config.brokerage,
    greeting: `Hi! I'm ${config.agentName}'s assistant. Looking to buy or sell in ${config.market}? I can help — and I'm here 24/7.`,
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;
    if (rateLimited(ip)) {
      return res.status(429).json({ error: "Too many messages. Please try again later." });
    }

    const { messages, visitorId } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }
    const userTurns = messages.filter((m) => m?.role === "user");
    if (userTurns.length > config.maxTurns) {
      return res.json({
        reply: `I want to make sure you get a real person from here — call ${config.agentName} at ${config.agentPhone} or email ${config.agentEmail}.`,
        leadCaptured: false,
      });
    }
    // Sanitize: only role/content strings, both roles allowed, bounded length.
    const history = messages
      .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
      .map((m) => ({ role: m.role, content: m.content.slice(0, config.maxMsgChars) }));
    const vid = String(visitorId || ip).slice(0, 64);

    if (config.mock) {
      return res.json(mockReply(history, saveLead, vid));
    }

    let leadCaptured = false;
    let convo = history;
    let reply = "";
    // Manual tool loop: save_lead may fire mid-turn; feed results back until end_turn.
    for (let i = 0; i < 4; i++) {
      const response = await anthropic.messages.create({
        model: config.model,
        max_tokens: 1024,
        system: [{ type: "text", text: systemPrompt(), cache_control: { type: "ephemeral" } }],
        tools: [leadTool],
        messages: convo,
      });

      const toolResults = [];
      for (const block of response.content) {
        if (block.type === "text") reply = block.text;
        if (block.type === "tool_use" && block.name === "save_lead") {
          saveLead(vid, block.input);
          leadCaptured = true;
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: "Lead saved.",
          });
        }
      }
      if (response.stop_reason !== "tool_use") break;
      convo = [
        ...convo,
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults },
      ];
    }

    res.json({ reply: reply || "Sorry, I had a hiccup — could you say that again?", leadCaptured });
  } catch (err) {
    console.error("[closemate] chat error:", err);
    res.status(500).json({
      reply: `Sorry — I'm having trouble right now. You can reach ${config.agentName} directly at ${config.agentPhone}.`,
      error: true,
    });
  }
});

app.get("/api/leads", (req, res) => {
  const token = req.headers["x-dashboard-token"] || req.query.token;
  if (token !== config.dashboardToken) return res.status(401).json({ error: "unauthorized" });
  res.json({ leads: listLeads() });
});

// Static: landing page, demo site, dashboard, embeddable widget script.
const publicDir = new URL("../../public/", import.meta.url).pathname;
app.use(express.static(publicDir));
app.get("/", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));

app.listen(config.port, () => {
  console.log(
    `CloseMate up on :${config.port}  mock=${config.mock}  agent="${config.agentName}"`
  );
});

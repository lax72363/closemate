import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

const FILE = path.join(config.dataDir, "leads.jsonl");

function ensureDir() {
  fs.mkdirSync(config.dataDir, { recursive: true });
}

export function saveLead(visitorId, lead) {
  ensureDir();
  const record = { visitorId, capturedAt: new Date().toISOString(), ...lead };
  fs.appendFileSync(FILE, JSON.stringify(record) + "\n");
  notify(record).catch((err) =>
    console.error("[closemate] webhook notify failed:", err.message)
  );
  return record;
}

// Latest record per visitor, newest first.
export function listLeads() {
  ensureDir();
  if (!fs.existsSync(FILE)) return [];
  const byVisitor = new Map();
  for (const line of fs.readFileSync(FILE, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const rec = JSON.parse(line);
      byVisitor.set(rec.visitorId || rec.capturedAt, rec);
    } catch {
      /* skip corrupt line */
    }
  }
  return [...byVisitor.values()].sort((a, b) =>
    (b.capturedAt || "").localeCompare(a.capturedAt || "")
  );
}

async function notify(record) {
  if (!config.notifyWebhook) return;
  await fetch(config.notifyWebhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      source: "closemate",
      agent: config.agentName,
      lead: record,
    }),
  });
}

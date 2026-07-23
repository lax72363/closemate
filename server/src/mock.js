// Mock conversation engine: lets the demo run with zero API key/cost.
// A simple scripted flow that mirrors what the real model does, including
// capturing a lead once a name + contact method appear in the transcript.
import { config } from "./config.js";

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
const PHONE_RE = /(\+?\d[\d\s().-]{6,}\d)/;

export function mockReply(messages, saveLeadFn, visitorId) {
  const userMsgs = messages.filter((m) => m.role === "user");
  const transcript = userMsgs.map((m) => m.content).join("\n");
  const last = (userMsgs[userMsgs.length - 1]?.content || "").toLowerCase();

  const email = transcript.match(EMAIL_RE)?.[0];
  const phone = transcript.match(PHONE_RE)?.[0];

  let leadCaptured = false;
  if (email || phone) {
    saveLeadFn(visitorId, {
      name: guessName(transcript) || "Website visitor",
      email: email || undefined,
      phone: phone || undefined,
      intent: /sell/.test(transcript) ? "sell" : "buy",
      temperature: "warm",
      notes: "Captured in demo (mock) mode.",
    });
    leadCaptured = true;
    return {
      reply: `Perfect — I've passed that along to ${config.agentName}, and she'll reach out shortly. In the meantime, is there anything else I can help with?`,
      leadCaptured,
    };
  }

  const n = userMsgs.length;
  if (/sell/.test(last)) {
    return {
      reply: `Great — ${config.agentName} can put together a free market analysis of your home. What area is the property in?`,
      leadCaptured,
    };
  }
  if (n === 1) {
    return {
      reply: `Nice — that's a great time to be looking in ${config.market}. What area and price range do you have in mind?`,
      leadCaptured,
    };
  }
  return {
    reply: `I can have ${config.agentName} send you a hand-picked list of homes that match. What's the best email or phone number for that?`,
    leadCaptured,
  };
}

function guessName(transcript) {
  const m =
    transcript.match(/my name is ([A-Za-z][A-Za-z '-]{1,39}?)(?=[,.\n]|$| and | email| phone)/i) ||
    transcript.match(/\bi'?m ([A-Z][a-z]+(?: [A-Z][a-z]+)?)\b/);
  return m?.[1]?.trim();
}

// Per-client configuration. One CloseMate deployment serves one agent/team —
// that keeps ops trivial (no multi-tenancy) and matches the productized-service model.
const env = process.env;

export const config = {
  port: Number(env.PORT || 3000),

  // The real estate agent this deployment belongs to
  agentName: env.AGENT_NAME || "Sarah Bennett",
  brokerage: env.AGENT_BROKERAGE || "Harborline Realty",
  market: env.AGENT_MARKET || "Tampa Bay, Florida",
  agentPhone: env.AGENT_PHONE || "(813) 555-0142",
  agentEmail: env.AGENT_EMAIL || "sarah@harborlinerealty.com",
  calendarUrl: env.AGENT_CALENDAR_URL || "", // e.g. Calendly link; offered to hot leads

  // Anthropic
  apiKey: env.ANTHROPIC_API_KEY || "",
  model: env.CLAUDE_MODEL || "claude-opus-4-8",
  // Mock mode: scripted replies, no API key needed. Auto-enabled when no key is set.
  mock: env.MOCK === "1" || !env.ANTHROPIC_API_KEY,

  // Where leads are stored (JSONL, one record per save_lead call)
  dataDir: env.DATA_DIR || new URL("../../data/", import.meta.url).pathname,

  // Optional: POST every captured lead here (Zapier/Make webhook -> email/SMS/CRM)
  notifyWebhook: env.NOTIFY_WEBHOOK || "",

  // Protects GET /api/leads and the dashboard
  dashboardToken: env.DASHBOARD_TOKEN || "changeme",

  // Cost guardrails
  maxTurns: Number(env.MAX_TURNS || 30),          // max user messages per conversation
  maxMsgChars: Number(env.MAX_MSG_CHARS || 2000), // max chars per user message
  rateLimitPerHour: Number(env.RATE_LIMIT_PER_HOUR || 60), // messages per IP per hour
};

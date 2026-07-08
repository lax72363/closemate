import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = process.env.DB_PATH || "./data/closemate.db";
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,              -- agent's own cell, receives hot-lead handoffs
  market TEXT DEFAULT '',           -- e.g. "Austin, TX"
  persona_notes TEXT DEFAULT '',    -- extra instructions for the AI persona
  booking_url TEXT DEFAULT '',      -- Calendly etc. (Pro tier)
  twilio_number TEXT UNIQUE,        -- the number Closemate texts from
  webhook_token TEXT UNIQUE NOT NULL,   -- secret path segment for inbound lead webhook
  access_token TEXT UNIQUE NOT NULL,    -- dashboard auth token
  subscription_status TEXT DEFAULT 'trial', -- trial | active | past_due | canceled
  stripe_customer_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id INTEGER NOT NULL REFERENCES agents(id),
  name TEXT DEFAULT '',
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  source TEXT DEFAULT 'webhook',    -- zillow | facebook | idx | manual | ...
  status TEXT DEFAULT 'new',        -- new | engaged | qualified | handoff | opted_out | cold
  intent TEXT,                      -- buy | sell | rent | unknown
  timeline TEXT,
  budget TEXT,
  preapproved INTEGER,              -- 1 / 0 / NULL(unknown)
  area TEXT,
  followup_stage INTEGER DEFAULT 0, -- how many automated follow-ups sent
  first_response_ms INTEGER,        -- speed-to-lead metric
  created_at TEXT DEFAULT (datetime('now')),
  last_contact_at TEXT DEFAULT (datetime('now')),
  UNIQUE(agent_id, phone)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id),
  direction TEXT NOT NULL,          -- 'in' (from lead) | 'out' (from AI)
  body TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_agent ON leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_lead ON messages(lead_id);
`);

// --- agents ---
export const getAgentByWebhookToken = db.prepare(
  "SELECT * FROM agents WHERE webhook_token = ?"
);
export const getAgentByAccessToken = db.prepare(
  "SELECT * FROM agents WHERE access_token = ?"
);
export const getAgentByTwilioNumber = db.prepare(
  "SELECT * FROM agents WHERE twilio_number = ?"
);
export const getAgentById = db.prepare("SELECT * FROM agents WHERE id = ?");
export const insertAgent = db.prepare(`
  INSERT INTO agents (name, email, phone, market, persona_notes, booking_url, twilio_number, webhook_token, access_token)
  VALUES (@name, @email, @phone, @market, @persona_notes, @booking_url, @twilio_number, @webhook_token, @access_token)
`);
export const setSubscriptionStatus = db.prepare(
  "UPDATE agents SET subscription_status = ?, stripe_customer_id = COALESCE(?, stripe_customer_id) WHERE id = ?"
);

// --- leads ---
export const findLead = db.prepare(
  "SELECT * FROM leads WHERE agent_id = ? AND phone = ?"
);
export const insertLead = db.prepare(`
  INSERT INTO leads (agent_id, name, phone, email, source)
  VALUES (@agent_id, @name, @phone, @email, @source)
`);
export const updateLeadQualification = db.prepare(`
  UPDATE leads SET
    status = @status, intent = @intent, timeline = @timeline, budget = @budget,
    preapproved = @preapproved, area = @area, last_contact_at = datetime('now')
  WHERE id = @id
`);
export const touchLead = db.prepare(
  "UPDATE leads SET last_contact_at = datetime('now'), status = CASE WHEN status = 'new' THEN 'engaged' ELSE status END WHERE id = ?"
);
export const setLeadStatus = db.prepare(
  "UPDATE leads SET status = ? WHERE id = ?"
);
export const setFirstResponse = db.prepare(
  "UPDATE leads SET first_response_ms = ? WHERE id = ? AND first_response_ms IS NULL"
);
export const bumpFollowupStage = db.prepare(
  "UPDATE leads SET followup_stage = ?, last_contact_at = datetime('now') WHERE id = ?"
);
export const leadsForAgent = db.prepare(
  "SELECT * FROM leads WHERE agent_id = ? ORDER BY last_contact_at DESC LIMIT 200"
);
// Leads eligible for an automated follow-up nudge.
export const staleLeads = db.prepare(`
  SELECT l.*, a.twilio_number, a.name AS agent_name, a.subscription_status
  FROM leads l JOIN agents a ON a.id = l.agent_id
  WHERE l.status IN ('new','engaged')
    AND l.followup_stage < 3
    AND a.subscription_status IN ('trial','active')
    AND l.last_contact_at <= datetime('now', ?)
`);

// --- messages ---
export const insertMessage = db.prepare(
  "INSERT INTO messages (lead_id, direction, body) VALUES (?, ?, ?)"
);
export const messagesForLead = db.prepare(
  "SELECT * FROM messages WHERE lead_id = ? ORDER BY id ASC"
);

export function agentStats(agentId) {
  return db
    .prepare(
      `SELECT
        COUNT(*) AS total_leads,
        SUM(CASE WHEN status IN ('qualified','handoff') THEN 1 ELSE 0 END) AS hot_leads,
        SUM(CASE WHEN status = 'engaged' THEN 1 ELSE 0 END) AS engaged,
        CAST(AVG(first_response_ms) AS INTEGER) AS avg_first_response_ms
      FROM leads WHERE agent_id = ?`
    )
    .get(agentId);
}

import { Router } from "express";
import twilio from "twilio";
import {
  getAgentByWebhookToken,
  getAgentByTwilioNumber,
  findLead,
  insertLead,
  insertMessage,
  messagesForLead,
  updateLeadQualification,
  touchLead,
  setLeadStatus,
  setFirstResponse,
  getAgentById,
} from "../db.js";
import { converse } from "../ai.js";
import { sendSms, normalizePhone } from "../sms.js";

export const webhooks = Router();

const STOP_WORDS = /^\s*(stop|stopall|unsubscribe|cancel|end|quit)\s*$/i;

function applyQualification(leadId, q, currentStatus) {
  let status = currentStatus === "new" ? "engaged" : currentStatus;
  if (q.opted_out) status = "opted_out";
  else if (q.ready_for_handoff) status = "handoff";
  else if (q.intent !== "unknown" && q.timeline) status = "qualified";
  updateLeadQualification.run({
    id: leadId,
    status,
    intent: q.intent,
    timeline: q.timeline,
    budget: q.budget,
    preapproved: q.preapproved === null ? null : q.preapproved ? 1 : 0,
    area: q.area,
  });
  return status;
}

async function notifyAgentHandoff(agent, lead, q) {
  const parts = [
    `🔥 HOT LEAD: ${lead.name || lead.phone}`,
    q.intent && q.intent !== "unknown" ? `Wants to ${q.intent}` : null,
    q.area ? `Area: ${q.area}` : null,
    q.budget ? `Budget: ${q.budget}` : null,
    q.timeline ? `Timeline: ${q.timeline}` : null,
    q.preapproved === true ? "Pre-approved ✅" : q.preapproved === false ? "Not pre-approved yet" : null,
    `Text them now: ${lead.phone}`,
  ].filter(Boolean);
  try {
    await sendSms({ to: agent.phone, from: agent.twilio_number, body: parts.join("\n") });
  } catch (err) {
    console.error("handoff notification failed:", err.message);
  }
}

/**
 * Inbound lead webhook — point Zapier/Make (Zillow email parser, Facebook Lead Ads, IDX forms) here.
 * POST /webhooks/lead/:token  { name?, phone, email?, source?, message? }
 */
webhooks.post("/lead/:token", async (req, res) => {
  const agent = getAgentByWebhookToken.get(req.params.token);
  if (!agent) return res.status(404).json({ error: "unknown webhook token" });
  if (!["trial", "active"].includes(agent.subscription_status)) {
    return res.status(402).json({ error: "subscription inactive" });
  }

  const phone = normalizePhone(req.body.phone);
  if (!phone) return res.status(400).json({ error: "valid phone required" });

  let lead = findLead.get(agent.id, phone);
  const isNew = !lead;
  if (isNew) {
    insertLead.run({
      agent_id: agent.id,
      name: (req.body.name || "").trim(),
      phone,
      email: (req.body.email || "").trim(),
      source: (req.body.source || "webhook").trim(),
    });
    lead = findLead.get(agent.id, phone);
  }
  // Ack immediately — Zapier shouldn't wait on the AI call.
  res.json({ ok: true, lead_id: lead.id, new: isNew });
  if (!isNew) return; // duplicate submission; existing conversation continues on its own

  const startedAt = Date.now();
  try {
    // If the lead form included a message, treat it as their first inbound text.
    if (req.body.message) insertMessage.run(lead.id, "in", String(req.body.message));
    const history = req.body.message ? [{ direction: "in", body: String(req.body.message) }] : [];
    const q = await converse(agent, lead, history, { kickoff: history.length === 0 });

    await sendSms({ to: phone, from: agent.twilio_number, body: q.reply });
    insertMessage.run(lead.id, "out", q.reply);
    setFirstResponse.run(Date.now() - startedAt, lead.id);
    const status = applyQualification(lead.id, q, lead.status);
    if (status === "handoff") await notifyAgentHandoff(agent, lead, q);
    console.log(`lead ${lead.id}: first text sent in ${Date.now() - startedAt}ms`);
  } catch (err) {
    console.error(`lead ${lead.id}: kickoff failed:`, err);
  }
});

/**
 * Twilio inbound SMS webhook (configure on each Twilio number):
 * POST /webhooks/twilio/sms  (application/x-www-form-urlencoded: From, To, Body)
 * Replies via TwiML so the response rides the same webhook round-trip.
 */
webhooks.post("/twilio/sms", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const respond = () => res.type("text/xml").send(twiml.toString());

  const agent = getAgentByTwilioNumber.get(req.body.To);
  const from = normalizePhone(req.body.From);
  const body = (req.body.Body || "").trim();
  if (!agent || !from || !body) return respond();

  let lead = findLead.get(agent.id, from);
  if (!lead) {
    // Unknown number texted the Closemate line — treat as an organic lead.
    insertLead.run({ agent_id: agent.id, name: "", phone: from, email: "", source: "inbound_sms" });
    lead = findLead.get(agent.id, from);
  }

  insertMessage.run(lead.id, "in", body);
  touchLead.run(lead.id);

  // Carrier-level compliance: honor STOP immediately, no AI involved.
  if (STOP_WORDS.test(body)) {
    setLeadStatus.run("opted_out", lead.id);
    return respond(); // Twilio handles the mandated STOP confirmation itself
  }
  if (lead.status === "opted_out") return respond();

  try {
    const history = messagesForLead.all(lead.id);
    const q = await converse(agent, lead, history);
    twiml.message(q.reply);
    respond();
    insertMessage.run(lead.id, "out", q.reply);
    const status = applyQualification(lead.id, q, lead.status);
    if (status === "handoff") {
      const freshAgent = getAgentById.get(agent.id);
      await notifyAgentHandoff(freshAgent, lead, q);
    }
  } catch (err) {
    console.error(`lead ${lead.id}: reply failed:`, err);
    if (!res.headersSent) respond(); // silent failure beats a broken auto-text
  }
});

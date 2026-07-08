import { Router } from "express";
import {
  getAgentByAccessToken,
  leadsForAgent,
  messagesForLead,
  findLead,
  agentStats,
} from "../db.js";

export const dashboard = Router();

function auth(req, res, next) {
  const token = req.query.token || req.headers["x-access-token"];
  const agent = token && getAgentByAccessToken.get(token);
  if (!agent) return res.status(401).json({ error: "invalid token" });
  req.agent = agent;
  next();
}

dashboard.get("/me", auth, (req, res) => {
  const { access_token, webhook_token, ...safe } = req.agent;
  res.json({
    ...safe,
    stats: agentStats(req.agent.id),
    lead_webhook_url: `${process.env.BASE_URL || ""}/webhooks/lead/${webhook_token}`,
  });
});

dashboard.get("/leads", auth, (req, res) => {
  res.json(leadsForAgent.all(req.agent.id));
});

dashboard.get("/leads/:id/messages", auth, (req, res) => {
  // Scope check: the lead must belong to this agent.
  const lead = leadsForAgent
    .all(req.agent.id)
    .find((l) => l.id === Number(req.params.id));
  if (!lead) return res.status(404).json({ error: "not found" });
  res.json(messagesForLead.all(lead.id));
});

import { staleLeads, insertMessage, bumpFollowupStage, getAgentById } from "./db.js";
import { sendSms } from "./sms.js";

// Follow-up ladder: stage index -> (minimum silence before sending, template).
// Templates beat AI generation here: deterministic, compliant, and free.
const LADDER = [
  {
    after: "-1 hours",
    text: (lead, agent) =>
      `Hey${lead.name ? ` ${lead.name.split(" ")[0]}` : ""}, just making sure my last text came through! Still happy to help whenever you're ready.`,
  },
  {
    after: "-24 hours",
    text: (lead, agent) =>
      `Hi${lead.name ? ` ${lead.name.split(" ")[0]}` : ""} — no rush at all. When you're ready to chat about your home search, I'm here. Anything I can look into for you in the meantime?`,
  },
  {
    after: "-72 hours",
    text: (lead, agent) =>
      `Last check-in from me — if the timing isn't right, totally understand. If anything changes, ${agent.name} would love to help. Have a great one!`,
  },
];

async function runOnce() {
  for (let stage = 0; stage < LADDER.length; stage++) {
    const { after, text } = LADDER[stage];
    // Only leads sitting exactly at this stage and silent long enough.
    const due = staleLeads.all(after).filter((l) => l.followup_stage === stage);
    for (const lead of due) {
      try {
        const agent = getAgentById.get(lead.agent_id);
        const body = text(lead, agent);
        await sendSms({ to: lead.phone, from: lead.twilio_number, body });
        insertMessage.run(lead.id, "out", body);
        bumpFollowupStage.run(stage + 1, lead.id);
        console.log(`follow-up stage ${stage + 1} sent to lead ${lead.id}`);
      } catch (err) {
        console.error(`follow-up failed for lead ${lead.id}:`, err.message);
      }
    }
  }
}

export function startFollowupLoop() {
  const INTERVAL_MS = 10 * 60 * 1000; // every 10 minutes
  setInterval(() => runOnce().catch((e) => console.error("followup loop:", e)), INTERVAL_MS);
  console.log("follow-up loop started (10m interval)");
}

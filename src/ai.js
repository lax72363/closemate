import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.MODEL || "claude-opus-4-8";

let _client;
function client() {
  if (!_client) _client = new Anthropic(); // reads ANTHROPIC_API_KEY
  return _client;
}

// The model returns its reply AND the qualification state in one structured call.
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply: {
      type: "string",
      description:
        "The SMS to send to the lead. 1-2 short sentences, max ~300 characters, exactly one question. Casual, warm, human. No emojis unless the lead uses them first.",
    },
    intent: { type: "string", enum: ["buy", "sell", "rent", "unknown"] },
    timeline: {
      type: ["string", "null"],
      description: "Lead's timeline in their words, e.g. 'next 3 months', or null if unknown.",
    },
    budget: { type: ["string", "null"], description: "Budget/price range if mentioned, else null." },
    preapproved: {
      type: ["boolean", "null"],
      description: "Whether the lead is pre-approved for a mortgage. null if unknown or not applicable.",
    },
    area: { type: ["string", "null"], description: "Area/neighborhood of interest, else null." },
    ready_for_handoff: {
      type: "boolean",
      description:
        "true when the lead is qualified enough (intent + timeline known, engaged and responsive) OR explicitly asks to speak to the agent, so the human agent should take over now.",
    },
    opted_out: {
      type: "boolean",
      description: "true if the lead asked to stop being contacted or is clearly not interested.",
    },
  },
  required: ["reply", "intent", "timeline", "budget", "preapproved", "area", "ready_for_handoff", "opted_out"],
  additionalProperties: false,
};

function systemPrompt(agent, lead) {
  return `You are ${agent.name}'s assistant, texting on their behalf. ${agent.name} is a real estate agent${agent.market ? ` in ${agent.market}` : ""}.

Your job over SMS:
1. Respond fast and warmly to new leads who inquired about real estate online.
2. Naturally learn: are they buying/selling/renting, their timeline, target area, budget, and (for buyers) whether they're pre-approved for a mortgage.
3. Ask ONE question per message. Keep every message to 1-2 short sentences — this is texting, not email.
4. Never pressure. Mirror their energy. If they ask a question you can't answer (specific property details, legal, pricing advice), say ${agent.name} will follow up personally and mark them ready for handoff.
5. When they're qualified (intent + timeline known and they're engaged) or ask for the agent, tell them ${agent.name} will reach out shortly${agent.booking_url ? `, and share this scheduling link: ${agent.booking_url}` : ""}.
6. If they say stop / not interested, respect it immediately and reply with a single polite sign-off.
7. Never claim to be an AI unless directly asked; if directly asked, be honest that you're ${agent.name}'s automated assistant and offer to connect them with ${agent.name}.
8. Never invent property details, prices, or availability.

Lead context: name="${lead.name || "unknown"}", source=${lead.source}.
${agent.persona_notes ? `Agent notes: ${agent.persona_notes}` : ""}`;
}

/**
 * Generate the next SMS reply + updated qualification for a lead.
 * history: [{direction: 'in'|'out', body}] oldest-first. The latest inbound message is last.
 * For a brand-new lead with no history, pass [] and set kickoff=true.
 */
export async function converse(agent, lead, history, { kickoff = false } = {}) {
  const messages = history.map((m) => ({
    role: m.direction === "in" ? "user" : "assistant",
    content: m.body,
  }));
  if (kickoff) {
    messages.push({
      role: "user",
      content:
        "[SYSTEM NOTE: This lead just submitted an inquiry online. Send the opening text introducing yourself as the agent's assistant and asking how you can help / confirming what they're looking for.]",
    });
  }

  const response = await client().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: systemPrompt(agent, lead),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
    output_config: {
      format: { type: "json_schema", schema: RESPONSE_SCHEMA },
    },
  });

  if (response.stop_reason === "refusal") {
    // Extremely unlikely for this domain, but never crash the webhook path.
    return {
      reply: `Thanks for reaching out! ${agent.name} will text you personally shortly.`,
      intent: "unknown",
      timeline: null,
      budget: null,
      preapproved: null,
      area: null,
      ready_for_handoff: true,
      opted_out: false,
    };
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "{}";
  return JSON.parse(text);
}

// Founder onboarding CLI: create an agent after they pay.
// Usage:
//   npm run create-agent -- --name "Jane Doe" --phone "+15125550100" --email jane@x.com \
//     --market "Austin, TX" --twilio "+15125550999" [--booking https://calendly.com/jane] [--notes "..."]
import "dotenv/config";
import crypto from "node:crypto";
import { insertAgent } from "../src/db.js";

function arg(flag) {
  const i = process.argv.indexOf(`--${flag}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const name = arg("name");
const phone = arg("phone");
const twilio_number = arg("twilio");
if (!name || !phone || !twilio_number) {
  console.error('Required: --name "Jane Doe" --phone "+1512..." --twilio "+1512..."');
  process.exit(1);
}

const webhook_token = crypto.randomBytes(16).toString("hex");
const access_token = crypto.randomBytes(16).toString("hex");

insertAgent.run({
  name,
  phone,
  twilio_number,
  email: arg("email") || "",
  market: arg("market") || "",
  persona_notes: arg("notes") || "",
  booking_url: arg("booking") || "",
  webhook_token,
  access_token,
});

const base = process.env.BASE_URL || "http://localhost:3000";
console.log(`
Agent created: ${name}

  Lead webhook (paste into Zapier/Make):
    ${base}/webhooks/lead/${webhook_token}

  Dashboard link (send to the agent):
    ${base}/dashboard.html?token=${access_token}

  Twilio setup: point the SMS webhook for ${twilio_number} to
    ${base}/webhooks/twilio/sms   (HTTP POST)
`);

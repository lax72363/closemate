import twilio from "twilio";

let _client;
function client() {
  if (!_client) {
    _client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return _client;
}

export async function sendSms({ to, from, body }) {
  if (process.env.SMS_DRY_RUN === "1") {
    console.log(`[SMS DRY RUN] ${from} -> ${to}: ${body}`);
    return { sid: "dry_run" };
  }
  return client().messages.create({ to, from, body });
}

/** Normalize a US phone number to E.164 (+1XXXXXXXXXX). Returns null if unparseable. */
export function normalizePhone(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (String(raw).startsWith("+") && digits.length >= 10) return `+${digits}`;
  return null;
}

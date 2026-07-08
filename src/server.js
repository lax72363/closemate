import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { webhooks } from "./routes/webhooks.js";
import { dashboard } from "./routes/dashboard.js";
import { billing, stripeWebhookHandler } from "./routes/billing.js";
import { startFollowupLoop } from "./followup.js";

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));

// Stripe webhook needs the raw body — mount BEFORE json parsing.
app.post("/billing/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Twilio posts form-encoded

app.use("/webhooks", webhooks);
app.use("/api", dashboard);
app.use("/billing", billing);
app.use(express.static(path.join(here, "..", "public")));

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`closemate listening on :${port}`);
  startFollowupLoop();
});

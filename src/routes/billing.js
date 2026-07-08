import { Router } from "express";
import Stripe from "stripe";
import { db, setSubscriptionStatus } from "../db.js";

export const billing = Router();

let _stripe;
function stripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

/**
 * Create a Stripe Checkout session for the Solo plan.
 * The agent record is created manually after payment (founder-led onboarding)
 * via `npm run create-agent`; client_reference_id ties payment -> agent later.
 */
billing.post("/checkout", async (req, res) => {
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_email: req.body.email,
      success_url: `${process.env.BASE_URL}/?paid=1`,
      cancel_url: `${process.env.BASE_URL}/?canceled=1`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("checkout failed:", err.message);
    res.status(500).json({ error: "checkout failed" });
  }
});

/**
 * Stripe webhook — keeps subscription_status in sync.
 * Mount with express.raw() (see server.js): signature verification needs the raw body.
 */
export function stripeWebhookHandler(req, res) {
  let event;
  try {
    event = stripe().webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  const obj = event.data.object;
  const findByCustomer = db.prepare("SELECT id FROM agents WHERE stripe_customer_id = ?");
  const findByEmail = db.prepare("SELECT id FROM agents WHERE email = ?");

  switch (event.type) {
    case "checkout.session.completed": {
      const agent =
        (obj.customer && findByCustomer.get(obj.customer)) ||
        (obj.customer_details?.email && findByEmail.get(obj.customer_details.email));
      if (agent) setSubscriptionStatus.run("active", obj.customer, agent.id);
      else console.log(`payment received for ${obj.customer_details?.email} — create their agent with: npm run create-agent`);
      break;
    }
    case "invoice.payment_failed": {
      const agent = obj.customer && findByCustomer.get(obj.customer);
      if (agent) setSubscriptionStatus.run("past_due", null, agent.id);
      break;
    }
    case "customer.subscription.deleted": {
      const agent = obj.customer && findByCustomer.get(obj.customer);
      if (agent) setSubscriptionStatus.run("canceled", null, agent.id);
      break;
    }
  }
  res.json({ received: true });
}

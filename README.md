# Closemate

**Speed-to-lead AI for real estate agents.** Texts every incoming lead back in under 60 seconds, qualifies them over natural SMS (intent, timeline, budget, pre-approval), and hands hot leads straight to the agent's phone. Non-responders get automatic follow-ups at 1h / 24h / 72h.

- 📈 Strategy & opportunity analysis: [`docs/STRATEGY.md`](docs/STRATEGY.md)
- 🚀 Pricing, outreach scripts, TikTok/SEO, referrals, retention: [`docs/PLAYBOOK.md`](docs/PLAYBOOK.md)

## Architecture

```
Zillow / FB Lead Ads / IDX form
        │  (via Zapier/Make webhook)
        ▼
POST /webhooks/lead/:token ──► create lead ──► Claude generates opener ──► Twilio SMS to lead
                                                                              │
lead replies ──► Twilio ──► POST /webhooks/twilio/sms ──► Claude (structured  │
                            output: reply + qualification) ──► TwiML reply ◄──┘
                                       │
                     qualified? ──► 🔥 SMS handoff to the agent's own phone

background: follow-up loop (10-min tick) nudges silent leads at 1h / 24h / 72h
dashboard:  /dashboard.html?token=... (pipeline, conversations, speed stats)
billing:    Stripe Checkout + webhook keeps subscription_status in sync
```

Stack: Node 20+, Express, SQLite (`better-sqlite3` — one file, zero ops), `@anthropic-ai/sdk` (default model `claude-opus-4-8`, structured outputs so every AI turn returns both the SMS reply and the updated qualification), Twilio, Stripe.

## Run it

```bash
cp .env.example .env   # fill in keys
npm install
npm start              # http://localhost:3000
```

Local testing without burning SMS credits: set `SMS_DRY_RUN=1` (messages log to stdout).

## Onboard a customer (founder flow)

1. Buy them a Twilio number; point its SMS webhook at `POST {BASE_URL}/webhooks/twilio/sms`.
2. `npm run create-agent -- --name "Jane Doe" --phone "+1512..." --twilio "+1512..." --market "Austin, TX" --email jane@x.com`
3. Send them the printed dashboard link; paste the printed lead-webhook URL into their Zapier/Make zap (Zillow email parser / Facebook Lead Ads trigger).
4. Submit a test lead on the call. Watch their face when their phone buzzes.

## Deploy

Railway or Render, one service. Set env vars from `.env.example`, add a persistent volume mounted at `./data`. Point `BASE_URL` at the public URL and configure the Stripe webhook (`/billing/webhook`) and Twilio number webhooks.

## Compliance notes (read before texting real leads)

- **A2P 10DLC**: register your Twilio brand + campaign before production traffic (takes days — start early).
- **TCPA**: only text leads who submitted their info requesting contact. STOP is honored instantly in code (`src/routes/webhooks.js`), before any AI runs.
- Stripe account holder must be 18+ — use a parent/guardian or an existing entity with an adult representative.

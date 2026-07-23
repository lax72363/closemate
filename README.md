# CloseMate

**A 24/7 AI assistant that turns real estate agents' website visitors into
qualified leads — sold as a productized service ($299 setup + $99/mo).**

Built as a complete, sellable business in one autonomous session: product,
demo, sales assets, and operations docs. The only human steps left are the ones
a sandbox can't do (deploy, payment link, hitting "send") — batched in
[`HUMAN_CHECKLIST.md`](HUMAN_CHECKLIST.md) (~2 hours total).

## What's here

| Path | What it is |
|---|---|
| `server/` | Node/Express server: Claude-powered chat + lead capture (`save_lead` tool), JSONL lead store, webhook alerts, rate limiting, mock mode for zero-cost demos |
| `public/widget/closemate.js` | Embeddable chat widget — one `<script>` tag installs it on any client website |
| `public/demo.html` | Live demo: a realistic (fictional) agent website with the widget installed — the primary sales asset |
| `public/index.html` | CloseMate's own sales landing page |
| `public/dashboard.html` | Client-facing lead dashboard (token-protected) |
| `docs/STRATEGY.md` | Business-model analysis and why this play maximizes 72h expected profit |
| `docs/SALES_PLAYBOOK.md` | Cold email sequences, DM scripts, objection handling, daily cadence, pricing |
| `docs/DEPLOY.md` | 10-minute deployment guide (Render free tier) + client-site install |
| `docs/ONBOARDING_SOP.md` | Pay → live-in-24h client onboarding procedure |
| `HUMAN_CHECKLIST.md` | **Start here** — every human action, batched |

## Quick start (local)

```bash
cd server
npm install
npm run dev        # mock mode — no API key needed
# open http://localhost:3000/demo.html and chat
# leads: http://localhost:3000/dashboard.html (token: changeme)
```

Production: set `ANTHROPIC_API_KEY` and the `AGENT_*` variables — see
`server/.env.example` and `docs/DEPLOY.md`.

## Architecture (deliberately boring)

One deployment per client. Env-var configuration. JSONL lead storage. No
database, no auth system, no multi-tenancy — because at $99/mo/client the
winning move is operational simplicity, and a re-skin for another vertical
(dentists, law firms) is just different env vars and landing copy.

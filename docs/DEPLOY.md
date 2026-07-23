# Deploying CloseMate

One deployment = one client (agent). This keeps operations trivial: no
multi-tenancy, no shared data, per-client env vars.

## Option A — Render.com (recommended, free tier, ~10 minutes)

1. Push this repo to GitHub (already done if you're reading this there).
2. Create a free account at https://render.com → **New → Web Service** → connect
   the repo.
3. Settings:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
4. Environment variables (from `server/.env.example`):
   - `ANTHROPIC_API_KEY` — from https://platform.claude.com (a few dollars of
     credit runs hundreds of conversations)
   - `AGENT_NAME`, `AGENT_BROKERAGE`, `AGENT_MARKET`, `AGENT_PHONE`,
     `AGENT_EMAIL`, optionally `AGENT_CALENDAR_URL`
   - `DASHBOARD_TOKEN` — any long random string (this is the client's dashboard
     password)
   - `NOTIFY_WEBHOOK` — optional; a Zapier/Make "catch hook" that emails/texts
     the lead to the agent
5. Deploy. Your instance is at `https://<name>.onrender.com`:
   - `/` — CloseMate landing page (use this as YOUR sales site)
   - `/demo.html` — live demo (use this link in outreach)
   - `/dashboard.html` — client's lead dashboard
   - `/widget/closemate.js` — the embeddable widget

> Free-tier note: Render free services sleep after inactivity and take ~30s to
> wake. Fine for your demo instance. For paying clients use the $7/mo instance
> (cost covered ~14x by the $99/mo fee) or run several clients per instance
> with separate deployments.

## Option B — Any VPS / your own machine

```bash
cd server
cp .env.example .env   # edit values
npm install
npm start              # serves on PORT (default 3000)
```

## Installing on a client's website

Add one line before `</body>` on their site (works on WordPress via a
header/footer plugin, Wix/Squarespace via "custom code" settings):

```html
<script src="https://THEIR-CLOSEMATE-INSTANCE.onrender.com/widget/closemate.js" defer></script>
```

That's the entire install. The widget reads its config from the server, so
changing the agent's greeting/market later requires no site changes.

## Lead notifications without writing code

Set `NOTIFY_WEBHOOK` to a Zapier (free tier) Catch Hook URL and add one action:
"Send Email" (to the agent) or "Send SMS". Every `save_lead` call POSTs:

```json
{ "source": "closemate", "agent": "...", "lead": { "name": "...", "phone": "...", "...": "..." } }
```

## Mock mode (no API key)

With `ANTHROPIC_API_KEY` unset (or `MOCK=1`), the server runs a scripted
conversation that still captures leads — free demos with zero API cost. Set the
real key for production deployments; the scripted flow is obviously simpler
than the real model.

## Smoke test after any deploy

1. `GET /health` → `{"ok":true, ...}` and confirm `mock` is what you expect.
2. Open `/demo.html`, chat, give a fake name + email.
3. Open `/dashboard.html`, enter the token → the lead is there.

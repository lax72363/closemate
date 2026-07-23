# Your entire to-do list (batched — everything I can't do from the sandbox)

Total hands-on time to be "in business": **≈ 2 hours.** Do them in order.

## Phase 1 — Go live (≈ 30 min, do once)

- [ ] **Deploy the demo instance** (10 min): follow `docs/DEPLOY.md` Option A
      (Render free tier). You can deploy WITHOUT an API key first — mock mode
      makes the demo work at zero cost. Result: a public URL.
- [ ] **(Recommended) Add an Anthropic API key** (5 min): create one at
      https://platform.claude.com, load $5 of credit, set `ANTHROPIC_API_KEY`
      on the deployment. This makes the demo genuinely impressive instead of
      scripted. $5 ≈ dozens-to-hundreds of demo conversations.
- [ ] **Create the Stripe payment link** (10 min): stripe.com → Payment Links →
      one link: "CloseMate Setup — $299" + recurring "$99/month" (Stripe
      supports one-time + subscription in a single link). Paste the URL into
      `docs/SALES_PLAYBOOK.md` where it says `[STRIPE_LINK]`.
- [ ] **Smoke test** (5 min): open `<your-url>/demo.html`, chat as a fake buyer
      with a fake email, confirm the lead shows at `<your-url>/dashboard.html`
      (token: whatever you set as `DASHBOARD_TOKEN`).

## Phase 2 — Sell (≈ 90 min on day 1, then ~30 min/day replying)

- [ ] **Build the prospect list** (30 min): 50–100 agents per
      `docs/SALES_PLAYBOOK.md` → "Where to find them". A spreadsheet with
      name, email, website, one personal detail. (Tip: paste a Google Maps
      results page into any AI chat and ask it to extract names + websites.)
- [ ] **Send batch 1** (45 min): 50 emails using Sequence A from the playbook,
      from your normal email address (50/day from a personal Gmail is safe;
      don't blast 500). Replace `[DEMO_URL]` with `<your-url>/demo.html`.
- [ ] **Join 3 local realtor Facebook groups** (10 min) and send 10 DMs with
      the DM script.
- [ ] **Reply fast.** Speed-to-reply is the single highest-leverage sales
      behavior. Use the close script + objection table in the playbook.

## Phase 3 — When someone pays (≤ 30 min per client)

- [ ] Follow `docs/ONBOARDING_SOP.md` top to bottom. Each client is a fresh
      deployment with their env vars.

## Decision points I've pre-made for you (see docs/STRATEGY.md)

- <2 replies after batch 1 → switch to email Sequence B (already written).
- Price objections → fallback $149 setup (never discount the $99/mo).
- Vertical saturated → re-skin for dentists/law/med-spas: 6 env vars + copy.

## What I already did (no action needed)

- Product: chat server + Claude qualification engine + lead store + webhook
  alerts + rate limiting (`server/`), tested end to end.
- Embeddable widget, one-line install (`public/widget/closemate.js`).
- Live demo site (`/demo.html`), sales landing page (`/`), client lead
  dashboard (`/dashboard.html`).
- Strategy + market analysis, full sales playbook (emails, DMs, objections,
  cadence), onboarding SOP, deployment guide.

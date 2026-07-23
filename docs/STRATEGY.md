# CloseMate — 72-Hour Profit Strategy

## Objective
Maximize legal net profit in 72 hours, starting from $0, with minimal human involvement.

## Honest framing
An AI agent in a sandbox cannot open payment accounts, send email, or post to
social platforms. So the strategy is: **automate 95% of a business whose last 5%
(deploy, payment link, hitting "send" on outreach) takes a human under 2 hours,**
and pick the business model where those 2 hours have the highest expected payoff.

## Model screening (summary of ~10 finalist categories from a wider scan)

Scored 1–5 on: revenue probability inside 72h (P), $0 startup (C), competition
moat-in-72h (M), automation potential (A), scalability (S), expected value (EV).

| # | Model | P | C | M | A | S | Why it loses / wins |
|---|-------|---|---|---|---|---|---------------------|
| 1 | **Productized AI chatbot for real estate agents** | 4 | 5 | 4 | 5 | 4 | **Winner — see below** |
| 2 | Same product, other verticals (dentists, law, HVAC) | 4 | 5 | 4 | 5 | 4 | Equal EV; kept as the pre-built pivot (config-only re-skin) |
| 3 | Cold-outreach lead-gen service (done-for-you emails) | 3 | 5 | 2 | 4 | 3 | Sellable fast but deliverability takes days to warm up |
| 4 | Notion/template digital products on Gumroad | 2 | 5 | 1 | 5 | 3 | Marketplace traffic takes weeks; $19 price points need volume |
| 5 | AI website-audit reports for local businesses | 3 | 5 | 2 | 5 | 3 | Good tripwire; low ticket ($49–99) caps 72h upside |
| 6 | Freelance-platform arbitrage (Upwork + AI delivery) | 3 | 5 | 2 | 3 | 2 | New accounts have zero reviews; slow first-sale cycle |
| 7 | Micro-SaaS (generic; build + launch on PH/HN) | 1 | 5 | 2 | 4 | 5 | Distribution takes far longer than 72h |
| 8 | Affiliate/SEO content site | 1 | 5 | 1 | 5 | 4 | Indexing alone exceeds the window |
| 9 | Paid newsletter / community | 1 | 5 | 1 | 4 | 4 | Audience-dependent; none exists |
| 10 | Print-on-demand / e-commerce | 1 | 4 | 1 | 3 | 3 | Needs ad spend; violates $0 constraint in practice |

## Why the winner wins
1. **The buyer already pays for this outcome.** Agents spend $300–1,500+/mo on
   Zillow leads and ads. "Capture the leads your website already gets" is a
   budget-reallocation sale, not a new-budget sale.
2. **High ticket → one sale = real revenue.** $299 setup + $99/mo. Two sales in
   72h = ~$800 collected, ~$2,700+ annualized. Marketplaces can't match that
   inside the window.
3. **Speed to a demo.** The single most persuasive sales asset — a live demo of
   the bot on a realistic agent site — is fully buildable by AI (done, `/demo.html`).
4. **Reachable buyers.** Agents publish their emails and answer DMs; local
   Realtor lists are public. 100 personalized emails is one human-hour with the
   templates provided.
5. **Near-total automation.** Product, demo, landing page, sales copy, outreach
   sequences, onboarding SOP, dashboard: all built. Human does: deploy (10 min),
   Stripe payment link (10 min), send outreach (60–90 min), reply to interest.

## Unit economics
- Revenue: $299 setup + $99/mo per client.
- COGS: hosting free tier ($0) + Claude API. A typical qualification conversation
  runs well under $0.05–0.15; even a busy site costs a few dollars/mo. Gross
  margin ≈ 95%+.
- 30-day "first lead or refund" guarantee is safe: any site with traffic will
  capture at least one lead.

## Realistic 72h forecast (not hype)
- 100 personalized cold emails + 20 Facebook-group DMs → 3–8 replies → 1–3
  demos → **0–2 paying clients ($0–$800 cash in window)**, with a pipeline that
  keeps converting after the window. Expected value ≈ $300–500 in-window,
  materially higher over 30 days. Doing nothing yields $0; every alternative
  model scored lower on in-window EV.

## Pivot triggers (pre-decided, no deliberation needed)
- **<2 replies after 100 emails in 24h** → switch subject lines/templates (B set
  in the playbook), add FB-group DMs and local Realtor association boards.
- **Replies but price objections** → drop setup fee to $149, keep $99/mo.
- **Real estate saturated in your area** → re-skin for dentists/med-spas/law:
  change 6 env vars + landing copy (30 min); the codebase is vertical-agnostic.

## Scale path (after 72h)
Week 2+: raise to $499 setup, add SMS alerts (Twilio), multi-tenant hosting,
white-label reseller deals with web-design agencies (they sell, you host, split
$99/mo). At 25 clients this is ~$2,500 MRR at ~95% margin for ~2h/week of ops.

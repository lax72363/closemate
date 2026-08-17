# 03 — The closemate Operating System

The complete machine: offer → funnel → fulfillment → automation → org design. The
design principle throughout: **your workload must fall as revenue rises.** Every
function below has an explicit Human → AI → Automation → Contractor → Software
migration path.

## The offer

| Element | Spec |
|---|---|
| Target customer | Residential real estate agents doing 8+ transactions/yr and small teams (2–10 agents) who **already buy leads** (Zillow, realtor.com, PPC, open houses). Year 2+: team leads and boutique brokerages |
| Pain point | They pay $300–$1,000+/mo for leads, then respond in 15+ hours (industry average 917 minutes; 63.5% of inquiries get no response at all) while conversion research shows a 5-minute response makes a lead ~21x more likely to qualify. They know this. They feel guilty about it. They can't fix it because they're at showings all day |
| Core promise | "Every lead answered in under 60 seconds, qualified, and booked on your calendar — 24/7." |
| Pricing | Founding: $147/mo flat. Standard: $197/mo. Team: $397–597/mo. **No per-message fees** (direct attack on Structurely's $0.12/action meter). No contract. 14-day free start |
| Guarantee | "If closemate doesn't book at least one appointment in your first 30 paid days, that month is free." (Cheap to honor at 85% margin; devastating in a sales conversation) |
| What it does v1 | New lead (from Zillow email, website form, FB lead ad, sign call) → instant SMS within 60s → AI qualification conversation (budget, timeline, pre-approval, area) → books slot on agent's calendar → agent gets a briefing text. Non-responders get a 6-touch, 8-week nurture sequence. Everything logged |
| What it is NOT | Not a lead seller, not a CRM replacement, not a brokerage (no licensed activity — it schedules and qualifies; the agent does all real estate. See plan/05) |

## Sales funnel

```
Mystery-shop proof email/DM  ──► 15-min demo call ──► 14-day free start ──► $147/mo card-on-file
        (or referral / partner intro)         (Cal.com)        (setup done FOR them in 48h)
```

- **Landing page** (one page, Carrd): Headline "Your leads are dying in your inbox" →
  their-market stat bar → 60-second demo video (screen recording of a live lead
  conversation) → 3 testimonial blocks → pricing table (flat fee vs. "Structurely
  $499+metered") → FAQ (compliance, cancel-anytime) → single CTA: "Get set up in 48
  hours" → Cal.com embed.
- **Checkout**: Stripe Payment Link (subscription, 14-day trial, card required) — no
  cart, no upsell friction at v1. Later: Stripe Checkout inside the SaaS app.
- **Demo call script** (15 min): 2 min — show THEM their own mystery-shop response
  time. 5 min — live demo: text the closemate demo number, watch it qualify and book.
  3 min — price + guarantee. 5 min — objections (compliance, "my leads are different",
  "I'll do it myself"). Close: "Your setup call is Tuesday or Thursday?"

## Acquisition strategy (channel stack, in activation order)

1. **Proof-based outreach (month 1+, CAC ~$50–150).** Scrape target agents
   (Outscraper/state license lists, ~$30). Mystery-shop their lead funnel. Send
   evidence + offer. 100 touches/wk manually → 300/wk once templated and
   VA/AI-assisted. Expected: 3–5% → demo, 40% of demos close.
2. **Referrals (month 2+, CAC ~$150).** Automated ask at each client's first booked
   appointment ("Know another agent drowning in leads? One free month for each
   referral who joins"). Agents talk to agents daily; this compounds.
3. **Partnerships (month 6+, CAC near $0, the whale channel).** Lead vendors, ISA
   coaches, brokerage team leads, RE coaching programs: 20% recurring rev-share for
   introduced accounts. One brokerage deal = 10–30 agents.
4. **Content/proof loop (ongoing, $0).** Monthly "State of Speed-to-Lead in [Metro]"
   report from your own mystery-shop data — genuinely newsworthy to local RE Facebook
   groups; every report is 500 warm impressions.
5. **Paid ads (only after 25 organic clients, per plan/02 rules).** Meta lead ads to
   agents (targeting: job titles, RE audiences) → demo funnel. Budget and kill rules
   in plan/02.

## Fulfillment system (v1 → v3)

**v1 (months 1–12) — assembled, not built:**
- Twilio number per client (A2P 10DLC registered — see plan/05, non-negotiable)
- Lead capture: Zapier/Make email-parse of Zillow/realtor.com lead emails + webhook
  from website forms + FB Lead Ads connector
- Brain: Make/n8n scenario → Claude API with a per-client system prompt (agent name,
  market, calendar link, qualification questions, Fair-Housing-safe language rules,
  escalation triggers)
- Booking: Cal.com (free) on agent's calendar; confirmation + reminder SMS
- Client visibility: nightly digest SMS/email + shared Airtable view (leads, replies,
  bookings) — churn prevention is *visibility*, clients cancel what they can't see
- Onboarding: Tally intake form → you (later VA) configure in a 30-min template flow
  → live in 48h

**v2 (year 2) — hardened:** n8n self-hosted ($10 VPS) replaces Make at volume; config
templated so a VA does full setup; human-escalation path (AI hands complex threads to
the agent with full context).

**v3 (year 3) — product:** proper multi-tenant app (Supabase + hosted frontend,
contract dev ~$25–40k): self-signup, onboarding wizard, dashboard, billing portal,
white-label option for brokerages. The service becomes SaaS; margins hold, labor drops
to near zero per marginal client.

## The autopilot map

Who does each function **now → at $10k MRR → at $50k+ MRR**. (H = you, AI = AI agent,
A = deterministic automation, C = contractor, S = software product feature.)

| Function | Months 1–6 | At $10k MRR | At $50k+ MRR | Never fully automatable? |
|---|---|---|---|---|
| **Acquisition** (finding prospects) | H+A: scraping scripts, list building | A: scheduled scrapes, enrichment; AI scores leads | S: inbound engine (SEO/reports/ads) + partner channel | Partnership deals stay human (you) |
| **Outreach** (contacting) | H+AI: AI drafts proof emails, you send/review | AI+A: sequencer sends, AI personalizes from mystery-shop data; C (VA) handles replies triage | S+C: managed campaigns; AE owns responses | Deliverability oversight needs a human eye periodically |
| **Sales** (qualify & convert) | H: you run demos (this is where you MUST be early — it's how you learn the market) | H+AI: AI pre-qualifies, preps briefs; you close | C: commission-only AE closes; self-serve tier needs no call | High-ticket brokerage deals: human (you) for years |
| **Payment** | S: Stripe Payment Links, auto-invoicing | S: + dunning (Stripe Smart Retries) | S: full billing portal, usage tiers | No |
| **Onboarding** | H: you, from a checklist (2 hrs → get it to 30 min) | C: VA runs the checklist; A provisions Twilio/Make from template | S: self-serve wizard; C handles white-glove tier | No |
| **Fulfillment** | A+AI: the product itself | Same, monitored | S: multi-tenant platform | Model-quality reviews: human-in-loop weekly |
| **Support** | H: shared inbox, you answer (mine every ticket for product fixes) | AI first-line (docs-trained) + C part-time human | C team + AI deflection >70% | Angry-customer saves: human |
| **Retention** | A: nightly value digest (bookings made, response times) | A+AI: health scores, auto win-back offers; C does quarterly check-in calls for teams | S: in-product ROI dashboard; CS contractor for accounts >$400/mo | Team-account relationships: human |
| **Upsells** | H: manual "you should upgrade" notes | A: usage-triggered prompts (lead volume → team plan) | S: in-product; AE for brokerage expansion | No |
| **Analytics** | A: Airtable + weekly auto-report to you | A: Looker Studio dashboard, anomaly alerts to your phone | S: real-time; ops manager reviews daily, you review weekly | Deciding what the numbers mean: you, forever |

**Your permanent role** (the only jobs that never leave your desk): strategy, capital
allocation, reading the weekly dashboard, hiring/firing key people, approving major
changes, brokerage-level relationships, product direction. Target trajectory: ~18
hrs/wk (Y1) → 12 (Y2) → 10 (Y3) → 8 (Y4) → 5–8 (Y5).

**What AI genuinely cannot do here (don't pretend):** win trust on a first sales call
with a skeptical 55-year-old broker; judge whether a channel's numbers smell wrong;
negotiate a rev-share; decide to fire a contractor; take responsibility when a
client's lead got a bad reply. Budget your hours for exactly these.

## Automation stack (cheapest practical, upgrade only when revenue demands)

| Need | Month 1 (target: <$120/mo all-in) | At $10k MRR | Notes |
|---|---|---|---|
| Landing page | Carrd ($19/yr) + domain ($12/yr) | Framer or custom in-app | |
| Checkout | Stripe Payment Links (free + 2.9%+30¢) | Stripe Billing | Guardian-owned account — plan/05 |
| CRM | Airtable free | HubSpot free → Attio | Pipeline + client configs in one base |
| Email (outreach) | Gmail + manual (50/day max) | Instantly $47/mo or Smartlead $39/mo + 3 sending domains (~$36/yr) + warmup | Never blast from your main domain |
| Email (transactional) | Resend free tier | Resend paid | Digests, receipts |
| SMS | Twilio (~$20/mo at 5 clients) | Twilio (COGS, scales with revenue) | A2P 10DLC registration required — plan/05 |
| AI | Claude API (~$5–20/mo early) | Claude API with prompt caching (COGS) | The conversation brain |
| Workflow | Make free → $9/mo | n8n self-hosted, $10 VPS | The nervous system |
| Scheduling | Cal.com free | Cal.com teams | Yours + every client's booking |
| Onboarding | Tally free + Loom free | In-app wizard | |
| Support | Gmail alias | Crisp/Chatwoot free tier + AI agent | |
| Analytics | Google Sheets + Looker Studio (free) | Metabase on same VPS | |
| Accounting | Wave (free) + a spreadsheet | Wave + bookkeeper contractor | Parent visibility required — plan/05 |
| Database | Airtable free | Supabase (free → $25/mo) | v3 product backend |
| Ads | none | Meta Ads (adult-owned account — plan/05) | Only after client #25 |
| Content | Claude + Canva free | + video editor contractor | Mystery-shop reports, demo videos |

## KPI dashboard (the numbers you review weekly, forever)

**North star: appointments booked for clients per week** (their ROI = your retention).

| Layer | Metrics |
|---|---|
| Acquisition | Touches sent, demo booked rate (target ≥3%), demo→close (≥35%), CAC by channel |
| Revenue | MRR, net new MRR, ARPU, MRR growth % |
| Retention | Logo churn/mo (kill-threshold 8%, target ≤4%), revenue churn, 30-day cancel rate (<20%) |
| Product/ROI | Median response time (<60s), leads handled, appointments booked, appointments per client per month (≥2 = safe; <1 = churn risk → auto-flag) |
| Ops | Support tickets/client/mo (<0.5), onboarding hours/client (→0.5), your hours/week (must trend DOWN) |
| Cash | Bank balance, months of runway (≥2, later ≥3), reinvestment rate |

## Retention, referral, upsell systems

- **Retention:** the nightly digest is the product's heartbeat — every client sees
  "closemate answered 7 leads, booked 2 appointments, avg response 41s" daily. Health
  score = appointments/mo + login/reply activity; score drops → AI sends a win-back
  sequence → C does a call for team accounts. Annual-prepay discount (2 months free)
  offered at month 6 to lock in the happy ones.
- **Referral:** triggered automatically at each client's 3rd booked appointment (the
  emotional high point): "One free month per agent you refer." Tracked via unique links
  in Airtable.
- **Upsell ladder:** solo $197 → team $397–597 (triggered by lead volume) → brokerage
  white-label (custom, Y3+) → add-ons: AI voice answering for sign calls (Y2–3, the
  natural second product), past-client nurture campaigns, review-generation.

# closemate — $0 → $1M in 5 Years: The Operating Plan

**closemate** is an AI lead-response and appointment-booking system ("AI ISA") for real
estate agents and small teams. It answers every new lead in under 60 seconds by SMS,
qualifies them, and books them onto the agent's calendar — 24/7, at a flat price the
incumbents ($499–$1,000+/mo) don't touch.

This repository contains the complete 5-year operating plan: business model research,
the financial model, the automation architecture, the first-30-days execution plan, and
the legal route for a 17-year-old founder.

## The plan, in one paragraph

Sell a **productized service** first (done-for-you AI lead response, flat $197/mo,
founding clients $147/mo), get the first client within 14 days using **proof-based
outreach** (mystery-shop agents' own lead forms, show them their response time, sell the
fix), reach $1,000 in collected revenue in 30–45 days, reach $10k MRR by
month 14–18 by adding one repeatable paid + partnership channel, then convert
the service into **self-serve vertical SaaS** in year 3 so revenue stops depending on
your hours. Base case crosses $1M cumulative revenue during year 4. Honest probability
of hitting $1M in 5 years: roughly 1 in 3 if you execute every phase; the plan is
designed so the failure modes are cheap and the first dollar arrives fast.

## Documents

| File | Contents |
|---|---|
| [plan/01-business-models.md](plan/01-business-models.md) | 18 business models researched and scored on 13 criteria; competition analysis with real pricing; why this model wins on economics |
| [plan/02-financial-model.md](plan/02-financial-model.md) | Year-by-year math: revenue, customers, CAC, LTV, margins, reinvestment, pay-yourself amounts; conservative / base / aggressive scenarios; capital allocation rules |
| [plan/03-operating-system.md](plan/03-operating-system.md) | The offer, funnel, pricing, fulfillment system, automation stack, AI-agent responsibilities, the Human→AI→Contractor map for all 10 business functions, KPI dashboard |
| [plan/04-first-30-days.md](plan/04-first-30-days.md) | Day-by-day execution plan with spend caps, KPIs, and kill/continue gates; the exact mechanics of the first $1,000 |
| [plan/05-legal-and-age.md](plan/05-legal-and-age.md) | Everything that requires a parent/guardian (Stripe ownership, LLC, ads accounts, contracts), tax basics, SMS compliance (A2P 10DLC / TCPA), the fully compliant route |

## The 12 final answers (executive summary)

**1. The single business model.** AI speed-to-lead + nurture + booking system for
residential real estate agents and small teams — sold as a done-for-you productized
service first, converted to self-serve vertical SaaS in year 3. (This is closemate,
sharpened: not a "chatbot," a *lead-conversion machine with provable ROI*.)

**2. Why.** Agents already spend heavily on leads ($300–$1,000+/mo on Zillow/PPC) and
then waste them — studies show 63.5% of inbound leads never get a response at all and
average human response is 15+ hours, while leads contacted within 5 minutes are ~21x
more likely to qualify. That's an expensive, *measurable* problem customers already pay
$499–$1,000+/mo to solve (Structurely, Ylopo), leaving the $150–$300/mo tier — where 1.5M
solo agents and small teams live — underserved. Delivery is software (near-100%
automatable), revenue is recurring, one closed deal (~$8–10k commission) pays for
3+ years of the product, and a broke 17-year-old can enter with ~$100 of tools.

**3. The exact initial offer.** *"Every lead answered in under 60 seconds, qualified,
and booked on your calendar — 24/7. Flat $147/mo founding rate (goes to $197), no
per-message fees, no contract, first 14 days free, cancel in one click. Set up for you
in 48 hours."*

**4. First customer acquisition strategy.** Mystery-shop 100 local agents: submit a
buyer inquiry through their own website/Zillow profile, record the response time (most
will be hours-to-never), then send each one a personal 4-line email/DM with their own
number in it: "I inquired about 14 Elm St Tuesday 2:14pm. You replied 9 hours later.
Speed-to-lead data says that lead was gone in 5 minutes. I fix this for a flat $147/mo
— want me to show you on your own leads for 14 days free?" Proof-based, free to run,
un-ignorable.

**5. First $1,000.** 5–7 founding clients × $147/mo, closed from ~100 mystery-shopped
prospects in weeks 2–5. Collected revenue crosses $1,000 between day 30 and day 45;
tool costs run ~$120/mo, so ~85% of it is gross profit. Full mechanics in
[plan/04-first-30-days.md](plan/04-first-30-days.md#the-first-1000).

**6. First $10k/month.** 40–50 clients at $197–$247 average. Channels stacked in
order: (a) mystery-shop outreach industrialized to 300 touches/week via automation,
(b) referral engine (one free month per referred closing), (c) partnerships with 2–3
lead vendors / brokerage team leads who bring 5–20 agents at once, (d) paid ads only
after 25 organic clients prove the funnel. Timeline: month 14–18 base case. Math in
[plan/02-financial-model.md](plan/02-financial-model.md).

**7. Automation architecture.** Twilio (SMS) + Claude API (conversation) + Make/n8n
(orchestration) + Cal.com (booking) + Stripe (billing) + Airtable (CRM/database), all
under ~$120/mo at start, scaling to a proper multi-tenant SaaS codebase in year 3. Every
one of the 10 business functions has a Human→AI→Automation→Contractor migration path in
[plan/03-operating-system.md](plan/03-operating-system.md#the-autopilot-map).

**8. 5-year financial model (base case).** Y1: $32k revenue, $5.5k exit MRR. Y2:
$148k, $18.5k exit MRR. Y3: $325k, $35k exit MRR (SaaS transition). Y4: $545k, $56k
exit MRR — **cumulative crosses $1.05M**. Y5: $840k, $84k exit MRR. Aggressive case
exits Y5 at $100k+/mo; conservative case plateaus near $8k MRR. All assumptions itemized
in [plan/02-financial-model.md](plan/02-financial-model.md).

**9. Reinvestment strategy.** Treat every dollar as fund capital: Experiment → Measure
→ Kill or Scale → Reinvest. Year 1: reinvest ~70% of gross profit, pay yourself almost
nothing. Year 2: 55%. Year 3+: 40–45% with a standing cash reserve of 3 months' opex.
Hard rules (max CAC, kill thresholds, LTV:CAC floors) in
[plan/02-financial-model.md](plan/02-financial-model.md#capital-allocation-rules).

**10. Biggest risks.** (1) Churn — solo agents are fickle; mitigate by moving upmarket
to teams by year 2. (2) A2P 10DLC SMS registration friction and TCPA compliance — solved
by design, not ignored. (3) Saturation — every GHL agency pitches "AI follow-up"; your
edge is vertical depth + proof-based selling + a real product, not a rebrand. (4) Being
17 — contracts and some accounts legally require a parent/guardian (fully mapped in
plan/05). (5) You — school, consistency, and the temptation to build instead of sell.

**11. Why the plan could fail.** Most likely: you stop doing outreach after the first
20 rejections (kills 80% of attempts at this); agents love the demo but won't pay
(offer problem — pivot to home services, the pre-scored fallback in plan/01); churn
exceeds 8%/mo making growth a leaky bucket (product problem — fix before scaling);
platform dependence (Twilio/Zillow policy changes). None of these are hidden; each has
a tripwire and a documented response.

**12. First 10 actions** (details in plan/04): ① Read plan/05 with a parent and get
Stripe guardian setup started. ② Pick your metro + define the 100-agent target list.
③ Buy domain, set up Carrd landing page + Stripe payment link (~$40). ④ Build the
mystery-shop tracking sheet. ⑤ Submit 20 test inquiries (day 1 of outreach). ⑥ Build
the closemate v0 pipeline for ONE fake client: Twilio number → Make → Claude API →
Cal.com. ⑦ Send the first 20 proof emails. ⑧ Book and run the first 3 demo calls.
⑨ Close founding client #1 at $147/mo with 14-day free start. ⑩ Deliver in 48h, get
the testimonial, and repeat the loop — nothing new gets built until 5 clients pay.

---

*Plan date: August 2026. All competitor pricing and market statistics were verified
against current sources at time of writing; re-verify quarterly — this market moves.*

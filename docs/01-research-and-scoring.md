# Phase 1 — Market Research & Scoring (42 Business Models)

**Date:** July 10, 2026 · **Clock:** 72 hours · **Target:** $1,000 revenue

## Methodology

Every model was scored 1–10 on eleven dimensions. Weights reflect the 72-hour
constraint: **urgency, time-to-first-sale, and ease of reaching customers dominate**
(45% combined), because with 72 hours the bottleneck is never fulfillment — it's
finding a buyer whose pain is on fire *today*. Scale paths ($10k/$100k per month)
are weighted lower because they pay off after the challenge, but they're not zero —
the brief requires a real business, not a stunt.

| Dimension | Weight | Why |
|---|---|---|
| Urgency of problem | 15% | Urgent pain = no "let me think about it" |
| Time to first sale | 15% | 72-hour clock |
| Ease of getting customers (in 72h) | 15% | Distribution is the real constraint |
| Willingness to pay | 12% | High-anxiety problems price on value, not cost |
| Competition (10 = low) | 8% | Blue-ocean requirement |
| Startup cost (10 = ~$0) | 8% | No-capital requirement |
| Profit margin | 8% | $1,000 revenue must be ~$1,000 profit |
| Ability to automate | 5% | Post-challenge leverage |
| Ability to use AI | 5% | Post-challenge leverage |
| Path to $10k/mo | 5% | Scale requirement |
| Path to $100k/mo | 4% | Scale requirement |

Scores were computed programmatically (see `scoring/score.py`), not eyeballed.

## Key research facts (grounding the scores)

1. **Form 5500-EZ:** every solo 401(k) with >$250,000 in assets must file by
   **July 31** for calendar-year plans (2025 plan year → **July 31, 2026 — 21 days
   from today**). Late penalty: **$250/day, capped at $150,000**. IRS penalty-relief
   program for late filers (Rev. Proc. 2015-32) costs $500/return, capped at $1,500.
   Current market: one $49 self-prep tool (solo5500desk.com), TPAs bundling it into
   $125–$500/yr admin packages, and CPAs who often *don't know the form exists*
   because it's a DOL/IRS information return, not a tax return.
2. **Real estate speed-to-lead:** average agent takes ~15 hours to respond to a lead;
   responding in 5 minutes makes qualification ~21x more likely; 78% of buyers work
   with the first agent who responds. Real pain — but Structurely ($150–$1,000/mo),
   Ylopo ($1,000+/mo), Roof.ai, and dozens of GoHighLevel resellers already fight
   over it. Demand is real; competition is brutal; B2B SaaS sales cycles exceed 72h.
3. **Missed-call text-back:** commoditized at $49–$99/mo (Backshop, Enzak, dozens
   more). Low ticket → need 15+ sales in 72h. Bad math.
4. **Permit expediting:** $500–$2,000 per residential permit, $75–$200/hr — great
   economics but requires jurisdiction relationships you can't build in 72 hours.

## Full ranking (42 models)

Column key: Urg = urgency · WTP = willingness to pay · Comp = competition (10 = low)
· Ease = ease of getting customers in 72h · Cost = startup cost (10 = ~$0) ·
TTFS = time to first sale (10 = same day) · Mgn = margin · Auto = automatability ·
AI = AI leverage · 10k/100k = path to $10k/$100k per month.

| Rank | Model | Urg | WTP | Comp | Ease | Cost | TTFS | Mgn | Auto | AI | 10k | 100k | Score |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Form 5500-EZ deadline-rescue concierge (solo 401k owners)** | 10 | 8 | 9 | 7 | 10 | 9 | 10 | 8 | 9 | 8 | 6 | **86.7** |
| 2 | DFVCP late-filing amnesty service (small employer plans) | 8 | 9 | 8 | 4 | 9 | 5 | 10 | 7 | 8 | 8 | 7 | **72.2** |
| 3 | Speed-to-lead install, productized service for agents | 7 | 7 | 5 | 6 | 9 | 7 | 9 | 8 | 9 | 8 | 6 | **71.7** |
| 4 | Micro-SaaS: 5500-EZ self-prep software | 9 | 6 | 7 | 5 | 8 | 6 | 10 | 10 | 8 | 6 | 5 | **71.2** |
| 5 | Permit expediting for small contractors | 8 | 8 | 7 | 5 | 10 | 5 | 9 | 5 | 6 | 8 | 6 | **69.3** |
| 6 | Google Business Profile optimization sprint | 5 | 6 | 4 | 7 | 10 | 8 | 9 | 7 | 8 | 7 | 4 | **68.2** |
| 7 | Reverse recruiting for laid-off tech workers | 7 | 6 | 5 | 6 | 10 | 7 | 9 | 6 | 8 | 6 | 4 | **68.0** |
| 8 | Freight carrier setup / MC-authority compliance packets | 7 | 7 | 6 | 5 | 10 | 6 | 9 | 7 | 7 | 7 | 5 | **67.9** |
| 9 | Executive resume/LinkedIn rewrite service | 6 | 6 | 3 | 6 | 10 | 8 | 10 | 7 | 9 | 6 | 3 | **67.8** |
| 10 | GovCon RFP/proposal writing with AI | 7 | 9 | 6 | 4 | 9 | 4 | 9 | 6 | 9 | 9 | 8 | **67.7** |
| 11 | Law-firm intake automation (personal injury) | 7 | 9 | 5 | 4 | 8 | 4 | 9 | 8 | 9 | 9 | 8 | **67.1** |
| 12 | AI voice receptionist for home-service contractors | 7 | 7 | 4 | 5 | 8 | 5 | 8 | 9 | 10 | 8 | 8 | **66.6** |
| 13 | STR (Airbnb) listing optimization sprints | 5 | 6 | 5 | 6 | 10 | 7 | 9 | 7 | 9 | 6 | 4 | **66.0** |
| 14 | Missed-call text-back productized service | 6 | 6 | 3 | 6 | 9 | 7 | 9 | 10 | 7 | 6 | 4 | **65.6** |
| 15 | QuickBooks cleanup sprints | 6 | 7 | 5 | 5 | 10 | 6 | 9 | 6 | 8 | 7 | 5 | **65.6** |
| 16 | Google review response / reputation mgmt for local biz | 5 | 5 | 4 | 6 | 10 | 7 | 9 | 9 | 10 | 6 | 4 | **65.5** |
| 17 | Provider credentialing service (new practices) | 8 | 8 | 6 | 4 | 10 | 3 | 9 | 6 | 7 | 8 | 7 | **65.4** |
| 18 | CDL driver recruiting ads for trucking companies | 8 | 8 | 5 | 4 | 8 | 4 | 8 | 7 | 7 | 8 | 7 | **64.2** |
| 19 | Construction bid-package assembly service | 6 | 7 | 7 | 4 | 10 | 5 | 9 | 6 | 8 | 7 | 5 | **64.2** |
| 20 | Zapier/Make automation buildouts for agencies | 5 | 7 | 5 | 5 | 10 | 6 | 9 | 6 | 8 | 7 | 5 | **64.1** |
| 21 | COI (insurance certificate) tracking for property mgrs | 6 | 7 | 7 | 4 | 10 | 4 | 9 | 8 | 8 | 7 | 6 | **64.1** |
| 22 | Medical billing denial recovery | 8 | 9 | 5 | 3 | 9 | 2 | 8 | 7 | 9 | 9 | 9 | **64.0** |
| 23 | **Closemate: AI chatbot for real estate lead gen (SaaS)** | 6 | 6 | 3 | 5 | 9 | 5 | 9 | 9 | 10 | 7 | 7 | **63.8** |
| 24 | Google LSA management for contractors | 6 | 7 | 5 | 5 | 9 | 5 | 9 | 7 | 6 | 8 | 6 | **63.7** |
| 25 | CRM cleanup + automation for real estate teams | 5 | 6 | 6 | 5 | 10 | 6 | 9 | 7 | 8 | 6 | 4 | **63.3** |
| 26 | Solo 401k course / paid guide | 4 | 4 | 6 | 5 | 10 | 7 | 10 | 10 | 9 | 5 | 3 | **62.8** |
| 27 | AI adoption workshops for professional firms | 5 | 7 | 6 | 4 | 10 | 5 | 10 | 5 | 9 | 7 | 5 | **62.7** |
| 28 | AI listing descriptions + photo enhancement for agents | 3 | 4 | 4 | 7 | 10 | 8 | 9 | 9 | 10 | 4 | 2 | **62.5** |
| 29 | College essay coaching | 5 | 7 | 4 | 5 | 10 | 6 | 10 | 5 | 7 | 6 | 4 | **62.2** |
| 30 | Local SEO citation cleanup | 4 | 5 | 5 | 6 | 10 | 7 | 9 | 8 | 7 | 5 | 3 | **61.9** |
| 31 | Security-deposit dispute documentation service | 6 | 5 | 8 | 4 | 10 | 6 | 9 | 7 | 8 | 4 | 2 | **61.9** |
| 32 | Sales-tax nexus review for e-commerce | 6 | 7 | 6 | 4 | 10 | 4 | 9 | 6 | 7 | 7 | 5 | **61.4** |
| 33 | HIPAA compliance starter kits for small practices | 5 | 6 | 5 | 4 | 10 | 5 | 10 | 8 | 8 | 6 | 5 | **61.2** |
| 34 | AI SOP/documentation writing for SMBs | 4 | 6 | 7 | 4 | 10 | 5 | 9 | 7 | 9 | 6 | 4 | **60.1** |
| 35 | Landlord bookkeeping template packs | 3 | 4 | 6 | 5 | 10 | 7 | 10 | 10 | 8 | 4 | 2 | **59.9** |
| 36 | Estate "death binder" document-organization service | 4 | 6 | 8 | 4 | 10 | 5 | 9 | 7 | 8 | 5 | 4 | **59.9** |
| 37 | ISO 9001 documentation prep for small manufacturers | 5 | 8 | 7 | 3 | 10 | 3 | 9 | 6 | 8 | 7 | 5 | **59.4** |
| 38 | Facebook-ads agency for med spas | 6 | 8 | 3 | 4 | 8 | 4 | 8 | 6 | 7 | 8 | 7 | **59.1** |
| 39 | Niche contingency recruiting | 6 | 9 | 4 | 3 | 10 | 2 | 10 | 4 | 6 | 8 | 8 | **58.7** |
| 40 | Website speed-fix service for local businesses | 4 | 5 | 5 | 5 | 10 | 6 | 9 | 7 | 7 | 5 | 3 | **58.4** |
| 41 | ADA website compliance audits | 4 | 5 | 3 | 4 | 10 | 5 | 9 | 8 | 8 | 5 | 4 | **55.2** |
| 42 | Dispatch/scheduling SaaS for mobile detailers | 4 | 5 | 6 | 3 | 7 | 2 | 9 | 9 | 7 | 5 | 5 | **49.6** |

## Blue-ocean analysis

The brief asked for boring industries, paperwork-drowning, spreadsheet-running,
startup-ignored markets. The 5500-EZ niche checks **every** box:

- **Boring:** retirement-plan information returns. VCs will never touch it.
- **Paperwork:** the entire product *is* a government form people fear.
- **Outdated tooling:** the IRS EFAST2 portal is a 2000s-era government website;
  incumbents are TPAs running on PDFs and email.
- **Ignored by startups:** one indie $49 tool is the entire "modern" competitive set.
- **Expensive-labor-replaced-by-AI:** a TPA charges $125–$500/yr mostly for
  20 minutes of form-filling and calendar-keeping — AI does the drafting, checking,
  and reminders.
- **High-ticket recurring:** it recurs *every single year by law*, and late filers
  face a $500–$1,500 penalty-relief process worth a $399–$749 service ticket.
- **Structural moat against incumbents:** brokerages (Fidelity, Schwab, E*TRADE)
  hold millions of solo 401(k) accounts but explicitly do *not* file 5500-EZ for
  customers — it's the *plan administrator's* (the customer's) legal duty, and
  brokerages won't take on fiduciary/compliance liability. That's why the gap exists
  and why it persists.

Avoid-list compliance: no dropshipping, no print-on-demand, no generic AI agency,
no generic social media marketing, no Shopify apps, no consumer apps. ✅

## Verdict

Rank #1 wins by **14.5 points** — the largest gap in the table. Proceed to
head-to-head validation in `02-top10-comparison.md` before committing.

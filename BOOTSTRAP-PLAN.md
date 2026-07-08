# Bootstrap Plan — Zero to First Dollar (17-Year-Old Founder Edition)

Supersedes the execution sections of `FOUNDING-PLAN.md` (the strategy there stands; the budget and sequencing did not survive contact with reality: no $5K attorney, no Terraform, no AWS org, no 40-hour weeks). Same company, bootstrap physics.

---

## 1. Red-Team Round 3 — the founder-specific attack

### 1.1 The one thing that actually blocks you: contracts, not code, not HIPAA
**In most US states, contracts signed by a minor are voidable by the minor.** Practices (and their lawyers, banks, and payment processors) know this. Nobody signs a Business Associate Agreement — the legal foundation of handling their patient data — with someone whose signature doesn't bind. Stripe's terms require 18. Most banks won't open a sole business account for a minor. Most states require an adult LLC organizer.

**This is not fatal. It needs one adult, not a legal budget:**
- A parent/guardian (or an adult you deeply trust) **forms the LLC and is the signing member**. You run the company; they hold the pen. Put the understanding in writing between you two (ownership transfers/converts at 18).
- Bank account: joint/custodial business account with the adult signer.
- Stripe/payments: opened under the adult's identity on the LLC.
- Cost: LLC state fee **$50–$300** (your state), registered agent = parent's address (free), EIN = free (IRS online).

**What this means practically:** the conversation with your parent/guardian is **the first task of the company**. Before code, before outreach. If that conversation fails, find one adult advisor who'll do it — without a signing adult, this specific business (PHI + contracts + payments) cannot legally operate, and the honest move is to know that on day 1, not month 3.

### 1.2 What you can 100% do yourself
Build the entire product with AI assistance · run all outreach (email/LinkedIn are age-blind) · run the audits and draft appeals · do discovery calls (see 1.4) · manage the money and books · learn CARC/RARC codes and payer rules better than most billers (this knowledge is free, just tedious — being obsessive here is your edge).

### 1.3 Legal steps: what can wait vs. cannot
| CANNOT wait (before touching real PHI / signing a customer) | CAN wait |
|---|---|
| LLC formed with adult signer | SOC 2 (month 9–12, when a bigger customer demands it) |
| BAA template — **free**: HHS publishes model BAA provisions on hhs.gov; adapt, don't draft | Attorney-drafted custom contracts (use free templates + a free review, below) |
| Simple services agreement (plain-English, 2 pages: scope, fee, inventory list, cancel-anytime) | Fee-structure memo for all 50 states — you launch in ONE state |
| Never-touch-money structure (automatic: payments already flow to the provider) | Trademark, patents, fancy entity structures |
| De-identified-data-first workflow (below) | Cyber/E&O insurance — buy a cheap policy (~$50–100/mo) when the *first real PHI* flows, not before |

**Free legal hack #1:** university law schools run **small-business / entrepreneurship legal clinics** that review contracts and formation for free. Find the nearest one; they will love this project.
**Free legal hack #2:** launch in **your home state + commercial-payer claims only**. Percentage fees on *commercial* claims, where the provider receives all payments directly, is the standard industry arrangement in most states. Skip NY. Skip Medicaid/Medicare claims entirely in phase 1 — that deletes the entire government-payer fee-rule minefield instead of solving it.

### 1.4 The age problem in sales — real, manageable
You will sound young on the phone. Strategy: **let the report do the selling.**
- Email-first, always. The free audit is delivered as a document; documents don't have ages.
- "We/our team" language — true (you + adult signer + AI).
- Never lie about your age; never volunteer it. If asked directly: "I started this company because billing teams don't have time to work small denials and AI finally makes it economical — here's what we found in your data." Results end that conversation. A practice owner staring at $19K of recoverable claims does not care how old you are.
- Calls only *after* a report is delivered (warm, concrete agenda: "walk through page 2").

### 1.5 Assumptions that still need validation (unchanged, now cheaper)
1. Practices will export and send claim data to a stranger for a free audit ← the whole funnel rests on this; validate in week 1–2 with real asks.
2. AI can find real recoverable money in real 835s ← validate on public sample files + first de-identified export.
3. Wedge→full-billing conversion ≥40% ← unknowable until ~month 5–6; the KPI stands.

### 1.6 PHI on a bootstrap budget — the cheap-but-legit path
You do **not** need AWS enterprise infra. You need every system that stores PHI covered by a BAA:
- **Google Workspace Business** (~$12–14/user/mo): Google signs a BAA self-serve. Gmail + Drive become your compliant intake channel — practices email/upload files, legitimately.
- **Google Cloud Platform**: BAA accepted self-serve in console, ~$300 free credits. **Vertex AI serves Claude models under that BAA** with no data retention for training. Storage + a tiny database live here too.
- Laptop rule: full-disk encryption on, no PHI in iCloud/Dropbox/Notion/personal Gmail, screen-lock, PHI files only inside the BAA'd Drive/GCP.
- **Until the LLC + BAAs exist: zero real PHI.** Build and demo on public sample 835 files and **de-identified exports** (a practice deletes name/DOB/ID columns from a CSV — 10 minutes for them, and it's enough to produce a credible audit). This lets validation start *before* the paperwork finishes.

**Total burn to first customer: under $600.** LLC $50–300 · domain $12 · Google Workspace ~$14/mo · Claude API/Vertex $20–50/mo during dev · everything else $0.

---

## 2. Zero-to-First-Dollar Plan

### Week 1 — Manual/no-code validation (zero code required)
- The adult-signer conversation. LLC filing started. (Day 1–2)
- Build a 50-practice list (see §5 for the free data source).
- Send 25 personalized emails offering the free denial audit on **de-identified data** ("delete the patient columns — takes 10 minutes").
- Book 3–5 calls. On each call ask three questions: Who works your denials today? How many hours do they get? What happened to last quarter's denied claims? (The answers are your pitch, market research, and testimonial pipeline.)
- **Do one audit completely manually**: their de-identified CSV + a spreadsheet + Claude chat to classify codes + a Google Doc report. No product. If a manual audit can't excite a practice owner, no product will.

### Weeks 2–4 — Working prototype (the Denial Audit Engine, minimal form)
- Python scripts (AI-assisted) that do what you did manually: parse CSV/835 → classify CARC/RARC → check deadlines → rank by expected value → output the report.
- Finish LLC + BAA/services-agreement templates (HHS model + law-clinic review).
- Google Workspace + GCP BAAs signed → you can now legally receive real PHI.
- Keep outreach running: 15–25 emails/week. Target: 5 audits delivered by end of month 1.

### Month 2 — First pilot
- Convert the best audit into a **pilot**: signed services agreement + BAA, claim inventory list attached, contingency 20% of recovered (commercial claims only), cancel anytime.
- Work the claims for real: draft appeals with AI, **you review each one**, practice's biller (or you, via their portal access with permission) submits them. Log every submission + deadline in the tracker.
- Watch subsequent 835s/EOBs for the money landing. Screenshot everything (with permission) — this is the case study.

### Month 3 — First dollar
- Appeals from month 2 resolve (payers take 7–30 days to answer; expect 30–60 days end-to-end to cash).
- Invoice the pilot: fee on recovered claims from the signed inventory. **First revenue.**
- Ask for: a testimonial quote, a referral to two other practice owners, and the full-billing conversation ("want us to just prevent these instead?").
- Publish case study #1. Raise outreach volume with it attached. Sign pilots #2–4.

Realistic honesty: money in month 3 requires appeals submitted by mid-month 2, and payers are slow. If first revenue lands in month 4, that's on-plan, not failure.

---

## 3. Cheapest Possible MVP

### MUST HAVE (gets the first customer)
1. **CSV/835 parser** → normalized claim rows (start with CSV — every PMS exports it; 835 parsing week 3+)
2. **CARC/RARC classifier** — code tables are free to compile + Claude for messy payer remark text
3. **Deadline table** — top 8 payers' appeal windows (UHC 65d, Medicare Advantage 60d, most commercial 180d), per-claim days-remaining
4. **Triage ranker** — expected $ × rough win-probability, batched by (payer × root cause)
5. **Audit report generator** — clean Google Doc/PDF: "≈$X recoverable · top 5 causes · attack-first list"
6. **Appeal-letter drafter** — Claude prompt + your review; output = letter + document checklist
7. **Tracking spreadsheet** — claim, appeal sent, deadline, outcome, $ recovered. (Sheets IS the database at n≤5 customers.)

### SHOULD HAVE (after 3+ paying practices)
Simple web upload portal (replaces email intake) · automated 835-vs-inventory reconciliation · review-queue UI (replaces reading files in a folder) · per-payer win-rate stats (the moat data — but a *spreadsheet tab* until it hurts)

### DO NOT BUILD (will feel productive; is procrastination)
Dashboards · practice-facing login · EHR/PMS integrations · multi-tenant anything · auth systems · landing page beyond one static page · automated email sequences (you're sending 25/week — send them by hand, you'll learn more) · a logo you spent more than 30 minutes on

---

## 4. Bootstrap Tech Stack

| Need | Tool | Cost |
|---|---|---|
| Code | Python + AI pair-programming (Claude Code) | ~$20/mo |
| Data (pre-PHI) | SQLite + Google Sheets | $0 |
| AI | Claude API direct while on sample/de-identified data → **Claude on Vertex AI** (GCP BAA) when real PHI arrives. Haiku for classification (pennies), Opus-class for appeal drafting | $20–50/mo |
| 835 parsing | Open-source X12 parser libraries; hand-rolled CSV first | $0 |
| PHI intake | Google Workspace Business (BAA) — Gmail + Drive | ~$14/mo |
| PHI compute/storage | GCP: Cloud Storage + Cloud SQL/Firestore (BAA, free credits) | ~$0–20/mo |
| Reports | Google Docs template → PDF | $0 |
| One-page site | Static page (GitHub Pages/Carrd) — **no PHI ever touches it**, so no BAA needed | $0–19/yr |
| Outreach | Plain Gmail on your domain, sent by hand; free LinkedIn | $0 |
| Fax (appeals!) | Online fax w/ BAA (e.g., SRFax-class HIPAA fax services) — only when first appeal ships | ~$10/mo |

**When does "real" infrastructure become necessary?** Three triggers: (1) first real PHI → GCP/Workspace BAAs (week 3–4, ~$30/mo — that IS the real infrastructure at this scale); (2) ~5+ customers → move Sheets tracking into Postgres, build the upload page; (3) first customer or partner that asks for SOC 2 → month 9+, funded by revenue. The `FOUNDING-PLAN.md` AWS architecture is the month-9+ version, not the start.

---

## 5. Outreach Strategy

### Finding the first 100 practices — free
1. **The NPPES NPI Registry** (free public download / API): filter organizational NPIs by behavioral-health taxonomy codes (e.g., 251S00000X community/behavioral health; 101Y counselor group listings) in your target state → names, addresses, phone numbers of every registered behavioral-health organization. This is a lead database companies pay thousands for, free from CMS.
2. **Psychology Today** directory → filter "group practice" by city → practice websites → owner names.
3. State counseling/psychology association member directories; Google Maps "counseling center {city}" with 5+ clinicians on the website's team page.
4. Qualify (2 min each): 5–50 clinicians on team page · takes insurance (site says "we accept Aetna/BCBS/…") · not platform-only. Log in a sheet: practice, owner, email, PMS if guessable, personalization note.

### Cold email (send 5–10/day, by hand, personalized first line)
> **Subject: denied claims at {{practice name}}**
>
> Hi {{first name}} — I run a small team that recovers denied insurance claims for behavioral health group practices.
>
> Industry-wide, 15–20% of claims get denied and about 60% of those are never re-worked — usually because nobody has time to fight a $140 claim. That's earned money that just evaporates.
>
> We do a **free denial audit**: your admin exports a claims report from {{their PMS / "your billing system"}} with patient columns deleted (about 10 minutes), and we send back a report showing what's recoverable, the top denial causes, and which claims to attack first.
>
> No contract, no software to install. If you later want us to recover them, you pay only on what actually lands in your account.
>
> Want me to send the 3-line export instructions?

**Bump (day 4):** "Quick add — the audit works on de-identified data (no patient names leave your system), which is why practices are comfortable doing it as a first step. Export instructions are 3 lines; happy to send."
**Breakup (day 12):** "Closing this out. One thing worth doing either way: ask whoever does your billing what your denial rate was last quarter. If they can't answer in a day, that's usually the whole story. Offer stands if you ever want the audit."

### LinkedIn
Connect with owners/practice admins (no note or one neutral line). After accept: "Thanks for connecting, {{name}}. Not going to pitch — one thing that might be useful: we run free denial audits for behavioral health groups (de-identified export in, report of recoverable money out). If billing's ever a headache at {{practice}}, say the word."

### Phone (only warm — after a report is delivered)
"Hi {{name}}, it's {{you}} — I sent over the denial audit for {{practice}}. Got 10 minutes to walk through page 2? … The headline: about ${{X}} looks recoverable, and {{Y}}% of it comes from one fixable cause — {{e.g., authorization strings with Aetna}}. If you want, we start with just the top 20 claims: you pay a percentage of whatever actually gets paid, nothing otherwise, cancel anytime. Your team's total work is one signature and portal access."

---

## 6. 90-Day Founder Schedule (student, ADHD, ~15–18 hrs/week)

**Weekly template — the same every week, so it never needs re-deciding:**
| Day | Block | The ONE thing |
|---|---|---|
| Mon | 90 min | Outreach: 10 emails + log replies |
| Tue | 90 min | Build (current MUST-HAVE feature only) |
| Wed | 90 min | Outreach: bumps/follow-ups + book calls |
| Thu | 90 min | Build or run an audit (audits always win ties) |
| Fri | 60 min | Calls with practices (schedule them all here) |
| Sat | 3–4 hrs | Deep build block (the week's hard problem) |
| Sun | 30 min | Scorecard + pick next week's 3 priorities. Then stop. |

**ADHD guardrails (from someone designing for your actual brain, not an idealized one):**
- **One metric per week**, written on paper where you work. Weeks 1–4: "audits delivered." Weeks 5–8: "appeals submitted." Weeks 9–12: "dollars recovered."
- Every block starts with a 2-minute note: *"Done today = ____."* If you can't fill the blank, the block is outreach (default action beats planning paralysis).
- 25-minute timers inside blocks; parsing EDI files will eat 4 hours without one.
- Boring-but-critical tasks (compiling the CARC table, deadline table): body-double them — friend on a call, library, whatever works.
- **Fridays never move.** Consistent call slots mean you never negotiate scheduling from scratch.
- Miss a day? It's dead, skip it. The system is the week, not the day.

**Month arcs:** Month 1 = 5 audits delivered + LLC/BAAs done. Month 2 = 1–2 pilots signed + first appeals out the door. Month 3 = first invoice paid + case study + 3 more pilots in pipeline. (Exams week? Halve the blocks, keep Monday outreach — pipeline dies in two silent weeks.)

---

## 7. TODAY — exact actions, ~3 hours

1. **(45 min) The adult-signer conversation.** Show your parent/guardian this document. The ask: "Form an LLC with me as the operator and you as the signing member; it costs $50–300; here's why the business needs an adult signature; here's the written agreement between us about ownership at 18." This single conversation unblocks contracts, banking, payments, and BAAs — it is worth more than any code you could write today.
2. **(45 min) Start the lead list.** Pull the NPPES registry or Psychology Today for your state → first 25 behavioral-health group practices in a Google Sheet: name, owner, email, team size, personalization note.
3. **(30 min) Claim the identity.** Buy a domain ($12), set up email on it, make a one-page static site: what you do, the free audit offer, a contact address. Nothing else.
4. **(45 min) Touch the real problem.** Download public sample 835 files (CMS and clearinghouses publish test files) and, with AI assistance, get *any* parse working — even just printing claim lines and denial codes to the terminal. Today's version can be ugly; the point is contact with real file formats on day 1.
5. **(15 min) Write the scorecard.** A sheet with five columns — audits delivered, pilots signed, appeals submitted, $ recovered, fees collected — all zeros. Updating that first row is now the only definition of progress.

Tomorrow: first 5 emails go out. Not when the product is ready — the product for an audit is you, a spreadsheet, and Claude. The manual version IS the MVP.

---

*Strategy docs: `BUSINESS-OPPORTUNITY-RESEARCH.md` (market research) → `RED-TEAM-ANALYSIS.md` (why supplements died, why RCM won) → `FOUNDING-PLAN.md` (full architecture & scale plan — the month-9+ version) → this file (how to actually start).*

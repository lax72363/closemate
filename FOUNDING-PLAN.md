# Founding Plan — AI Denial Recovery → RCM for Specialty Practices

Working name: **ClearClaim** (placeholder). This document is the operating plan: red-team round 2, MVP spec, architecture, 90-day plan, sales playbook, roadmap, investor view, and the week-1 build.

---

## 1. Red-Team Round 2 — what the first analysis missed

I attacked the model again before designing anything. Three new findings force **structural changes**; the model survives, but not unmodified.

### 1.1 Fee-splitting & percentage-compensation laws — **SERIOUS, forces pricing changes**
Percentage-of-collections billing — the industry norm — is **not legal everywhere or for every payer**:

- **New York** prohibits compensating billing entities as a percentage of collections (Medicaid law + Education Law "unprofessional conduct"; the state MFCU has sent clawback letters to providers over it).
- **Florida** prohibits percentage arrangements for **Medicaid** funds.
- **Medicare reassignment rules**: a billing agent may receive payment on the provider's behalf only if its compensation is *unrelated* to amounts billed/collected. Industry practice threads this needle by having **all payer payments flow directly to the provider's bank account** — the billing company never touches money, only invoices fees.

**Structural changes adopted:**
1. **Never touch the money.** All ERAs/EFTs go to the provider's account; we invoice. This is non-negotiable architecture, not just legal hygiene — it also kills the "will you steal from me" trust objection.
2. **State exclusion list at launch** (NY out; NJ/IL flagged for attorney review) and a **flat per-claim or flat-monthly pricing menu** alongside percentage pricing, required for government-payer claims and restricted states.
3. **Healthcare attorney engagement in week 1** ($2–5K): fee-structure memo by state × payer type + our services agreement + BAA template. This is the first dollar the company spends.

### 1.2 Appeal-deadline physics — **kills the "aged claims" pitch as worded**
The wedge offer said "send us your denied **and aged** claims." The deadlines say otherwise:
- UnitedHealthcare: **65 days** to appeal. Medicare Advantage: **60 days** (CMS rule, all carriers). Medicare: 120 days. Most commercial (Aetna/BCBS/Cigna/Humana): 180 days.
- Anything denied >6 months ago is mostly **unrecoverable**, except: credentialing-related denials that can be fixed and re-billed, corrected-claim resubmissions inside original timely-filing windows, and **contract underpayments** (recoverable under payer-contract terms, often 12–24 months back — a bigger vein than it looks).

**Structural change:** the wedge is **"last 90 days of denials + your ongoing denial flow + an underpayment audit"** — not claims archaeology. This also fixes the churn problem: ongoing flow means the engagement never "finishes."

### 1.3 Low-dollar claim economics — **the sharpest attack on the wedge**
PT/behavioral/chiro claims run **$75–250 each**. 20% contingency on a $150 claim is $30. Industry data agrees this is exactly the segment where humans give up: ~20% of claims denied, **up to 60% of denials never worked** because human rework costs more than the claim. The math:
- $10K/mo from contingency alone = ~$50K/mo recovered = **300–600 claims/month worked.** A human-powered service dies here. The AI cost per appeal must be **<$5 fully loaded**, and the system must batch (one appeal covering N claims sharing a payer + denial reason) and prioritize denial categories that unlock whole claim strings (credentialing, auth, eligibility).

**Honest reframe:** the contingency wedge is a **customer-acquisition machine that roughly breaks even**, not the profit engine. The business is the conversion to full billing at 4–5% of *all* collections (a 10-clinician behavioral group collecting $150K/mo = $6.75K/mo from one account, forever). The KPI that decides whether this company works is **wedge→full-billing conversion rate**, target ≥40% within 6 months of a wedge engagement. If pilots show <20%, the wedge is mispriced or mistargeted and we sell full billing directly.

### 1.4 Other findings (managed, not structural)
- **Attribution disputes** ("that claim would have paid anyway"): fee applies only to claims in a signed inventory list we worked, verified paid via subsequent 835s. Contract language, week 1.
- **PHI + LLMs**: inference must run under a BAA with zero data retention (AWS Bedrock is the standard path for Claude). No PHI in logs, prompts logged PHI-scrubbed, minimum-necessary data pulled. A breach is business-ending; SOC 2 Type I by month 6.
- **PMS data friction**: getting 835s/exports from TherapyNotes, SimplePractice, WebPT, Jane, Tebra varies wildly; onboarding is 2–4 weeks (payer-portal access, clearinghouse ERA enrollment), not 2 days. Plan for it; don't promise week-1 recoveries.
- **Appeal submission is fax/portal hell** — no universal API. This is an ops burden *and* a moat: pure-software competitors can't finish the job.
- **Patient collections are out of scope, permanently in v1** (FDCPA + state collection-agency licensing). Payer-side only.
- **Competition is arriving**: Crosby Health (clinical appeals LLM, ~$2.2M raised), Aegis (YC, denied-claims agents), Counterforce (patient-side), Adonis & Candid Health (funded, mid-market/digital-health), Waystar (enterprise). Nobody owns *small specialty group practices as a done-for-you service*. Realistic exclusivity window: **12–18 months.** Speed matters more than polish.
- **Beachhead reorder** (change from the brief): **behavioral health groups FIRST**, PT second, chiro third. Reason: WebPT already bundles an RCM service in PT (the platform owns the workflow), while the dominant behavioral tools (TherapyNotes, SimplePractice) have weak billing-service offerings — softer incumbent, same pain. PT stays in the ICP but isn't the first 10 customers.

**Round-2 verdict:** Proceed. No fatal defects. Three structural changes: (1) never touch the money + state/payer-aware pricing menu, (2) wedge = recent + ongoing denials + underpayments, (3) behavioral-health-first beachhead.

---

## 2. MVP — the AI Denial Recovery Agent

**Design principle:** the MVP is a *workbench that makes one operator (me/us) superhuman*, wearing a service business as its skin. The customer sees a report, not software.

### Workflow
```
INTAKE                     PROCESS (AI)                    HUMAN GATE            OUTPUT
──────                     ────────────                    ──────────            ──────
835 ERA files         →    Parse & normalize claims   →    Review queue:    →    Appeal packets (PDF/fax/portal)
EOB PDFs              →    Classify denial (CARC/RARC +    approve / edit /      Follow-up task list w/ deadlines
CSV exports (PMS)          payer language)                 reject each           Monthly report:
Payer portal creds    →    Deadline check (days left       packet                "Recovered $X. In flight: $Y.
                           to appeal, by payer/plan)                              Top denial causes: …"
                      →    Recoverability triage
                           (expected $ × win prob ÷ effort)
                      →    Batch claims w/ same root cause
                      →    Draft appeal letter + doc
                           checklist + citations
                      →    Reconcile later 835s to detect
                           payment → mark RECOVERED
```

### What is explicitly NOT in the MVP
- No EHR/PMS integrations (manual exports are fine at n<20 customers)
- No self-serve signup, no dashboards beyond the monthly report
- No auto-submission (human presses send — this is also the compliance posture)
- No coding suggestions, no claim scrubbing, no eligibility checks (that's V2)
- No patient billing, ever in v1

### The one piece of "product" the customer touches
The **Denial Audit Report**: they send one 835 batch / denial export; we return a branded PDF — "You have **$23,400** in recoverable denials from the last 90 days; here are the top 5 root causes; here's what we'd recover it for." This artifact *is* the sales funnel (§5) and it's generated by the same pipeline as production work. Build once, use twice.

---

## 3. Technical Architecture

Single-vendor cloud (AWS) to keep the BAA surface minimal. Boring choices everywhere except the AI layer.

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js + Tailwind, served from AWS (Amplify Hosting or CloudFront+ECS) | Not Vercel — keep PHI-adjacent infra under the AWS BAA umbrella |
| Backend | Python + FastAPI on ECS Fargate, private VPC | Python owns the X12/document ecosystem; Fargate = no servers to patch |
| Database | Aurora PostgreSQL, KMS-encrypted, no public access | Claims, denials, appeals, tasks, outcomes — all relational |
| Files | S3 + KMS, versioning, access logging, lifecycle rules | 835s, EOB PDFs, appeal packets |
| Queue/jobs | SQS + worker service | Parse → classify → draft is naturally async |
| X12 parsing | Stedi healthcare APIs (signs BAAs) for 835/837; fallback open-source `pyx12`-style parser | 835 parsing is a solved problem; don't hand-roll EDI in week 1 |
| EOB PDFs | Claude vision, Textract fallback for degraded scans | EOBs are semi-structured chaos; vision models handle them well |
| **AI models** | **Claude via AWS Bedrock** (HIPAA-eligible under the AWS BAA, zero retention). Opus-class (`claude-opus-4-8`) for denial analysis + appeal drafting; Haiku (`claude-haiku-4-5`) for high-volume classification/extraction. Structured outputs everywhere. | Two-tier keeps cost/claim <$1 for triage, ~$2–4 for a drafted packet — the §1.3 economics require this |
| Rules data | CARC/RARC code tables + per-payer appeal rules (deadlines, addresses, forms) as versioned seed data | This dataset compounds into moat (§7) |
| Auth | AWS Cognito, MFA enforced, role-based (admin / reviewer / customer-viewer) | BAA-covered, cheap, boring |
| Audit | Append-only `audit_events` table (every PHI access, every AI draft, every approval, every send) + CloudTrail + S3 access logs | HIPAA requires it; enterprise buyers will ask for it later |
| Secrets | AWS Secrets Manager; payer-portal creds encrypted per-tenant | |
| Logging | CloudWatch + Sentry with PHI scrubbing middleware — **no PHI in any log line, ever** | The most common self-inflicted HIPAA wound |
| IaC | Terraform from day 1 | SOC 2 evidence later; reproducibility now |

**HIPAA posture, sequenced:** Day 1: AWS BAA (self-serve via AWS Artifact), encryption everywhere, MFA, least-privilege IAM, our BAA template for customers (attorney, §1.1). Month 2–3: written policies (security, incident response, access review), workforce training (it's just us — document it anyway). Month 4–6: SOC 2 Type I via a compliance-automation vendor. **Never:** PHI in a non-BAA tool (no PHI in email threads, no consumer LLM tools, no personal Google Drive).

---

## 4. First 90 Days

### Days 1–30 — Foundations + sales weapon
**Compliance:** attorney engaged (fee-structure memo, services agreement, BAA); AWS BAA signed; infra skeleton (VPC, Aurora, S3, Cognito, audit logging) via Terraform.
**Build:** Denial Audit Engine (835/EOB/CSV → parsed claims → classified denials → deadline check → recoverable-$ report PDF). Test on synthetic/public sample 835 files — **no real PHI until BAA + infra are live.**
**Sales:** list of 150 behavioral-health group practices (TherapyDen/Psychology Today group listings, state association directories, LinkedIn); 20 discovery calls booked via the free Denial Audit offer; refine ICP from calls.
**Exit criteria:** audit engine produces a credible report from a real customer file; 3 signed audit agreements (BAA + data pull).

### Days 31–60 — Pilots that recover real money
- Run audits for the first 3–5 practices → convert ≥3 to contingency pilots (signed inventory list, 20% commercial / flat-fee gov-payer, exclusion states honored).
- Build the review queue + appeal-packet generator + 835 reconciliation (recovery detection).
- Physically submit appeals (fax/portal — yes, us). Track every outcome in the payer-rules dataset.
- Instrument the funnel: claims in → appealable → appealed → recovered; cost per appeal; days to decision.
**Exit criteria:** first **recovered dollars verified via 835** (even $2K counts); cost per appeal <$10 (path to <$5 visible); one practice asks "can you just do all our billing?" — that question is the conversion signal.

### Days 61–90 — Revenue + repeatability
- First contingency invoices paid. Target: **$5–10K collected fees**, 5–8 active practices.
- Publish 2 case studies ("We recovered $18,700 for a 12-clinician group in 6 weeks — money they had written off"), with customer permission, de-identified.
- Convert 1–2 pilots to **full-billing LOIs** at 4–5% (delivery starts month 4–5; onboarding checklist built now).
- Repeatable sales machine running: 30 audits offered/week via email+LinkedIn, ~10% audit acceptance, ~50% audit→pilot.
- Decide the §1.3 question with data: wedge→conversion rate trending toward ≥40%? If not, re-price or sell full billing direct.
**Exit criteria:** $10K MRR-equivalent in sight for month 4–6 (per the original goal), CAC and win-rate numbers real instead of estimated.

---

## 5. Sales Playbook

### ICP (v1)
Behavioral-health group practice · 5–50 clinicians · own commercial payer contracts (not platform-dependent) · in-house biller(s) or a small billing company they grumble about · states: TX, FL*, GA, NC, OH, PA, AZ, CO (*FL: flat-fee for Medicaid) · **buyer:** practice owner (clinician-founder) or practice administrator · **trigger events:** biller quit, denial spike after a payer policy change, EHR/clearinghouse migration, hiring freeze.

### Offer ladder
1. **Free Denial Audit** (the hook — asks for 30 minutes and one data export, not a contract)
2. **Contingency recovery**: 20% of recovered on commercial claims in a signed inventory; flat $20–30/claim where % is restricted; zero risk, cancel anytime
3. **Full billing**: 4.5% of collections (5.8% market average), month-to-month, no long contract — the anti-billing-company billing company

### Cold email (v1)
> **Subject: the $19K your practice wrote off last quarter**
>
> Hi {{first name}} — quick question about {{practice name}}.
>
> Group practices your size typically see 15–20% of claims denied, and most billing teams only have time to re-work the big ones. Industry-wide, about 60% of denials are never touched — that's real money you already earned.
>
> We run a free denial audit: you send one export from {{their PMS if known}} (takes your admin ~10 minutes), we send back a report showing exactly what's recoverable and why claims are being denied. No commitment — worst case, you get a free diagnostic of your billing.
>
> If we then recover anything, you pay only a % of what actually lands in your account — verified against your own remittance files.
>
> Worth a 15-minute look at the report?

**Bump (day 3):** "Ran the numbers for a similar {{state}} group last month — $18,700 recovered in 6 weeks, all from claims they'd written off. Happy to send the (anonymized) report so you can see what the audit looks like."
**Breakup (day 10):** "Closing the file on this — if denials ever spike (biller turnover, payer policy change), the audit offer stands. One thing worth doing regardless: pull your denial rate for last quarter. If it's over 10%, someone should be working those."

### LinkedIn (owner/admin)
Connect (no note, or 1 line: "I work with behavioral health group practices on denied-claims recovery — good to connect"). After accept: "Thanks {{name}} — not going to pitch you. One useful thing: we publish a free denial audit for group practices (you send an export, we show what's recoverable and the top root causes). If billing's ever a sore spot, say the word and I'll run one for {{practice}}."

### Phone script (20 seconds to earn 3 minutes)
"Hi {{name}}, {{me}} from ClearClaim — do you have 30 seconds? … We recover denied insurance claims for behavioral health groups — money already earned that the billing team didn't have time to re-work. We do a free audit that shows exactly what's recoverable; if we recover anything you pay a percentage of what actually hits your account. If nothing's recoverable, the audit's free either way. Who handles denied claims for you today — someone in-house?"
(Their answer routes the call: in-house → "how much time do they get for re-working denials?"; billing company → "do you see a denial report from them monthly? Most groups never do.")

### Objections
| Objection | Answer |
|---|---|
| "We have a biller / billing company." | "Keep them. We only work claims that were already denied and left behind — the ones nobody has time for. If your biller is catching everything, the audit proves it and costs you nothing." |
| "How do I know you recovered it, not us?" | "We only take a fee on claims in the signed inventory list we worked, verified as paid in *your* remittance files. You see the evidence per claim." |
| "Is my patient data safe with AI?" | "We sign a BAA, everything runs in HIPAA-eligible infrastructure with zero data retention on the AI layer, every access is audit-logged, and a person reviews every appeal before it's sent. Happy to send our security summary." |
| "We tried a billing company; it was a disaster." | "So did most groups we work with — that's why there's no long-term contract and the first engagement is pay-on-recovery only. We have to earn month 2." |
| "20% is a lot." | "20% of money that's currently 0% collected. Your team's alternative cost is $25–40 of staff time per low-dollar claim — that's why these were written off in the first place." |
| "We're too busy to onboard this." | "Total lift is one data export (~10 min) and one signature. We do the rest, including submitting the appeals." |
| "Percentage fees aren't allowed here / for Medicaid." | "Correct — for those claims we use a flat per-claim fee instead. Our fee structure follows state and payer rules; our counsel keeps the matrix current." (Credibility builder, not a blocker.) |

---

## 6. Product Roadmap

| Version | Scope | Trigger to start |
|---|---|---|
| **V1 — Denial Recovery Agent** (mo 0–6) | Everything in §2. Service-wrapped. Recovered-$ report is the product. | Now |
| **V2 — AI Billing Assistant** (mo 6–14) | Full-billing delivery engine: claim scrubbing pre-submission (prevent denials, don't just appeal), eligibility checks, charge-entry from superbills, ERA auto-posting files, denial *prevention* analytics. Customer portal (status, recovered-$, denial trends). PMS integrations for top 3 systems in our book. | ≥5 full-billing customers signed |
| **V3 — Full AI RCM Platform** (mo 14–30) | Multi-tenant SaaS + service hybrid; payer-rules engine exposed as product; appeal-outcome benchmarks ("payer X denies CPT 90837 at 2.3× market"); team seats for practices' own billers (sell the workbench to the in-house teams we compete with). Second specialty vertical (PT) launched with the same engine. | $100K MRR, SOC 2 Type II, 2+ specialties validated |
| **V4 — Healthcare financial OS for specialty practices** (yr 3+) | Contract/underpayment analytics, payer-negotiation support, forecasting/credit products on top of verified collections data, credentialing automation. The 835 data exhaust becomes the platform. | $5M+ ARR, data network effects measurable |

Discipline rule: **no version starts before its trigger.** V2 built on spec (before 5 full-billing customers) is the most likely way we die of overengineering.

---

## 7. Investor Lens

- **TAM:** US RCM spend is ~$140B+; the outsourced-billing slice is **$6.3B growing ~12%/yr**; denied/underpaid claims are a multi-hundred-billion-dollar annual leak, with **~60% of denials never worked**. Our SAM (behavioral + PT + chiro group practices, 5–50 clinicians): roughly 50–80K US practices × $50–200K/yr billing spend ≈ **$4–8B**.
- **Why now:** claim denial rates at decade highs (12%+); staffing shortages in billing; LLMs crossed the threshold where appeal drafting + EOB reading is automatable at <$5/claim — the first time low-dollar denials have ever been economically workable.
- **Competition:** Crosby Health, Aegis (YC), Adonis, Candid Health, RapidClaims, Waystar — all aimed at hospitals, health systems, or digital-health companies. The small-specialty-group segment is held by thousands of sub-scale human billing companies (no software, 40%+ cost structures). We're not first to "AI + denials"; we aim to be first to **own the done-for-you specialty-group segment**.
- **Moat (built, not asserted):** (1) **payer-denial outcome graph** — which appeal arguments win, per payer × plan × CPT × state; every claim worked makes the next one better, and it cannot be scraped or bought; (2) full-billing switching costs (>90% gross retention is the industry norm); (3) the fax/portal ops layer software-only competitors won't do; (4) compliance posture (SOC 2 + state fee-matrix) as a sales gate vs. new entrants.
- **Exits:** PE RCM roll-ups buy books at ~1–2× revenue (floor); strategic buyers: Waystar/R1/Tebra, EHR vendors needing billing services, payer-services arms. **$100M company math:** ~1,000 practices × $60–100K/yr blended = $60–100M ARR is the platform path; even the conservative path ($15–20M ARR at 5–7× for an AI-native RCM with data assets) clears $100M. The wedge decision that gets us there: **conversion rate to full billing** (§1.3) — that number, at ~month 6, is what tells us whether this is a services company or a platform company.

---

## 8. Killer-Founder Discipline (what we will NOT do)

1. **No hospitals, no health systems, no "enterprise pilot" conversations** before $100K MRR. They are where 88% of AI pilots go to die.
2. **No PMS integrations** before 20 customers. Manual exports scale further than founders think.
3. **No dashboard-building.** The monthly recovered-$ PDF is the dashboard until a customer threatens to churn over it.
4. **No "AI replaces humans" claims** — internally or in sales. Human-approved appeals are the product's trust layer *and* our liability shield. Automation ratio rises quietly as win-rate data justifies it.
5. **No new specialty** until behavioral health hits $50K MRR. No V(n+1) before V(n)'s trigger.
6. **No touching money, no patient collections, no NY** until counsel says otherwise.
7. **Weekly scorecard, five numbers only:** audits delivered · pilots signed · $ recovered (835-verified) · fees collected · wedge→full-billing conversions. Everything else is noise.

---

## 9. THE FIRST THING TO BUILD THIS WEEK

**The Denial Audit Engine** — the single artifact that is simultaneously the sales weapon (free audit → pipeline), the MVP core (same pipeline runs production), and the fastest validation of the riskiest assumption (that AI can read real 835s/EOBs and find real money).

### Checklist (7 days)
**Legal/compliance rails (parallel, ~4 hrs of my time):**
- [ ] Email 3 healthcare attorneys (states: TX/FL focus) for the fee-structure memo + services agreement + BAA; engage one by Friday ($2–5K)
- [ ] Sign AWS BAA via AWS Artifact (self-serve, 30 min); create org with SSO+MFA
- [ ] Write the one-page data-handling policy (no PHI outside AWS, no PHI in logs/email/consumer tools)

**Build (days 1–5):**
- [ ] Terraform skeleton: VPC, Aurora Postgres (encrypted), S3+KMS, Cognito, audit-events table
- [ ] 835 parser: Stedi trial or open-source X12 parser; validate against **public sample 835 files** (CMS/clearinghouse samples — no real PHI this week)
- [ ] Seed the rules data: CARC/RARC code table + appeal-deadline table for top 8 payers (UHC 65d, MA 60d, Medicare 120d, Aetna/BCBS/Cigna/Humana 180d, per-state Medicaid)
- [ ] Denial classifier: Haiku-class model via Bedrock, structured output → {root cause, appealability, deadline remaining, expected value}
- [ ] Triage ranker: expected $ × win-probability heuristic ÷ effort; batch grouping by (payer, root cause)
- [ ] Report generator: branded PDF — "Recoverable: $X across N claims; top 5 root causes; deadline urgency table"
- [ ] EOB PDF ingestion (Claude vision) — *stretch goal; 835/CSV path is the must-have*

**Sales (days 3–7, parallel):**
- [ ] Build list: 150 behavioral-health group practices (5–50 clinicians, target states), with owner/admin names
- [ ] Set up outreach domain + warmup; load email sequence from §5
- [ ] Send first 50 audits offers; book 5 discovery calls for next week
- [ ] Draft the audit-engagement one-pager (what we need: one export; what they get: the report; BAA attached)

**Definition of done for the week:** a real 835 sample file goes in one end, a credible Denial Audit PDF comes out the other, and 5 practice owners have agreed to a call. That's it. Everything else is deferred.

---

## Sources (round 2)
- [NY Health Law Blog — percentage-based billing violates Medicaid regs / fee-splitting](https://www.nyhealthlawblog.com/2017/03/22/percentage-based-billing-contracts-violate-medicaid-regulations-and-may-constitute-improper-fee-splitting/) · [Liles Parker — changing laws on third-party billing & percentage models](https://www.lilesparker.com/2022/07/29/changes-in-federal-state-law-and-billing-contracts/) · [ABA — corporate practice of medicine & fee-splitting](https://www.americanbar.org/groups/health_law/resources/health-lawyer/archive/what-corporate-practice-medicine-fee-splitting-fee-splitting-prohibitions/) · [MedCycle — percentage-based billing compliance trap](https://medcyclesolutions.com/percentage-based-billing/)
- [Muni Health — 2026 appeal deadlines by payer](https://muni.health/blog/insurance-appeal-deadlines-2026) · [Muni Health — UHC appeal deadlines](https://muni.health/blog/uhc-appeal-timely-filing-deadlines-2026) · [MediBill RCM — timely filing limits](https://www.medibillrcm.com/blog/timely-filing-limit-for-claims-in-medical-billing/)
- [Crosby Health](https://www.crosbyhealth.com/) · [Aegis (YC)](https://www.ycombinator.com/companies/aegis) · [Adonis — AI agents for low-dollar high-volume claims](https://www.adonis.io/resources/unlocking-hidden-revenue-how-ai-agents-recover-low-dollar-high-volume-claims-in-healthcare-rcm) · [Counterforce Health](https://www.counterforcehealth.org/)
- Prior rounds: `BUSINESS-OPPORTUNITY-RESEARCH.md`, `RED-TEAM-ANALYSIS.md`

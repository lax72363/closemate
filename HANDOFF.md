# HANDOFF — full context in one page

*For future-me and any AI assistant continuing this work. Read this first.*

## What this company is
**AI-powered denial recovery for behavioral health group practices (5–50 clinicians).**
Offer: *"We find money your practice already earned but never collected."* Free denial
audit → contingency recovery (20% of verified recoveries, commercial claims only) →
convert to full billing at 4–5% of collections. **The wedge is customer acquisition;
full-billing conversion is the business.** North-star KPI: wedge→full-billing conversion
(target ≥40% by month 6 of an account).

## How we got here (don't relitigate without new facts)
1. Original idea (real-estate AI chatbot) abandoned. Second idea (insurance supplement
   recovery for roofers) **killed by red-team**: TX Insurance Code Ch. 4102 criminalizes the
   customer workflow in the #1 market + total dependency on Verisk's proprietary data.
   Full analysis: `RED-TEAM-ANALYSIS.md` (28-model scored comparison).
2. Winner re-derived and itself red-teamed 3×: `BUSINESS-OPPORTUNITY-RESEARCH.md` →
   `FOUNDING-PLAN.md` (incl. fee-splitting laws, appeal-deadline physics, low-dollar-claim
   economics) → `BOOTSTRAP-PLAN.md` (17-year-old, no budget, adult LLC signer required).

## Hard rules (violating any of these can end the company)
1. **No real PHI** outside BAA-covered systems (Google Workspace/GCP-Vertex once set up).
   GitHub = de-identified only. 2. **Never touch payer money** — payments go to the
   practice; we invoice. 3. **Human reviews every appeal** before it's sent.
4. **No patient collections. No Medicare/Medicaid claims phase 1. No New York.**
5. Contingency fees on commercial claims only; flat fees where % is restricted.
6. Never promise specific recovery amounts before an audit.

## What exists and works (all tested: `python3 engine/tests.py`, 27 checks)
- `engine/run_audit.py` — 835/CSV in → audit report out (HTML/MD/JSON)
- `engine/appeal_letter.py` — appeal drafts (offline templates; Claude API optional; use
  BAA'd Vertex endpoint for real PHI)
- `engine/reconcile.py` — matches worked claims vs new 835s → verified recoveries + invoice
- `data/carc_codes.json` (49 codes) + `rarc_codes.json` + `payer_deadlines.json` — **the
  moat**: update these with every real claim outcome
- `leads/find_leads.py` — free NPPES API → lead CSVs
- `.github/workflows/audit.yml` — phone workflow: upload to `inbox/` → report in `reports/`
- `outreach/templates.md`, `legal/` drafts, `tracker/scorecard.csv`

## Current status (July 10, 2026)
- Founder is 17, phone-only until ~July 24 → executing `PHONE-PLAYBOOK.md`
- Pending founder actions: adult-signer conversation, LLC filing, domain, Google Workspace
  BAA, lead qualification, first 25 emails
- Nothing legal signed yet; NO real customer data received yet (samples are synthetic)

## Next build priorities (in order, only when needed)
1. After first real de-identified export: fix whatever breaks in the parser (there will be
   something) and add its CARC codes to the knowledge base
2. After LLC + BAAs: GCP project, move PHI processing to Vertex AI (per `FOUNDING-PLAN.md` §3)
3. After first pilot signed: submission tracking + deadline reminders (a Sheet is fine)
4. After first recovery: run `reconcile.py`, send first invoice, write case study
5. NOT until 5+ full-billing customers: portal, integrations, dashboards (see roadmap triggers)

## Key economics to remember
BH claims are $75–250 → contingency fee ≈ $15–50/claim → wedge only works if AI cost/claim
stays <$5 and batch appeals (one letter, many claims) are the default. A 10-clinician group
at ~$150K/mo collections on full billing at 4.5% = $6,750/mo — that's the real prize.
$10K MRR ≈ 4–6 practices. Payers take 30–60 days; first revenue month 3–4 is on-plan.

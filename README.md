# ClearClaim (working name)

AI-powered denial recovery for behavioral health group practices.
**"We find money your practice already earned but never collected."**

> Strategy docs: `BUSINESS-OPPORTUNITY-RESEARCH.md` → `RED-TEAM-ANALYSIS.md` →
> `FOUNDING-PLAN.md` (scale version) → `BOOTSTRAP-PLAN.md` (how we're actually starting).

## The Denial Audit Engine (working, day 1)

```bash
# 1. Run a full audit: 835 files and/or CSV exports in, client-ready HTML report out
python3 engine/run_audit.py --practice "Acme Counseling Group" \
    samples/sample_835_optum.txt samples/sample_denials_export.csv \
    -o reports/demo_audit.html --json-out reports/demo_audit.json

# 2. Draft an appeal letter (one claim, or one letter covering a whole batch)
python3 engine/appeal_letter.py reports/demo_audit.json --claim ACG-2005
python3 engine/appeal_letter.py reports/demo_audit.json --batch "OPTUM BEHAVIORAL HEALTH:197"

# 3. Build a lead list from the free CMS NPI registry (real practices, owner names, phones)
python3 leads/find_leads.py --state TX --city Dallas --limit 100 -o leads/tx_dallas.csv
```

Everything is stdlib Python — no dependencies, runs anywhere.

## What's where
| Path | What |
|---|---|
| `engine/parse_835.py` | X12 835 + PMS CSV parser → normalized claims |
| `engine/triage.py` | CARC classification, appeal-deadline check, expected-value ranking, batch grouping |
| `engine/report.py` | Customer-facing audit report (HTML, print-to-PDF) |
| `engine/run_audit.py` | One command: files in → report out |
| `engine/appeal_letter.py` | Appeal drafts (offline templates; Claude API optional). **Human reviews every letter.** |
| `data/carc_codes.json` | Denial-code knowledge base — add every new code you meet; this compounds into the moat |
| `data/payer_deadlines.json` | Appeal windows per payer (verify per plan!) |
| `leads/find_leads.py` | NPPES registry → qualified-lead CSV |
| `outreach/templates.md` | Email/LinkedIn/phone scripts + objection answers |
| `tracker/scorecard.csv` | The only 8 numbers that matter, weekly |
| `samples/` | 100% synthetic demo data (fake patients) |

## Hard rules (non-negotiable)
1. **No real PHI** until: LLC formed (adult signer), BAA signed with the practice, and processing
   moved to BAA-covered infrastructure (Google Workspace + GCP/Vertex AI). De-identified CSVs only until then.
2. **Never touch payer money.** Payments flow to the practice's accounts; we invoice.
3. **A human reviews every appeal** before it's sent.
4. **No patient collections. No Medicare/Medicaid claims in phase 1. No New York.**
5. Estimates in reports are estimates — never promise specific recoveries.

# 📥 Inbox — drop audit files here from your phone

**How to run an audit from your phone:**
1. Open this folder on github.com (or the GitHub app) → `Add file` → `Upload files`
2. Upload the practice's export, named like `bright_path_counseling.csv`
   (the filename becomes the practice name on the report)
3. Wait ~1 minute → open `reports/` → `bright_path_counseling.md` (readable on phone),
   `.pdf` (download & email to the practice), `.html` (pretty version)

**Accepted formats:** CSV/TSV exports (needs a denial/reason-code column) or raw X12 835 files.

## ⚠️ HARD RULE — DE-IDENTIFIED DATA ONLY
GitHub is **not** a HIPAA/BAA-covered environment. Before anything is uploaded here, the
practice must **delete patient name / DOB / member-ID columns**. Claim numbers, payers,
dates of service, CPT codes, amounts, denial codes = fine and all the audit needs.
If a file arrives with patient info: do NOT upload it; ask them to re-export without those
columns. When we have BAA'd infrastructure (GCP), real-PHI processing moves there.

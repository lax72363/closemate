# Compliance Checklist (bootstrap edition)

## Before ANY real PHI
- [ ] LLC formed (adult member signs); EIN obtained
- [ ] BAA template ready — start from **HHS's published model BAA provisions** (hhs.gov, free),
      have the law clinic review
- [ ] Google Workspace Business + **accept Google's BAA** (Admin console → Account settings → Legal & compliance)
- [ ] GCP project + **accept GCP BAA**; use Vertex AI for any AI call touching PHI
- [ ] Laptop: full-disk encryption ON, auto-lock, no PHI in personal cloud sync
- [ ] PHI lives ONLY in: BAA'd Drive folder, GCP, encrypted laptop working dir (deleted after use)
- [ ] One-page internal policy written: where PHI lives, who can access (you), breach steps
- [ ] HIPAA fax service with BAA before first faxed appeal

## Before first paying customer
- [ ] Pilot agreement + BAA reviewed by attorney/clinic and signed by adult member
- [ ] Fee legality confirmed for YOUR state (percentage fees restricted? → flat-fee menu)
- [ ] Launch exclusions honored: no NY, no Medicare/Medicaid claims, no patient collections
- [ ] Cyber liability insurance quoted (~$50–100/mo) — bind at first real PHI flow

## Month 4–6 (funded by revenue)
- [ ] Written policy set (access review, incident response, retention/deletion)
- [ ] Vendor list with BAA status tracked
- [ ] SOC 2 Type I planning only if a customer/partner demands it

## Standing rules
1. Never touch payer money. 2. Human reviews every appeal. 3. No PHI in logs, email to
non-BAA'd addresses, consumer AI tools, or screenshots. 4. When unsure, de-identify first.

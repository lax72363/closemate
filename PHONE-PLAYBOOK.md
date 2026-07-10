# 📱 Phone Playbook — the 2-week mobile battle plan

You're away from a computer until ~July 24. Good news: **the next 2 weeks of this company
are outreach and paperwork, not code** — and the code now runs itself in the cloud.
Everything below works from a phone.

## How to run an audit from your phone
1. GitHub → this repo → `inbox/` → **Add file → Upload files** → upload the practice's
   de-identified CSV, named `their_practice_name.csv`
2. ~1 min later, `reports/` has: **`.md`** (read it on your phone), **`.pdf`** (download →
   attach to email to the practice), `.html` (pretty version)
3. ⚠️ **De-identified only** (no patient names/DOB/member IDs) — GitHub is not BAA'd.
   The export instructions in `outreach/templates.md` already tell practices to delete
   those columns.

A demo file is already in the inbox so you can see a finished report in `reports/`.

## The 2-week schedule (30–45 min/day, all phone)

### Week 1 — paperwork + pipeline
- **Day 1:** Parent/guardian conversation (show them `BOOTSTRAP-PLAN.md` §1). Start LLC
  filing — most states' filing sites work on mobile. Buy domain + set up email (Namecheap/
  Cloudflare apps work fine on phone).
- **Day 2:** Google Workspace Business trial on your domain; accept the BAA in Admin
  console (Account → Legal & compliance). 15 min.
- **Days 3–7:** Qualify leads. Open `leads/` CSV in Google Sheets app. For each org:
  find website, count clinicians (5–50?), check "we accept insurance". Fill the columns.
  Target: **5 qualified/day**. Find owner emails from the website/LinkedIn.

### Week 2 — first sends
- **Days 8–12:** Send **5 emails/day** from your new domain (templates in
  `outreach/templates.md` — copy/paste from the GitHub app, personalize line 1).
  Log every send in `tracker/scorecard.csv` (editable in the GitHub app).
- **Days 11–14:** Bumps to day-8/9 non-responders. LinkedIn connects to 5 owners/day.
- **Any reply that says "sure, send instructions"** → send the 3-line export instructions
  → file lands → upload to `inbox/` → send them the PDF. **You can deliver your first
  real audit entirely from your phone.**

### Every Sunday (10 min)
Update `tracker/scorecard.csv`. One metric matters right now: **audits delivered**.

## Warm-intro homework (worth more than everything above)
List 5 adults you know connected to any therapy/counseling/PT practice. One text:
"Do you know anyone who runs a therapy group practice? I find money practices lost on
denied insurance claims — free audit, they'd love it." One warm intro ≈ 100 cold emails.

## One-page site copy (paste into Carrd from your phone, ~20 min)
> **[Company Name]**
> **We find money your practice already earned — but never collected.**
> 15–20% of behavioral health claims get denied. Most are never re-worked. That's revenue
> you've already earned, written off because nobody has time to fight a $140 claim.
>
> **Free Denial Audit.** Send one de-identified export from your billing system (10 minutes).
> We send back: what's recoverable, your top denial causes, and which claims to attack
> first. No software. No contract. No patient data leaves your system.
>
> **If we recover, you pay a % of what actually lands in your account** — verified against
> your own remittance files. Payments always flow directly to you. Nothing recovered,
> nothing owed.
>
> [Get your free audit →] (mailto link)

## If you get stuck
Every doc you need is in this repo, readable on mobile: outreach scripts
(`outreach/templates.md`), objection answers (same file), legal checklist
(`legal/compliance_checklist.md`), the whole strategy (`HANDOFF.md` first).

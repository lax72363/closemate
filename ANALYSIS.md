# Opportunity Analysis — 72-Hour Profit Benchmark

**Date:** 2026-07-23 · **Constraint set:** $0 startup, revenue within 72h, minimal human involvement, fully legal.

## Scoring model

Each candidate scored 1–5 on: P(revenue ≤72h), startup cost fit, competition inverse,
automation potential, scalability, expected profit. Weighted toward P(revenue) and
automation (the two binding constraints).

## Shortlist (top of ~40 models evaluated across 8 categories)

| Model | P(rev 72h) | $0 fit | Competition | Automation | Scale | Verdict |
|---|---|---|---|---|---|---|
| Client-side freemium tool + one-time unlock (Gumroad) | 4 | 5 | 3 | 5 | 4 | **SELECTED** |
| Notion/spreadsheet template pack | 3 | 5 | 1 (saturated) | 5 | 3 | Backup |
| Micro-SaaS (hosted, Stripe subscriptions) | 2 | 3 (needs infra) | 3 | 3 | 5 | Too much human setup |
| Cold-email productized service (AI audits) | 3 | 4 | 3 | 2 (delivery = labor) | 2 | Violates min-involvement |
| Paid job board / directory listings | 1 | 4 | 3 | 4 | 4 | Too slow to first sale |
| Newsletter + sponsorships/affiliate | 1 | 5 | 2 | 4 | 4 | No 72h monetization |
| Print-on-demand storefront | 2 | 4 | 1 | 4 | 3 | Weak margins, slow |
| Prompt packs / AI asset packs | 3 | 5 | 1 | 5 | 3 | Race to the bottom |

## Selected: **KeywordFit** — client-side ATS resume keyword scanner

### Why this wins
1. **Buyers already pay, today.** Jobscan charges ~$49.95/mo for keyword matching.
   Teal, Resume Worded, Enhancv all monetize the same pain. We undercut with a
   **$12 one-time** Pro (launch price; $29 list) — no subscription.
2. **Real differentiator:** 100% client-side. Competitors require uploading your
   resume to their servers. Ours never leaves the browser — a one-line privacy
   pitch that writes its own launch post.
3. **Zero infrastructure.** Static HTML on GitHub Pages (free). Payments via a
   Gumroad payment link (free, they take ~10%+30¢). The paid product *is* a
   downloadable single HTML file — no license servers, no accounts, no support burden.
4. **Free tier is the marketing.** The hosted free scanner delivers a genuinely
   useful score + top missing keywords, then upsells the full report.
5. **Distribution exists.** Job-search content performs on HN (Show HN),
   X/LinkedIn (job-search audience is enormous in any market), and communities —
   all launch copy is pre-written in `LAUNCH.md`.

### Unit economics
- Price: $12 launch → ~$10.50 net after Gumroad fees. Costs: $0.
- Break-even: first sale. 25 sales ≈ $260; a modestly successful HN/X launch
  (5–20k visits, 1–3% free-scan→purchase on engaged users) plausibly clears
  $100–$1,000 in the window. Downside is $0 lost.

### Risks & mitigations
- **Piracy of the HTML file:** irrelevant at this scale; pirates weren't buyers.
- **Launch flops:** copy targets 5 independent channels; product remains a
  permanent asset with SEO surface (free tool pages compound).
- **Deterministic engine vs. AI competitors:** keyword coverage *is* what ATS
  matching measures; determinism is a feature (instant, private, offline).

### Pivot trigger
If <2 sales after all launch posts have run 48h, pivot the same asset to a
**B2B white-label** ($99, career coaches & resume writers rebrand it) — copy for
that pivot is pre-drafted in `OPERATIONS.md`.

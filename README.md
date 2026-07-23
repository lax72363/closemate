# KeywordFit — private, client-side ATS resume keyword scanner

**Business:** freemium digital product. Free scanner (this repo, hosted on
GitHub Pages) drives sales of a $12 one-time Pro file sold via Gumroad.
$0 infrastructure cost. Built for the 72-hour profit benchmark.

## Repo map

| File | What it is |
|---|---|
| `index.html` | The live product: landing page + free scanner + upsell. Fully self-contained, no backend, no dependencies. |
| `pro/KeywordFit-Pro.html` | The paid product (upload to Gumroad). Generated from `index.html` with the `PRO` flag flipped. |
| `CHECKLIST.md` | **Start here** — the only human steps required (~35 min). |
| `LAUNCH.md` | Ready-to-paste marketing copy for HN, X, LinkedIn, Reddit, Product Hunt, Gumroad, TikTok. |
| `OPERATIONS.md` | Daily 5-minute SOP, support macros, pricing experiments, pivot plan. |
| `ANALYSIS.md` | The business-model analysis and why this one was selected. |

## Rebuilding the Pro file

```sh
sed -e 's/const PRO = false;/const PRO = true;/' \
    -e 's|<title>.*</title>|<title>KeywordFit Pro — Full ATS Resume Optimization Report</title>|' \
    index.html > pro/KeywordFit-Pro.html
```

## How the engine works

Deterministic, 100% client-side: a curated ~350-term skills dictionary
(with aliases, across 11 categories) plus weighted n-gram extraction from the
job description. Terms found in "Requirements/Qualifications" sections are
weighted higher. The match score is weighted keyword coverage of the resume —
the same signal ATS ranking and recruiter searches key on. No data ever leaves
the browser.

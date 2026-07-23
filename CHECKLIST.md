# CHECKLIST.md — Everything you need to do, batched (≈35 minutes total)

Everything else is already built. These are the only steps that require a human
(accounts, payments, and posting under your identity).

## Go live (≈15 min)

- [ ] **1. Enable GitHub Pages (2 min):** Repo → Settings → Pages → "Deploy
      from a branch" → branch `claude/72hr-profit-benchmark-l7iaug` (or merge
      to `main` first), folder `/ (root)`. Note the URL it gives you
      (`https://<user>.github.io/<repo>/`). Repo must be public for free Pages.
- [ ] **2. Create the Gumroad product (10 min):** gumroad.com → sign up (free)
      → New product → "Digital product" → name/price/description are all
      pre-written in `LAUNCH.md` section 6 → upload the file
      `pro/KeywordFit-Pro.html` → publish. Copy your product link.
- [ ] **3. Wire the buy button (2 min):** In `index.html`, replace
      `https://REPLACE_ME.gumroad.com/l/keywordfit` with your Gumroad link and
      commit — or just paste both URLs (Pages + Gumroad) into this Claude
      session and I'll do it and push.
- [ ] **4. (Recommended, 1 min):** After uploading to Gumroad, delete the
      `pro/` folder from the public branch so the paid file isn't sitting in a
      public repo. Keep a local copy or let me regenerate it any time (it's
      built from `index.html` with one flag flipped).

## Launch (≈20 min, copy-paste from LAUNCH.md)

- [ ] **5. Show HN** — title, URL, and first comment are in LAUNCH.md §1.
- [ ] **6. X/Twitter thread** — LAUNCH.md §2 (replace YOUR_URL).
- [ ] **7. LinkedIn post** — LAUNCH.md §3.
- [ ] **8. Reddit** — LAUNCH.md §4 (check each sub's self-promo rules first).
- [ ] **9. Product Hunt** — next morning, LAUNCH.md §5.

## Then (≈5 min/day)

- [ ] Follow the daily loop in `OPERATIONS.md` (check sales, reply to threads,
      log metrics). Delegate everything else — SEO pages, niche landing pages,
      copy variants, the B2B pivot — back to me.

**Nothing above involves spending money. Revenue path: free page → Gumroad →
your bank account (Gumroad pays out directly).**

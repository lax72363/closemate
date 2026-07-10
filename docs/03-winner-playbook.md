# Phase 3 — The Winner: "Deadline Rescue" Playbook

**Business:** Form 5500-EZ Deadline Rescue — a done-with-you filing concierge for
solo 401(k) owners, sold against the July 31, 2026 IRS deadline.

**Working name:** **Solo401k Rescue** (domain candidates: solo401krescue.com,
file5500ez.com, 5500rescue.com — buy whichever is free first, ~$10).

**Positioning in one sentence:** *"Your brokerage won't file it. Your CPA doesn't
do it. The IRS wants it by July 31 — or $250/day. We'll get it filed with you in
30 minutes, guaranteed."*

---

## 1. The Offer (three tiers, anchored high)

| Tier | Price | What they get | Role |
|---|---|---|---|
| **Rescue Kit** | **$99** | Line-by-line video walkthrough, fillable worksheet, EFAST2 registration guide, pre-submission checklist, deadline-reminder signup | Downsell for DIYers who balk at $199 |
| **File-With-Me Session** ⭐ | **$199** | 30-min live Zoom: you share your screen, we walk every line, you hit submit, you leave with the IRS confirmation. Includes the Rescue Kit. **Guarantee: filed by end of call or 100% refund.** | Flagship — the $1,000 engine |
| **Late-Filer Amnesty Package** | **$449** | Everything above **for each missed year**, plus a guided IRS penalty-relief submission (Rev. Proc. 2015-32) so the $250/day exposure collapses to the program's $500/yr fee (capped $1,500) | High-anxiety, high-ticket upsell |

Why these prices: the buyer's alternative costs are a TPA at $125–$500/yr (which
won't serve non-customers), a CPA at $300–$500 (who usually declines), or $250/day.
$199 is priced to be an instant yes for someone with a >$250k account — by
definition every buyer has a quarter-million dollars.

**Path to $1,000:** 5–6 flagship sessions, or 2 amnesty packages + 1 session, or
any mix. Realistic at 20–35% close on warm inbound.

**Critical positioning/compliance guardrails (bake into everything):**
- We provide *education and preparation assistance*; the customer signs and submits
  their own information return. Not legal, tax, or investment advice.
- Every scary number cites the IRS directly (irs.gov links on the page).
- Complex cases (plan errors, prohibited transactions, non-calendar plan years)
  get referred out — say so publicly; it builds trust and filters bad-fit buyers.
- The free guide is genuinely complete. Anyone can DIY from it. The paid product
  is confidence + speed + a second pair of eyes, honestly framed.

---

## 2. Sales strategy

**Principle: teach loudly, sell quietly.** In trust-sensitive money niches,
direct pitching reads as scam; complete free help reads as expertise. Every channel
gets the same play: post the *entire* solution for free → the anxious subset
(15–30% of this audience) self-selects into paying for hand-holding.

**The funnel:**
```
Free "Am I required to file?" 60-second checker + free complete guide
        │
        ▼
Email capture (deadline countdown sequence)
        │
        ▼
$199 File-With-Me booking (Stripe Payment Link + Calendly)
        │
        ├── balks at price → $99 Rescue Kit (automated, zero marginal cost)
        └── "I also missed last year…" → $449/yr Amnesty Package
```

**Channel priority (ordered by expected $/hour of effort):**
1. **Reddit value posts** — r/financialindependence, r/fatFIRE, r/Bogleheads,
   r/smallbusiness, r/tax, r/solo401k. High solo-401k density, balances >$250k
   are common, July timing is perfect. Respect each sub's self-promo rules: the
   post is the full free guide; the service lives in your profile and in replies
   to people who ask for help.
2. **Bogleheads + BiggerPockets forums** — the two highest-concentration
   communities on the internet for this exact filer (index-fund millionaires and
   checkbook-control real-estate investors).
3. **CPA/bookkeeper referral emails** — they get asked, they decline, they'd love
   somewhere to send people. 30% referral fee ($60/session). One yes = recurring
   channel.
4. **X/FinTwit thread** — "$250/day penalty most solo 401(k) owners have never
   heard of" is native viral material in July.
5. **Google Ads (optional, ≤$100)** — "form 5500-ez late", "5500 ez deadline",
   "forgot to file 5500-ez": near-zero competition, surgical intent.
6. **YouTube screencast** — "How to file Form 5500-EZ (2026, step by step)".
   Search spikes every July; evergreen asset; description links to checker.

---

## 3. Cold outreach templates

### CPA / bookkeeper referral email
> **Subject: For the solo-401k 5500-EZ questions you don't want**
>
> Hi {{first name}} — quick one ahead of July 31.
>
> When a client with a solo 401(k) over $250k asks you to handle their Form
> 5500-EZ, it's usually more hassle than the fee is worth — it's not even in most
> tax software.
>
> I run a filing concierge for exactly this: a 30-minute guided session where the
> client files their own 5500-EZ with me on Zoom ($199 flat, filed-or-refunded).
> You keep the client relationship; I never touch their return or their custody.
>
> I pay a $60 referral fee per completed session, or you can white-label it.
> Want the one-pager?
>
> {{name}} · {{site}}

### Direct DM (to someone who posted a 5500-EZ question in a forum/thread)
> Saw your question about the 5500-EZ deadline. Short version: if your solo 401(k)
> had over $250k in assets on Dec 31, you must file by July 31 — but it's genuinely
> a 30-minute job once someone shows you which boxes matter. I wrote a free
> step-by-step guide here: {{link}}. If you'd rather have someone on Zoom while you
> do it, that's what I do for a flat $199 (you file it yourself on your own screen
> — I never touch your account). Either way, don't blow the deadline — it's $250/day.

### Solo-401k plan-document providers / influencers (rev-share)
> Subject: Rev-share for your audience's July 31 problem
>
> Your audience skews exactly into "solo 401(k) over $250k" territory. I run a
> $199 guided 5500-EZ filing session (customer files it themselves; I guide).
> 30% rev-share on anything from your link, tracked via unique code. July 31 is
> 3 weeks out — want a sample session recording?

---

## 4. Landing page copy (implemented in `landing/index.html`)

**Headline:** Haven't filed your Solo 401(k)'s Form 5500-EZ? The IRS deadline is
**July 31**. The penalty is **$250 a day.**

**Sub:** If your solo 401(k) held more than $250,000 last Dec 31, filing is
mandatory — and your brokerage won't do it for you. We'll get it filed **with you,
live, in 30 minutes.** Filed by end of call or it's free.

**CTA:** Book my File-With-Me session — $199 → *(secondary: "Not sure you need to
file? 60-second checker")*

Sections: countdown timer → "Why you've never heard of this form" (brokerage/CPA
gap story) → How it works (3 steps) → Pricing tiers → Founder credibility + IRS
citations → Guarantee → FAQ → Disclaimer.
Full page is built and deployable (GitHub Pages/Netlify) — see `landing/`.

---

## 5. Sales script (the 3-minute close — most sales need no call, but for fence-sitters)

1. **Qualify (30s):** "Quick check so I don't waste your money — was your plan's
   total over $250k on December 31? Calendar-year plan? First filing or missed
   years?" *(Missed years → Amnesty pitch. Under $250k → tell them they likely
   don't need to file, free. That honesty closes future business and referrals.)*
2. **Diagnose the fear (45s):** "What's the part you're least sure about?" Let them
   talk. Echo it back precisely.
3. **Collapse the fear (45s):** "That part is question {{X}} on a 2-page form. On
   our call you'll share your screen, I'll walk you line by line, you'll click
   submit yourself, and you'll see the IRS confirmation before we hang up. I never
   touch your account or your money."
4. **Price with the anchor (30s):** "It's a flat $199. For context: the IRS penalty
   is $250 per *day*, and TPAs charge up to $500 a year for less-personal service.
   If we don't get it filed on the call, you pay nothing."
5. **Close (15s):** "I have {{two slots}} tomorrow — morning or evening?"

## 6. Demo (asynchronous — do the work once)

Record one 4-minute Loom: a mock filing session on a dummy plan, showing the
worksheet, the form, and the confirmation screen. Embed on landing page, pin on X,
link in every DM. This *is* the demo — nobody needs a live pre-sales demo for a
$199 product; the recording converts while you sleep.

---

## 7. FAQ (publish verbatim on the landing page)

- **Do I even need to file?** Only if your solo 401(k)'s total assets exceeded
  $250,000 at the end of the plan year, or this is the plan's final year (closing).
  Use the free 60-second checker — if you don't need to file, we'll tell you and
  you keep your $199.
- **Why didn't my brokerage tell me?** Filing is the *plan administrator's* duty —
  and for a solo 401(k), the administrator is you. Brokerages custody assets; they
  don't administer your plan.
- **Can't my CPA do this?** Ask them — many decline because Form 5500-EZ isn't an
  income-tax form and isn't in standard tax software. If yours handles it, great,
  use them.
- **Do you need my account logins?** Never. You file on your own screen; we guide.
  We never take custody of credentials, funds, or your return.
- **What if I've missed previous years?** There's an IRS penalty-relief program
  (Rev. Proc. 2015-32) that caps penalties at $500 per return / $1,500 total for
  most late filers. Our Amnesty Package walks you through it.
- **What if my situation is complicated?** Then we'll say so on the call, refund
  you, and point you to an ERISA-savvy professional. We do the simple 90%, honestly.
- **Is this tax advice?** No — education and preparation assistance. You remain
  the filer of record.
- **What if we run out of time before July 31?** File Form 5558 for an extension to
  October 15 — we cover that in every session booked after July 25, free.

## 8. Objection handling

| Objection | Response |
|---|---|
| "I'll just do it myself free." | "You absolutely can — here's our complete free guide. About a third of our customers read it and then book anyway, because a second pair of eyes on a $250/day form is worth $199 to them. Either way, file before the 31st." |
| "$199 for 30 minutes?" | "You're not buying 30 minutes, you're buying zero chance of a mis-filing on a form with a $150,000 penalty cap. Your TPA alternative is $500/yr — if they'll even take you." |
| "How do I know you're legit?" | "You never give me access to anything — you file on your own screen. Refund if it's not filed by end of call. And every claim on the site links to the IRS source." |
| "My deadline anxiety says just skip this year." | "The penalty accrues daily and the IRS matches broker Form 5498 data — non-filing gets *more* expensive every day, and the amnesty program only works BEFORE they notice you." |
| "I'll wait until closer to the deadline." | "Last week of July is when EFAST2 gets slow and our calendar fills. Book now, and if you finish early with the free guide, cancel for a full refund." |

## 9. Follow-up sequence (email, automated)

- **T+0 (checker completion):** result + free guide + soft CTA.
- **T+1 day:** "The 3 mistakes that turn a 2-page form into a $1,500 problem" + CTA.
- **T+3 days:** case story (anonymized session recap: 22 minutes, filed) + CTA.
- **T+7 / T+14:** countdown mails — "X days left; here's exactly what to have ready."
- **July 28–30:** final-call mail: "48 hours. Two options: file with the free guide
  tonight, or grab one of the last sessions. If neither, file Form 5558 today —
  here's how, free."
- **Post-purchase:** confirmation → prep checklist → session → confirmation PDF →
  *"want us to remind you next May and pre-fill next year's form? $99/yr"* ← this
  line converts the one-off into recurring revenue.

## 10. Fulfillment process (per flagship session, ~40 min total)

1. Intake form at booking (plan name, EIN status, year-end asset total, prior
   filings — 5 questions).
2. Pre-fill the worksheet from intake (10 min; AI-drafted, human-checked).
3. 30-min Zoom: guide, they type, they submit, confirmation on screen.
4. Send recap email: confirmation copy reminder, next-year deadline, $99/yr
   reminder-service offer, referral ask ("know another solo-k owner? $50 credit").

Capacity check: 8 sessions/day solo without strain → $1,592/day ceiling on
flagship alone. Fulfillment is never the bottleneck this month.

## 11. Automation plan (build only after revenue)

- **Week 1 (manual):** Stripe Payment Links, Calendly, Zoom, a Google Doc worksheet.
  Zero build time before first dollar.
- **Week 2–4:** intake → AI pre-fills worksheet + drafts recap email; email sequence
  in a free-tier ESP; checker as a simple static-site quiz feeding the ESP.
- **Month 2+:** self-serve product — checker → pay → AI-generated personalized
  filing packet + optional human review ($149) → the $99/yr reminder/pre-fill
  subscription becomes the flywheel. At that point the human session becomes the
  premium tier and the software does the volume — this is the $10k/mo shape.

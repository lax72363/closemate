# 05 — Legal, Tax & the Age-17 Constraint

Nothing in this plan requires lying, borrowed identities, or ToS violations — and
several things genuinely require a parent/guardian until you're 18. This file is the
compliant route. **Read it with a parent before day 1.** (This is planning guidance,
not legal advice; for contracts and entity formation, a one-hour consult with a small-
business attorney in your state — ~$150–300, budgeted from month-2 profits — is worth it.)

## What requires an adult, exactly

| Item | The rule | The compliant route |
|---|---|---|
| **Stripe** | Minimum age 13 for a Standard account, but under 18 a **legal guardian must assume ownership** of the account (their name, DOB, SSN last-4, consent to Stripe's ToS) before it can accept charges and pay out | Parent becomes the account owner; you operate it with their supervision. Transfer ownership to yourself at 18. Do not "borrow" an adult's identity without their real involvement — that's the fraud this plan forbids |
| **Business entity (LLC)** | Most states don't bar minor LLC members outright, but minors can't reliably sign binding formation/bank documents, and banks won't open business accounts for minors alone | Simplest: operate as a **sole proprietorship under your parent's umbrella** initially (or parent forms a single-member LLC and you work within it), then form your own LLC at 18. An LLC is genuinely useful here (liability around SMS compliance), so target parent-owned LLC by ~$2k MRR |
| **Bank account** | Business accounts require an adult | Teen/joint checking with a parent for now; proper business account under the LLC when formed |
| **Contracts with clients** | A minor's contracts are generally **voidable by the minor** — savvy clients may hesitate | Month 1: keep it frictionless — no long contracts anyway (month-to-month, cancel anytime, Stripe ToS at checkout). For team/brokerage deals: parent (or parent's LLC) is the contracting party |
| **Twilio** | Requires legal capacity to contract (18+) | Account under parent/parent's LLC |
| **Google Ads / Meta Ads** | Advertiser accounts require 18+ | Not needed until ~client #25 anyway (plan/02). When needed: account owned/supervised by parent; you build the campaigns |
| **Domain, Carrd, Cal.com, Airtable, Make** | 13+/16+ typically — fine | You directly |
| **LinkedIn** | 16+ | Fine — useful for team-lead outreach in Y2 |
| **Upwork (hiring contractors)** | 18+ | Hire via parent account until 18, or use referrals/Discord communities with Stripe/PayPal payouts via the business account |

**Practical structure for months 1–18:** Parent-supervised business (parent owns
Stripe, Twilio, bank; you own the work, the code, and this repo). Written family
agreement — one page: who owns what %, what happens to the money, what transfers to you
at 18. It sounds excessive; it prevents the #1 teen-business failure mode (family money
ambiguity). **You turn 18 during year 2 of this plan: schedule the transfer of Stripe,
Twilio, bank, and entity into your name/new LLC as a year-2 Q-priority.**

## Taxes (US, brief)

- Business profit is **earned income**: file a 1040 with Schedule C + Schedule SE once
  net self-employment income exceeds $400/yr — which happens in month 2 of the base
  case. Self-employment tax ≈ 15.3% on net profit; set aside **25–30% of profit** in a
  separate savings bucket from the first dollar.
- Being a minor doesn't exempt you; being claimed as a dependent doesn't exempt the
  business income. Parents' tax preparer should know about the business.
- Quarterly estimated payments become relevant once you owe ≥$1,000/yr in tax —
  roughly at $7k+ annual profit (year 1, Q3–Q4 in base case).
- Keep books from day 1 (Wave + the plan/02 tracker). A bookkeeper contractor comes at
  ~$10k MRR.

## SMS & marketing compliance (this is the industry's landmine — take it seriously)

- **A2P 10DLC registration** (US carrier requirement for business SMS via Twilio):
  register the brand + campaign *before* sending client traffic. Costs a few dollars a
  month per campaign, takes days — start during pre-week. Unregistered traffic gets
  filtered/blocked and can get the account shut down.
- **TCPA:** closemate texts *leads who initiated contact with the agent* (they submitted
  an inquiry) — that's responsive messaging with consent, the good side of the line. Stay
  there: every conversation includes opt-out honoring ("STOP"), no cold-texting consumer
  lists, ever. Keep records of lead source per contact (the Airtable log does this).
  Quiet hours: don't message 9pm–8am local.
- **Your own outreach to agents:** B2B email must follow CAN-SPAM (real identity,
  working unsubscribe, no deceptive subject lines — the mystery-shop email is honest by
  design). Calling/texting agents' published business numbers about their business is
  normal B2B practice; still honor any opt-out instantly. Keep sends personal and
  low-volume from your main domain (<50/day); move to separate sending domains +
  proper tooling when volume grows.
- **Fair Housing (real-estate-specific):** the AI must never steer, filter, or comment
  on protected classes (race, religion, familial status, disability, etc.) — this is
  baked into the system prompt as hard rules and covered in client onboarding. This is
  also a *selling point* to brokers: "our scripts are Fair-Housing-reviewed."
- **Not brokering:** closemate schedules and qualifies; it never negotiates price,
  advises on offers, or shows property. That keeps you cleanly outside licensed real
  estate activity. Say this in the FAQ; brokers will ask.
- **AI disclosure:** several states require or are moving toward disclosure when a
  consumer is talking to AI. Default the product to disclose ("I'm [Agent]'s automated
  assistant") — it barely hurts conversion and removes a legal and reputational risk.

## Platform-dependence risks to watch (not fix — watch)

- Twilio policy changes / carrier fee hikes → margin hit, not death; alternatives exist
  (Telnyx, Sinch).
- Zillow/portal email-format changes break lead parsing → monitor with an alert; fix
  within hours (this is a support-quality differentiator, actually).
- Claude/OpenAI API pricing shifts → COGS moves a few dollars per client; irrelevant at
  85% margins.

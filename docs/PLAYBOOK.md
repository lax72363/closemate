# Closemate Go-To-Market Playbook

## Pricing

| Tier | Price | What they get | Why it exists |
|---|---|---|---|
| **Founding member** | $99/mo (first 20 customers, locked for life) | Full product + your personal onboarding | Gets the first yeses fast; scarcity is real and honest |
| **Solo** | $149/mo | 1 agent, 1 number, unlimited leads, follow-ups, dashboard | Core offer. Anchor against Structurely (~$499) and one Zillow lead (~$60–120) |
| **Pro** | $249/mo | + appointment booking link injection, custom AI persona, priority support | Natural upgrade once they trust it |
| **Team** | $499/mo | 5 agents, round-robin lead routing, team dashboard | The upmarket move once you have case studies |

Rules: **no free tier** (attracts tire-kickers, burns SMS costs), 14-day money-back guarantee instead (removes risk without removing commitment), annual = 2 months free (cash flow). Setup is free but positioned as "white-glove onboarding, normally $199" — a discount you can invoke in closing.

**Unit economics per customer:** Twilio number ~$1.15/mo + SMS ~$0.008/segment; Claude API on `claude-opus-4-8` costs roughly $0.01–0.03 per conversational turn. A busy agent (100 leads/mo, ~8 turns each) costs you ~$15–25/mo all-in → **85%+ gross margin at $149.** If margins ever matter more than reply quality, `MODEL=claude-haiku-4-5` drops AI cost ~5x — but don't lead with that; response quality is the product.

## The 72-hour first-customer plan

**Hour 0–12:** Deploy MVP (Railway/Render). Buy a Twilio number, start A2P 10DLC registration, parent-assisted Stripe account, create $99 Payment Link. Set up your own test agent and run 5 full conversations against it until the AI sounds right.

**Hour 12–24:** Record a 90-second demo: screen-record a fake Zillow lead coming in → AI texting back in 8 seconds → qualification convo → "🔥 HOT LEAD" text hitting the agent's phone. This video is your entire sales deck.

**Hour 24–72:** Founder-led sales, volume game:
- DM 50 agents/day on Instagram (every agent has a public IG). Script below.
- Call 20 agents/day — they answer unknown numbers, it's their job.
- Post the demo in 3–5 local realtor Facebook groups ("built this, looking for 5 agents to test at founding-member pricing").
- Offer: "I'll set it up for you on a screen-share in 15 minutes. If it doesn't get you more conversations in 14 days, full refund."

Close 1–3 of the first 200 touches and you have revenue inside 72 hours. Do not build features during this window.

## Cold outreach scripts

**Instagram DM (highest reply rate for agents):**
> Hey [Name] — quick question: when a Zillow/Facebook lead comes in while you're at a showing, how fast does someone text them back? I built a tool that replies in under 60 seconds, qualifies them (timeline, budget, pre-approval), and texts you only the hot ones. 20-sec demo: [link]. Want me to set it up on your leads this week? First 20 agents get it at $99/mo locked for life.

**Cold call opener:**
> "Hey [Name], I'll be quick — I'm not a lead vendor. You know how half of online leads go cold because nobody texts them back in the first five minutes? I built software that texts them back in sixty seconds and qualifies them for you. Can I text you a 90-second video of it working?"
(Goal of the call is only to get permission to text the demo. The demo closes.)

**Follow-up cadence:** Day 0 DM → Day 2 comment on their content + re-DM → Day 5 send a *personalized* proof clip ("ran a test lead in [their city]") → Day 10 breakup message ("closing founding pricing Friday"). Then stop.

## TikTok / Reels / Shorts (same content, 3 platforms)

Post 1–2/day. Formats that work:

1. **The race:** split screen — "I submitted a lead to 5 top [City] agents and my own AI. Here's who responded first." (AI: 41 seconds. Fastest human: 3 hours.) This is the hero format; make 20 variants.
2. **POV:** "POV: you paid $80 for a Zillow lead and texted them back 6 hours later" → tombstone emoji → "here's what should have happened" → screen recording.
3. **Live build/founder story:** "I'm 17 and I'm building software for realtors. Day 12: first paying customer." The age is an asset on TikTok — use it.
4. **Screenshot porn:** real (anonymized) conversation where the AI books a pre-approved buyer at 11pm. Caption: "my customer was asleep."
5. **Stat hooks:** "78% of buyers work with the first agent who responds. You're not losing leads. You're losing races."

CTA always: link in bio → demo video → Payment Link. Handle: @closemate or @speedtolead.

## SEO (compounding, start week 2, 2 posts/week)

Target long-tail buyer-intent queries agents actually search:
- "Structurely alternative for solo agents" / "Structurely pricing" (comparison pages convert best)
- "how fast should you respond to Zillow leads" (stat roundup — link magnet)
- "speed to lead real estate statistics"
- "AI ISA for real estate cost"
- "Zillow lead follow up scripts" (give away great scripts; the tool is the automated version)
- Programmatic: "[CRM/lead source] auto text back" pages — Zillow, Realtor.com, Facebook leads, KVCore, Follow Up Boss.

Every scripts/templates post ends with: "or let Closemate run these automatically."

## Viral loops & referrals

1. **Built-in exposure loop:** every AI conversation ends with the lead getting great service — and agents *talk*. Add a subtle "⚡ replies powered by Closemate" to the agent's dashboard share-view (never to leads' texts — that's the agent's brand).
2. **Referral program:** give a month, get a month — forever stacking. Agents in the same office copy each other's tools; one happy agent in a 40-agent Keller Williams office is a distribution channel.
3. **Office ambassador:** any agent who refers 3 colleagues gets Pro free. At 5+, pitch their broker on a Team plan (the referrer becomes your internal champion).
4. **Public leaderboard content:** monthly "fastest agents in [city]" posts using aggregate response-time data — agents share anything that flatters them.

## Upsells (in order of ease)

1. **Pro tier** ($249): custom persona + booking link injection ("want the AI to book directly into your Calendly?") — pitch at day 14 when they've seen hot leads.
2. **Slow-lead revival** (one-time $299): run the AI over their existing database of 500 cold leads. Pure margin, spectacular demos ("we woke up 14 conversations from leads you'd written off").
3. **Team plan** when they mention a partner/assistant.
4. Later: voice AI answering missed calls, listing-site chat widget, CRM sync (Follow Up Boss first — it's the solo-agent favorite).

## Retention

- **Weekly "wins" email/text (automated):** "This week Closemate replied to 23 leads in avg 38 seconds, qualified 6, handed you 3 hot ones." Agents churn when they forget the tool works. Never let them forget. This is the single highest-leverage retention feature — it's in the MVP backlog, build it week 2.
- **Hot-lead SMS to the agent** is itself retention — every 🔥 text is a dopamine hit attributable to you.
- **Onboarding call for everyone** (you, 15 min) until $10k/mo. Set persona, connect lead sources, send a test lead live on the call. Activated customers don't churn.
- **Churn save:** anyone who cancels gets "pause for $19/mo, keep your number and data" — most pauses reactivate at peak season.

## Analytics (instrument from day one)

Product events (already in the schema): leads received, first-response latency, reply rate, qualification rate, handoffs, per-agent weekly actives.
Business: MRR, trial→paid, churn, CAC by channel (ask every customer "where'd you find me" — write it down), demo→close rate.
North-star metric: **hot handoffs delivered per agent per week.** Everything that raises it lowers churn.

Tools: Stripe for revenue, a plausible-analytics script on the landing page, and a weekly 30-minute review of the numbers. No more than that until $10k/mo.

## Bottleneck forecast

- **Week 1:** your outreach volume. Fix: timeblock 3h/day of DMs/calls, nothing else.
- **Week 3–6:** onboarding time per customer. Fix: self-serve lead-source connection guides (Zapier templates), then group onboarding calls.
- **Month 2–3:** A2P throughput + deliverability at scale. Fix: proper campaign registration per use case, monitor filtering rates.
- **Month 3+:** churn. Fix: weekly wins report + booking-link upsell (booked appointments = sticky).

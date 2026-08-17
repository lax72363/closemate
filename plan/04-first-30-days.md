# 04 — First 30 Days, Day by Day

Rules of the month: **selling beats building** (the pipeline gets assembled once, for a
demo, then only touched to onboard payers). Total spend cap for the month: **$400.**
Daily workload target: 1.5–2.5 hrs school days, up to 4 hrs weekends. Every gate is
binary — hit it or execute the listed response, no vibes.

**Pre-day-1 (do this week):** read plan/05 with a parent/guardian; start Stripe
guardian setup and Twilio A2P 10DLC registration immediately — registration can take
days and nothing ships without it.

| Day | Objective | Exact task | Time | Output | Max spend | KPI | Kill/continue gate |
|---|---|---|---|---|---|---|---|
| 1 | Target list v1 | Pick metro. Pull 150 agents from Zillow/realtor.com profiles + state license lookup into Airtable (name, cell, email, brokerage, lead sources) | 2h | 150-row list | $30 (Outscraper) | 150 rows | — |
| 2 | Proof engine | Build mystery-shop tracker (columns: inquiry time, channel, response time, response quality). Write 3 inquiry templates | 1h | Tracker + templates | $0 | — | — |
| 3 | Mystery-shop wave 1 | Submit 25 buyer inquiries via agent sites/portals (use real name, real intent to evaluate their response — no fake transactions) | 1.5h | 25 timed tests running | $0 | 25 sent | — |
| 4 | Infrastructure | Domain + Carrd landing page + Stripe Payment Link ($147/mo, 14-day trial) + Cal.com | 2h | Live page + checkout | $35 | Page live | — |
| 5 | Mystery-shop wave 2 | 25 more inquiries; log wave-1 response times | 1.5h | 50 tests, data filling in | $0 | 50 total | — |
| 6 | Demo pipeline | Build closemate v0 for a fictional agent: Twilio → Make → Claude API → Cal.com. Script the qualification convo | 3h | Working demo number | $25 (Twilio+Make) | Demo books a test appt | — |
| 7 | Demo video + review | Screen-record a live demo convo (60s). Review week: response-time data should already show most agents >1h or silent | 1.5h | Video on landing page | $0 | — | If >80% of agents responded <5 min (they won't): metro anomaly, pick 2nd metro |
| 8 | Outreach templates | Write the 4-line proof email + SMS + IG DM variants with Claude; personalize fields from tracker | 1h | 3 templates | $0 | — | — |
| 9 | **First 20 proof emails** | Send to the 20 worst responders, each with THEIR OWN response time. Personal, no automation | 1.5h | 20 sent | $0 | Opens/replies | — |
| 10 | Outreach + shop wave 3 | 20 more proof emails; 25 more mystery shops | 2h | 40 sent, 75 shopped | $0 | ≥1 reply | — |
| 11 | Follow-up + calls | Bump non-repliers (1-line). Call the 5 warmest ("did you see my email about your 9-hour response time?") | 1h | 5 calls | $0 | Demos booked | — |
| 12 | Demos | Run booked demos (aim: first 1–2). Script in plan/03 | 1h | Demo(s) run | $0 | Close rate | — |
| 13 | Iterate | Rewrite templates based on what got replies; 20 more sends | 1.5h | 60 total sent | $0 | Reply rate ≥5% | If <2 replies after 60 sends: templates broken — rewrite hook, try SMS-first |
| 14 | **GATE: first closer** | Push every warm lead to a yes: founding $147, 14-day free, 30-day appointment guarantee | 1.5h | **Client #1 signed** (card on file, trial) | $0 | 1 signup | **If 0 demos booked from 60+ touches by day 14: 48h diagnosis — is it the list, the message, or the offer? Change ONE variable, run days 9–14 again once. Two full failed cycles = pivot to home services (plan/01)** |
| 15 | Deliver #1 | Onboard client #1 via Tally intake → configure their pipeline. Start 48h clock | 2.5h | Client live | $10 (their Twilio #) | Live in 48h | — |
| 16 | Outreach cont. | 20 sends + 15 shops (new names). Log everything | 1.5h | 80 total | $0 | — | — |
| 17 | Client #1 check | Verify first real leads answered <60s; send them their first digest manually | 1h | Happy client evidence | $0 | Response time <60s | Any bad AI reply → fix prompt same day |
| 18 | Demos | Run next demos; ask client #1 for a testimonial quote | 1.5h | +1–2 demos | $0 | — | — |
| 19 | Outreach | 20 sends; follow-up bumps | 1h | 100 total | $0 | — | — |
| 20 | Close #2–3 | Demos → founding offers | 1.5h | Client #2 (maybe #3) | $0 | 2–3 signed | — |
| 21 | Week-3 review | Numbers vs. plan: touches, reply %, demo %, close %. Update CAC math in plan/02 | 1h | Updated tracker | $0 | — | If close rate <20% on 5+ demos: offer/objection problem — add guarantee emphasis, raise trial to 21 days, re-test |
| 22 | Onboard #2–3 | Template-ize onboarding (checklist doc while doing it) | 2h | Clients live + SOP v1 | $20 | Onboard ≤2h each | — |
| 23 | Outreach | 25 sends (start testing IG DM channel) | 1h | 125 total | $0 | Channel compare | — |
| 24 | Referral seed | Ask clients 1–3: "one free month per referred agent" + send them shareable blurb | 0.5h | Referral loop live | $0 | — | — |
| 25 | Demos + close #4 | Keep the loop turning | 1.5h | Client #4 | $0 | — | — |
| 26 | Automation pass | Move digest sending + lead logging fully into Make (no manual steps); set up Looker Studio mini-dashboard | 2h | Zero-touch digests | $10 | Your hrs/client ↓ | — |
| 27 | Outreach | 25 sends; bump cycle | 1h | 150 total | $0 | — | — |
| 28 | Close #5 | Fifth founding client | 1.5h | **5 clients = $735 MRR** | $0 | 5 signed | If at 3–4: fine, extend 2 weeks. If ≤2 with weak pipeline: diagnosis cycle again |
| 29 | Trial→paid safeguard | Confirm cards charging as trials end (client #1 converts ~day 29). Send each client their week-1 ROI recap | 1h | First real revenue | $0 | 0 trial cancels | Any cancel → exit interview same day, log reason |
| 30 | **Month-1 board meeting** | Write investor-update-to-yourself: MRR, pipeline, CAC, churn, hours spent, next month's 3 priorities. Commit it to this repo | 1.5h | MONTHLY-01.md | $0 | — | Continue if: ≥3 paying/trialing clients, reply rate ≥5%, close rate ≥25%. Otherwise run the pivot review in plan/01 |

**Month-1 spend if everything is bought:** ~$130–160 of the $400 cap. The rest stays
banked for month 2 (more Twilio numbers, first paid-data experiments).

## The first $1,000

No "post content and wait." The machine, explicitly:

- **Who gets contacted:** the 60–70% of your 150 mystery-shopped agents whose measured
  response time was >1 hour or never — *agents you can prove are bleeding money they
  already spent* (they buy the leads they're ignoring).
- **Why they care:** the message contains their own failure with a timestamp, plus the
  industry math (5-minute responses ≈ 21x more likely to qualify; one lost deal =
  $8–10k commission). This isn't a pitch, it's a diagnosis with evidence.
- **The offer they receive:** founding rate $147/mo flat, set up for them in 48 hours,
  14 days free, cancel anytime, one-appointment-in-30-days guarantee.
- **What they pay:** $147/mo on Stripe subscription (card at signup, charged from day 15).
- **How fulfillment happens:** the Twilio+Make+Claude+Cal.com pipeline from plan/03 —
  ~2 hours of your configuration per client in month 1, falling to ~30 minutes with the
  SOP; after that the machine runs itself and you monitor digests.
- **The math to $1,000:** 150 prospects → ~100 provably-slow → ~8 demos (5–8% of
  contacted, evidence-based messages outperform cold) → 5 founding clients (≈40% close
  with the guarantee) → $735 MRR. Collected cash: $735 (month 1 charges, days 29–45)
  + the same again next cycle → **crosses $1,000 collected between day 40 and 50**, or
  faster if clients 6–7 land from referrals in month 2.
- **Profit remaining:** ~$120/mo total tool costs at 5 clients → ~$615/mo gross profit
  (~84%) — all reinvested per plan/02.
- **How it repeats:** the mystery-shop → proof → demo → 48h-setup loop is a conveyor
  belt. Month 2: same loop, next 150 agents, plus referrals now feeding it. Month 3:
  templatize each stage so a VA/AI can run list-building and first-touch, and your role
  shrinks to demos and closes. That loop, industrialized, is the whole Phase-2 growth
  engine in plan/02.

## Phase map (where the 30 days sit in the 5-year arc)

| Phase | Range | Goal | Exit test |
|---|---|---|---|
| 1 — Validation | $0 → $1k | Prove someone pays | 5 clients, <20% early cancel |
| 2 — PMF | → $10k/mo | Repeatable channel + fulfillment | 45 clients; a channel that produces 4+/mo without heroics; churn <5% |
| 3 — Systemization | → $25k/mo | Remove you from ops | 2-week founder vacation with zero revenue dip |
| 4 — Scale | → $100k/mo | Team + paid engine + SaaS | CAC <$500 at 3x current volume; ops manager runs weeks |
| 5 — $1M engine | $100k/mo+ | A company, not a job | Business valued 3–4× ARR; you at ≤8 hrs/wk |

# Client Onboarding SOP — target: live within 24h, ≤30 min of your time

Trigger: client pays the Stripe link.

## 1. Collect (send this message immediately after payment)

> Welcome aboard! To get you live I need 4 things:
> 1. Your name exactly as you want the assistant to say it
> 2. Brokerage name + market area (e.g. "Tampa Bay, FL")
> 3. Best email and/or cell for instant lead alerts
> 4. Website access: WordPress login, OR your web person's email, OR just tell
>    me the platform and I'll send them the one-line install snippet
> Optional: a Calendly/booking link — the assistant will offer it to hot leads.

## 2. Deploy (10 min)
- Create a new deployment per `docs/DEPLOY.md` (Render: duplicate an existing
  service, change env vars).
- Env vars: their `AGENT_*` values, fresh random `DASHBOARD_TOKEN`, your
  `ANTHROPIC_API_KEY`, `NOTIFY_WEBHOOK` pointing at a Zapier zap that emails
  them each lead.

## 3. Verify (5 min)
- Run the smoke test in DEPLOY.md (chat → fake lead → dashboard → alert email
  arrives at YOUR inbox first; then switch the zap to their email).

## 4. Install on their site (5–10 min)
- Add the script tag before `</body>`. WordPress: "Insert Headers and Footers"
  plugin. Wix: Settings → Custom Code. Squarespace: Settings → Advanced → Code
  Injection.
- Load their site, send one test message, confirm the lead appears.

## 5. Handoff (send this)

> You're live! 🎉
> - Chat is now running on [their-site.com] — try it yourself.
> - Your lead dashboard: [instance]/dashboard.html — token: [TOKEN]
> - You'll get an email the moment anyone leaves their contact info.
> Two tips: reply to hot leads within 5 minutes if you can (that's where the
> money is), and forward me any weird bot answer — I can tune it same-day.
> Billing: $99/mo starts today; cancel anytime by replying "cancel".

## 6. Day-7 check-in (calendar reminder)

> Hi [Name] — week one: [N] conversations, [M] leads captured ([hot count]
> hot). Anything you'd like the assistant to say differently?

(N/M come from the dashboard. This message is your retention engine — it makes
the value visible and surfaces tuning requests before frustration.)

## Tuning requests
Most tuning = editing env vars (market, calendar link) or one sentence in
`server/src/prompt.js`. Redeploy takes 2 minutes. Never promise custom
listing-database integration at $99/mo — that's a $499+ upsell later.

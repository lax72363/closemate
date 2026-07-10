# 🎯 The First-Customer Plan — 7 days, phone-only, from zero

**One honest expectation first:** in 7 days you will not have a *paying* customer — insurance
companies take 30–60 days to answer appeals, so nobody can pay you for recovered money that
fast. What these 7 days CAN produce: **real conversations with practice owners and your first
delivered audit** — which is the moment the first paying customer becomes inevitable.
Days are ~60–90 minutes each. If a day slips, shift everything back one day; never skip.

## GitHub in 90 seconds (read once)
- A **repository (repo)** is a folder of files that lives online. Ours is `closemate`.
- A **commit** is a saved snapshot. Every time you "save" a file on GitHub, that's a commit.
- A **branch** is a parallel version of the folder. We work on a branch called
  `claude/ai-business-opportunity-research-lwosr0`. **Always check the branch name** (dropdown
  at the top-left of the file list) — if it says `main`, switch to our branch or you'll see
  the old empty version.
- **Actions** are robots that run automatically when certain files change. We have two:
  the **Audit Bot** (upload a file to `inbox/` → report appears in `reports/`) and the
  **Lead Finder Bot** (edit `leads/request.txt` → practice list appears in `leads/`).
- To **edit a file on your phone:** open the file → tap the ✏️ pencil icon → make changes →
  tap "Commit changes" (green button) → confirm. That's it — the save IS the commit.
- To **upload a file:** open the folder → "Add file" → "Upload files."

---

## DAY 1 — The adult, the identity, the tour

### Goal
Secure your adult signer, claim your company's identity (domain + email), and learn your way
around the repo you already own.

### Why this matters
Every contract, bank account, and BAA needs an adult's signature until you're 18. This
conversation unblocks literally everything else. The domain/email is what makes your outreach
look like a company instead of a kid's Gmail.

### Checklist
1. **The conversation (45 min, most important thing this week).**
   - Open `BOOTSTRAP-PLAN.md` in the repo on your phone. Hand your parent/guardian the phone.
   - Say: "I'm building a company that recovers denied insurance money for therapy practices.
     I need you to be the legal signer on an LLC — it costs about $50–300 once. I do all the
     work; you hold the pen. This document explains everything, including why."
   - Ask for a 30-minute sit-down this week to file the LLC together (Day 2).
   - If they say no: your backup is any adult you deeply trust. Identify them today.
2. **Buy the domain (20 min).** Namecheap or Cloudflare app/site → search a name (short,
   trustworthy: e.g. `clearclaimhq.com` — avoid "AI" in the name; practices trust boring) →
   buy (~$12/yr). Turn OFF all upsells except WHOIS privacy (usually free).
3. **Email on the domain (15 min).** Easiest path: Google Workspace free trial →
   workspace.google.com → "Get started" → use your new domain → create
   `yourname@yourdomain.com`. (~$7–14/mo after trial. This later becomes your BAA'd email.)
4. **Repo tour (15 min).** On github.com, open the repo, switch to our branch, and open each
   of these so you know where they live: `HANDOFF.md` (the company on one page),
   `outreach/templates.md` (your scripts), `inbox/` (audit bot), `leads/request.txt`
   (lead bot), `reports/demo_counseling_group.pdf` (download it — this is what you sell).

### Claude Code task (learn the tool with zero risk)
> Read HANDOFF.md. Then give me a tour of this repository: explain what each folder is for
> in one sentence, and tell me the three files I'll use most this week as a non-technical
> founder working from a phone.

### What NOT to build
Nothing. Zero code today. A logo counts as building — skip it.

### Success = adult signer confirmed (or backup identified) + domain bought + email works
(send yourself a test email) + you can find the 5 key files without searching.

---

## DAY 2 — Learn the industry + file the LLC

### Goal
Speak healthcare billing well enough to survive a conversation with a practice owner, and
get the LLC filing submitted.

### Why this matters
You're 17 selling to 45-year-old practice owners. Your armor is competence: if you can say
"your CARC 197 denials from Optum are probably retro-authable" you sound like the expert
they need. Also: no LLC = no contracts = no customer.

### Checklist
1. **Read `NORTH-STAR.md` Parts 1–6 twice** (20 min). It's written in plain English.
2. **The 60-second test:** explain out loud, to a human or your mirror: what a claim is,
   what an 835 is, what an appeal is, and why practices don't fight denials. If you stumble,
   read again.
3. **Learn the 6 money codes** (in `data/carc_codes.json`, but here's the cheat sheet):
   197 = no authorization · 16 = missing info · B7 = provider not credentialed ·
   29 = filed too late · 50 = "not medically necessary" · 58 = wrong place-of-service code
   (telehealth). These 6 cover most behavioral-health denials.
4. **File the LLC with your adult (30 min).** Search "[your state] Secretary of State LLC
   filing" — use the official .gov site only. Name: anything professional (can differ from
   your brand). Registered agent: your parent + home address. They pay the fee, they're the
   organizer/member per the plan.
5. **Get the EIN** (free, 10 min, irs.gov → "Apply for an EIN online") right after the LLC
   confirmation arrives (may be instant or days, depending on state).

### Claude Code task
> Read NORTH-STAR.md. Quiz me one question at a time on healthcare billing basics — claims,
> 835s, denials, appeals, the 6 common CARC codes, and our business model. Get harder as I
> get answers right. Correct me in plain English when I'm wrong.

### What NOT to build
No website today. No dashboard, ever, this month.

### Success = passed your own 60-second test + LLC submitted (or scheduled with adult) +
you know the 6 codes cold.

---

## DAY 3 — Build the prospect list (the robot does the heavy lifting)

### Goal
100 raw leads pulled by the bot; 15 hand-qualified by you.

### Why this matters
Sales is a numbers game: ~100 contacted → ~10 conversations → 2–3 audits → 1 pilot. The
list is the fuel tank for the whole engine.

### Checklist
1. **Run the Lead Finder Bot (2 min).** Repo → `leads/request.txt` → ✏️ → delete the `#`
   on the example line and change it to your state, e.g. `GA,Atlanta,100` → "Commit changes."
2. **Wait ~1 minute.** Refresh the `leads/` folder → a new CSV appears (e.g.
   `ga_atlanta.csv`). Tap it to view. If nothing appears after 5 minutes: repo → "Actions"
   tab → tap the failed run → screenshot the red step → paste it to Claude Code and ask
   what went wrong.
3. **Qualify 15 (45 min, the human part).** For each org: Google its name → find website →
   check: 5–50 therapists on the team page? "We accept insurance / Aetna / BCBS…" anywhere?
   A real owner/director name? If yes to all three → copy the row into a Google Sheet
   called "Pipeline" with columns: practice, owner, email, phone, website, note, status.
   Finding the owner's email: check the site's contact/about page; guess
   `firstname@practicedomain.com` if needed.
4. **Write one personalization note per qualified lead** ("saw you just added 3 clinicians"
   / "you take Optum — that's the worst denier we see").

### Claude Code task
> I pasted 15 practice descriptions below from their websites. For each, write one
> natural-sounding personalized first line for a cold email about denied-claims recovery.
> No flattery, no buzzwords — sound like a person who actually read their site. [paste]

### What NOT to build
No CRM. No email tools. The Google Sheet IS the CRM until 50 leads.

### Success = CSV in `leads/` + 15 qualified rows in your Pipeline sheet with owner names.

---

## DAY 4 — First real outreach

### Goal
10 personalized emails sent from your company address.

### Why this matters
This is the day the company becomes real. Every day before this was preparation; today a
stranger reads your offer.

### Checklist
1. Open `outreach/templates.md` → copy **Email 1**.
2. For each of your 10 best-qualified leads: paste into Gmail → replace the first line with
   your personalization note → replace {{placeholders}} → read it OUT LOUD once (you'll
   catch every mistake) → send. One at a time. No BCC blasts — ever.
3. **Send between 8–10am or 1–3pm their time** (practice owners check email between sessions).
4. Log each send in the Pipeline sheet: status = "emailed", date.
5. Update `tracker/scorecard.csv` in the repo (✏️ → edit the row → commit): emails_sent = 10.
6. LinkedIn: create/polish your profile (real name, "Founder at [company] — we recover
   denied insurance revenue for behavioral health practices"). Send 5 connection requests
   to practice owners from your list. No message with the request.

### Claude Code task
> Here are the 10 emails I'm about to send [paste]. Red-team them: what sounds like a
> template? What would make a busy practice owner delete it? Don't rewrite them into
> corporate-speak — keep my voice, just fix the weak spots.

### What NOT to build
No email automation tools, no sequences, no tracking pixels. Ten hand-sent emails beat a
hundred automated ones at this stage — and you'll learn what works from replies.

### Success = 10 sent, 10 logged, scorecard updated. (Replies are a bonus, not the goal —
cold email reply rates are 5–15%, so expect silence today. That's normal, not failure.)

---

## DAY 5 — Rehearse the sale before it happens

### Goal
Be genuinely ready for the first "sure, tell me more" reply. 5 more emails sent.

### Why this matters
The first interested reply will come when you least expect it, and you get one shot. Founders
who wing the first call lose it. You're going to have already had the conversation 10 times —
with an AI playing a skeptical practice owner.

### Checklist
1. Send 5 more personalized emails (same ritual as Day 4). Running total: 15.
2. **Roleplay training (30 min, do this twice):** use the Claude Code prompt below. Take it
   seriously — answer out loud, not in your head.
3. Write your own **cheat sheet** (in your notes app) from what you learned: your 3-sentence
   pitch, answers to the top 5 objections (they're in `outreach/templates.md`), and the ONE
   goal of any first conversation: **get the de-identified export.** Not a contract. Not a
   pilot. Just the file.
4. Accept any LinkedIn connections; send the follow-up script from templates.md to anyone
   who accepted.

### Claude Code task
> Read NORTH-STAR.md and outreach/templates.md. Roleplay as "Dr. Reyes," the skeptical
> 48-year-old owner of a 12-therapist group practice who replied 'ok, what's the catch?'
> to my cold email. Stay in character, interrupt me, raise real objections (data privacy,
> "we have a biller," "how old are you?", "what's your fee?"). After 10 exchanges, break
> character and grade me: what I fumbled, what worked, what to say instead.

### What NOT to build
No pitch deck. No slides, ever, for this business — the audit report IS the deck.

### Success = 15 total sent + two full roleplays done + cheat sheet written.

---

## DAY 6 — Master your own machine

### Goal
Run the entire audit pipeline yourself, end to end, without me — so when a real file
arrives you deliver in hours, not days.

### Why this matters
Speed is your only structural advantage over every competitor this month. "Report back
same day" makes a 17-year-old solo founder feel like a machine-powered team — because it is.

### Checklist (the full dry run, ~30 min)
1. Repo → `samples/sample_denials_export.csv` → tap "Raw" → long-press → download/save the file.
2. Rename it on your phone to `dry_run_practice.csv`.
3. Repo → `inbox/` → Add file → Upload files → upload it → Commit.
4. Wait ~1 min → `reports/` → open `dry_run_practice.md` (read it), download
   `dry_run_practice.pdf`.
5. Draft (don't send) the delivery email: "Attached is your denial audit. Headline: ~$X
   looks recoverable, and Y% comes from one fixable cause. 15 minutes to walk through it?"
6. Send 5 more emails to new leads (total: 20). Bump Day-4 non-responders with Email 2
   from templates.
7. **Warm-intro texts:** message 5 adults you know: "Random question — do you know anyone
   who runs a therapy or counseling group practice? My company finds money practices lost
   on denied insurance claims, free audit. Would love an intro."

### Claude Code task
> I just ran the demo audit end to end. Explain reports/dry_run_practice.md to me line by
> line like I'm going to present it to a practice owner tomorrow: what each number means,
> which claims to talk about first, and what questions the owner will probably ask.

### What NOT to build
Don't touch the report design "to make it prettier." It's already good. Prettier ≠ more sold.

### Success = you did the upload→report→delivery-draft loop alone, in under 30 minutes +
20 total emails out + 5 warm-intro texts sent.

---

## DAY 7 — Count, learn, reload

### Goal
Honest scoreboard, lessons extracted, week 2 loaded.

### Why this matters
Startups die from vibes-based decision making. You'll run this business on 8 numbers, and
today you learn the Sunday ritual you'll repeat every week until (and after) the first
customer.

### Checklist
1. Update `tracker/scorecard.csv` for real: emails sent, replies, audits delivered, pilots.
2. **The three questions (write answers in your notes app):**
   - Which email got any response, and what was different about it?
   - What's the #1 thing blocking an audit delivery right now? (No replies? → volume/warm
     intros. Replies but no files? → friction in the export ask. No adult signer yet? → THE
     priority.)
   - What am I avoiding because it's uncomfortable? (Do that first Monday.)
3. Chase every open loop: LLC status, unanswered warm-intro texts, LinkedIn accepts.
4. Load week 2: 15 new leads qualified into the Pipeline sheet, bumps scheduled.
5. Read `PHONE-PLAYBOOK.md` week-2 section — it's your next 7 days.

### Claude Code task
> Here are my week-1 numbers and notes [paste scorecard + your three answers]. Act as my
> mentor: what's the single highest-leverage change for week 2? Be blunt. Don't suggest
> building anything unless it directly unblocks an audit delivery.

### What NOT to build
Anything. If week 1 produced zero replies, the temptation will be "maybe I need a better
website/deck/product." No — you need more sends, better personalization, and warm intros.
The product already works; you watched it work on Day 6.

### Success = scorecard current + three questions answered honestly + 15 fresh leads ready
+ you know Monday's first action before you go to sleep.

---

## The mentor rules (read when tempted)
1. **"Can this be done manually for the first customer?"** If yes, do it manually. You earn
   automation with volume you don't have yet.
2. Building feels like progress and costs no courage. Sending feels like risk and costs no
   money. The company grows on courage, not code.
3. Silence after 20 emails is data, not defeat. The fix is 50 more emails and 5 warm intros,
   never a redesign.
4. The moment a real de-identified file arrives, EVERYTHING else stops. Same-day report.
   That practice is 10× more valuable than any task on any list.
5. First paying customer arrives ~week 4–8 (appeals take 30–60 days to pay out). The week-1
   scoreboard is conversations, not dollars. Judge yourself on sends and audits delivered.

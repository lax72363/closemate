# North Star — the business explained from zero, then redesigned for simplicity

*Plain-English rebuild, July 2026. If this document and the code ever disagree, this document wins.*

---

## Part 1 — How a therapy practice actually gets paid (from zero)

**The visit.** A patient books a session with a therapist. Before the visit, someone at the
front desk is *supposed* to check "does this person's insurance actually cover this?" —
often they don't, or the answer they get is wrong.

**The translation.** The session happens. Now the practice has to translate "Sarah had a
53-minute therapy session for anxiety" into codes, because insurance companies only speak
code. The service becomes a **CPT code** (90837 = long therapy session). The reason becomes
a **diagnosis code**. Get either slightly wrong and the bill will bounce.

**The bill.** The practice sends the insurance company a **claim** — basically a form with
~30 boxes. It travels through a middleman called a **clearinghouse** (think: a post office
that only delivers insurance paperwork).

**The verdict.** Weeks later the insurance company's computer answers with a receipt.
Humans call it an **EOB**; computers call it an **835 file**. It says: "We paid this one.
We paid this one less than you charged. We rejected this one, and here's a code telling
you why." Those rejection codes are called **CARC codes** — there are hundreds, like
"197 = you didn't get permission first" or "16 = you left a box blank."

**The fight (that never happens).** A rejected claim isn't dead — the practice has the
right to argue back. That's an **appeal**: fix the mistake or send a letter with evidence,
within a deadline (60–180 days depending on the insurer). Miss the deadline and the money
is gone forever.

## Part 2 — Exactly where money gets lost

1. **Bills sent with small mistakes** → rejected → and here's the killer: **most rejected
   claims are never fixed.** Industry-wide, 15–20% of claims bounce and ~60% of the bounced
   ones are never touched again.
2. **Deadlines silently expire.** Every unworked rejection has a countdown timer nobody is watching.
3. **The insurer pays less than the contract says** and nobody checks the math.
4. **Root causes repeat.** The same broken thing (a new therapist not registered with Aetna
   yet) rejects every claim for months — a $6,000 problem disguised as forty $150 problems.

**Why nobody fixes it:** fighting a $150 rejection takes a person ~30–60 minutes across
weeks (research, letter, fax, follow-up). That's $30–40 of staff time for a coin-flip on
$150. So rational practices shrug and write it off. It's a vending machine that eats your
dollar 1 time in 6 — annoying per dollar, devastating per year. A 10-therapist practice
loses **$30,000–$100,000 a year** in shrugs.

## Part 3 — Exactly where we enter

After the verdicts come back. We never touch the patient visit, the notes, the scheduling,
or the original bill (at first). We take the pile of receipts — the 835s — and rescue the
money that already got rejected or shorted. Later, once trusted, we move upstream and
take over the billing itself so less gets rejected in the first place.

## Part 4 — Exactly what the AI does

Reads every receipt line in seconds · recognizes why each claim bounced · checks each
insurer's deadline clock · calculates which claims are worth fighting (amount × odds of
winning) · groups claims that share one root cause into one fix · writes the fix or the
appeal letter with the right evidence attached · watches future receipts to confirm the
money actually landed · **learns which arguments beat which insurer** — the notebook that
gets smarter with every claim is the thing competitors can't copy.

## Part 5 — Exactly what humans still do

1. **Press "approve" on every letter before it's sent** (accuracy, trust, and our liability shield)
2. **Submit** — insurers still take appeals by web portal and fax; there is no universal API.
   Annoying = moat: software-only competitors won't do this part.
3. **Talk to the practice** and handle the 10% of weird cases
4. **Fix root causes** ("your new hire isn't registered with Aetna — here's how")

Over time the human share shrinks: once a category (e.g., "blank box, refile") proves a
95%+ win rate over hundreds of claims, it graduates to auto-send. 95% automation is
**earned with data, not built on day one.**

## Part 6 — Why they pay us instead of doing it themselves

Their cost to fight a $150 claim: $30–40 of staff time, ~50% odds. Ours: ~$3 of compute
plus seconds of review. **We didn't invent the work — we broke its unit economics.**
And the offer removes all risk: we only get paid a cut of money that verifiably lands in
*their* bank account, proven by *their own* receipts. Saying no to a free audit requires
believing you have zero rejected claims. Nobody believes that.

---

## Part 7 — The redesign: complex backend, dead-simple frontend

**Design target:** checking us should feel like checking your bank account — a number that
only goes up — never like using medical billing software.

### The three redesign breakthroughs

**1. The product is a number, not a dashboard.** The magical experience for customer #1 is
a Friday email: *"ClearClaim recovered **$1,850** for you this week. 12 more claims in
progress worth ~$2,100."* That email is the entire product surface for months. Dashboards
are how the email earns a login page later.

**2. Onboarding = one login, not an integration.** Old plan: practices export CSVs forever
(friction every month). New plan: practices' claims already flow through a handful of
clearinghouses (Availity, Office Ally, Claim.MD...). Onboarding becomes: *sign the
agreement, add us as an authorized user on your clearinghouse account, done — 15 minutes.*
We pull history AND ongoing receipts automatically. No IT project, no per-EHR integration,
and the monthly-export churn risk disappears. (Phase 1 still accepts file upload — works
everywhere on day one.)

**3. The practice makes one decision, once.** They approve the engagement and fee. After
that their only recurring interaction is optional: a "🟢 Go get it" button when we find new
money. Every internal step — classify, draft, review, submit, track, reconcile, invoice —
is our problem, invisible to them.

### The dream dashboard (Phase 2, one screen, six numbers)
Recovered this month · In progress (with $ value) · Found this week (new recoverable) ·
Needs your OK (usually zero) · This year total · A 12-week trend line. Below: a plain-
English activity feed ("Won appeal vs Aetna — $165 · Tue"). **No claim tables, no code
jargon, no filters.** If a screen needs a tutorial, it's wrong.

### Wow moments to engineer deliberately
- **The First Number:** within 24h of signup — "We found $23,400 you didn't know you lost."
- **The first win email** with the payer's own receipt attached as proof.
- **The invisible month:** money arrives; they did nothing.
- The "I can't imagine running without this" moment = the third consecutive month the
  number went up while they did zero work.

### Never build (and why)
Patient-facing anything (wrong user) · scheduling/notes/EHR features (competing with their
existing tools = death) · chat-with-AI interface (novelty, no money) · custom report
builder (enterprise cosplay) · native mobile app (responsive web) · public API (nobody
asked) · coding-advice tools (liability without revenue).

---

## Part 8 — The simplest roadmap

### Phase 1 — first paying customer (now → ~month 3) — "The Money Email"
| Piece | Why it exists | Makes money? | Retention? | Verdict |
|---|---|---|---|---|
| Audit engine (835/CSV → findings) | Creates the First Number that opens every door | Indirectly — it's the funnel | — | ✅ built |
| Appeal drafting + human review | The actual recovery work | **Yes — directly** | — | ✅ built |
| Reconciliation vs new 835s | Proves the invoice; trust machine | **Yes — collects the money** | Yes | ✅ built |
| Weekly money email (manual at first) | The entire product experience | No | **Massively** | build (it's an email template) |
| Contingency agreement + BAA | Makes it legal | Enables all of it | — | law-clinic review |
| Dashboard | — | No | Not yet | ❌ **not in Phase 1** |

### Phase 2 — after 3–5 paying practices — "The Bank Account"
| Piece | Why | Money? | Retention? |
|---|---|---|---|
| One-screen dashboard (6 numbers + feed) | Login-able proof of value; sales demo | Indirect | High |
| Clearinghouse-credential auto-pull | Kills monthly upload friction + churn | Indirect | **Highest** |
| Auto-send for proven categories | Margin: human minutes → seconds | **Yes (cost side)** | — |
| Root-cause reports ("fix your Aetna enrollment") | Trojan horse for full-billing upsell | **Yes — conversion** | High |

### Phase 3 — scale — "Prevention"
| Piece | Why | Money? |
|---|---|---|
| Claim scrubbing BEFORE submission (prevent denials) | The full-billing (4–5% of collections) product | **The real business** |
| Second specialty (PT, chiro) with same engine | TAM expansion | Yes |
| Payer-behavior benchmarks from our data | Moat monetization; pricing power | Yes |

**Rule that keeps us honest:** every feature must either (a) directly recover money,
(b) directly convert wedge→full billing, or (c) measurably reduce churn. Anything else is
procrastination with a UI.

---

## Part 9 — Challenging the whole business (no feelings protected)

**Alternative A — sell software instead of results (pure SaaS).** Simpler product, no ops.
Rejected: the practice's problem isn't *seeing* lost money, it's that nobody has time to
get it. A dashboard of unrecovered denials is a sadness dashboard. They'd churn in months.

**Alternative B — skip the wedge, sell full billing day one.** Bigger checks immediately.
Rejected as the entry: asking a practice to fire their biller and hand everything to an
unknown company is a 6-month trust sale. The wedge manufactures that trust in 30 days with
zero risk. Full billing stays the destination, not the door.

**Alternative C — the genuinely tempting one: sell to billing companies, not practices.**
Thousands of small human billing companies already have the clients, BAAs, and portal
access — and they skip low-dollar denials for the same cost reasons. White-label our engine
to them: one customer = 20–50 practices' claim flow, no consumer onboarding, faster MRR.
**Why it's still not the answer:** it caps us at tool-vendor economics (they keep the
relationship and the margin), arms the incumbents we ultimately want to replace, and their
willingness to pay is notoriously low. **Verdict: it's a channel, not the company.** If
direct sales stall for 90 days, activate it as plan B — and V3 sells the workbench to
in-house billers anyway, from a position of strength.

**Final answer:** the model survives its own teardown — AI-powered recovery on contingency,
converting to full billing — but the *product* changes shape: the Money Email is the
product, the clearinghouse login is the onboarding, the dashboard is Phase 2, and
automation percentages are earned per-category with win-rate data. One input (their claim
receipts). One output (money in their account). One metric (verified recovered dollars).
Everything else is backend.

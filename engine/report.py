"""Generate the customer-facing Denial Audit Report (HTML, print-to-PDF ready).

Usage:
    python3 engine/parse_835.py samples/sample_835.txt | python3 engine/triage.py \
        | python3 engine/report.py --practice "Acme Counseling Group" -o reports/acme.html
"""
import argparse
import html
import json
import sys
from datetime import date


def money(x):
    return f"${x:,.2f}"


def build_report(data, practice):
    claims = data["claims"]
    batches = data["batches"]
    workable = [c for c in claims if c["appealable"] != "no"]
    expired = [c for c in claims if c["urgency"] == "EXPIRED"]
    denied_total = sum(c["denied_amount"] for c in claims)
    workable_total = sum(c["denied_amount"] for c in workable)
    expected = sum(c["expected_value"] for c in workable)
    critical = [c for c in workable if c["urgency"] in ("CRITICAL", "HIGH")]

    top_claims = workable[:15]
    e = html.escape

    batch_rows = "".join(
        f"<tr><td>{e(b['payer'])}</td><td><b>CARC {e(b['carc'])}</b><br>"
        f"<span class='dim'>{e(b['carc_desc'])}</span></td>"
        f"<td class='num'>{b['claims']}</td><td class='num'>{money(b['denied_total'])}</td>"
        f"<td class='num'><b>{money(b['expected_value'])}</b></td>"
        f"<td class='num'>{b['most_urgent_days_left'] if b['most_urgent_days_left'] is not None else '—'}</td>"
        f"<td>{e(b['recommended_fix'])}</td></tr>"
        for b in batches[:8]
    )

    claim_rows = "".join(
        f"<tr><td>{e(c['claim_id'])}</td><td>{e(c['payer'])}</td>"
        f"<td>{e(c.get('cpt','') or '—')}</td><td>{e(c.get('service_date','') or '—')}</td>"
        f"<td><b>{e(c['carc'])}</b> <span class='dim'>{e(c['category'])}</span></td>"
        f"<td class='num'>{money(c['denied_amount'])}</td>"
        f"<td class='num'>{money(c['expected_value'])}</td>"
        f"<td class='{'urgent' if c['urgency'] in ('CRITICAL','HIGH') else ''}'>"
        f"{c['days_left_to_appeal'] if c['days_left_to_appeal'] is not None else '?'} days</td></tr>"
        for c in top_claims
    )

    return f"""<!doctype html><html><head><meta charset="utf-8">
<title>Denial Audit — {e(practice)}</title>
<style>
 body {{ font-family: Georgia, 'Times New Roman', serif; color: #1a2332; max-width: 900px;
        margin: 40px auto; padding: 0 24px; line-height: 1.5; }}
 h1 {{ font-size: 26px; margin-bottom: 4px; }}
 h2 {{ font-size: 18px; margin-top: 36px; border-bottom: 2px solid #1a2332; padding-bottom: 6px; }}
 .sub {{ color: #5a6572; margin-top: 0; }}
 .headline {{ background: #f4f6f8; border-left: 5px solid #2456a6; padding: 18px 22px; margin: 28px 0;
             font-size: 17px; }}
 .headline b {{ font-size: 24px; color: #2456a6; }}
 table {{ border-collapse: collapse; width: 100%; font-size: 13px; font-family: Helvetica, Arial, sans-serif; }}
 th, td {{ text-align: left; padding: 7px 9px; border-bottom: 1px solid #dde3ea; vertical-align: top; }}
 th {{ background: #1a2332; color: #fff; font-weight: 600; }}
 .num {{ text-align: right; white-space: nowrap; }}
 .dim {{ color: #6a7683; font-size: 12px; }}
 .urgent {{ color: #b02a1e; font-weight: 700; }}
 .foot {{ margin-top: 44px; font-size: 12px; color: #6a7683; border-top: 1px solid #dde3ea; padding-top: 12px; }}
 @media print {{ body {{ margin: 12px auto; }} }}
</style></head><body>
<h1>Denial Audit Report</h1>
<p class="sub">Prepared for <b>{e(practice)}</b> · {date.today().strftime('%B %d, %Y')} · Confidential</p>

<div class="headline">
 Our analysis of your remittance data found <b>{money(workable_total)}</b> in denied claims that are
 still appealable, with an estimated <b>{money(expected)}</b> realistically recoverable.<br>
 <span class="dim">{len(workable)} workable denials · {len(critical)} must be appealed within 30 days
 · {len(expired)} past their appeal deadline (excluded from estimates)</span>
</div>

<h2>Where the money is: root causes to attack first</h2>
<p>One fix often unlocks an entire group of claims. Ranked by expected recovery:</p>
<table><tr><th>Payer</th><th>Denial reason</th><th class="num">Claims</th><th class="num">Denied $</th>
<th class="num">Expected recovery</th><th class="num">Days left</th><th>What gets it paid</th></tr>
{batch_rows}</table>

<h2>Attack-first claim list (top {len(top_claims)})</h2>
<table><tr><th>Claim</th><th>Payer</th><th>CPT</th><th>DOS</th><th>Denial</th>
<th class="num">Denied $</th><th class="num">Expected $</th><th>Appeal deadline</th></tr>
{claim_rows}</table>

<h2>What happens next</h2>
<p>If you'd like these worked: we prepare and submit the appeals (a person reviews every one before it
goes out), you approve the claim list up front, and <b>all payer payments continue to flow directly to
your accounts — we never touch your money</b>. Our fee applies only to claims on the approved list that
actually get paid, verified against your own remittance files. Nothing recovered, nothing owed.</p>

<p class="foot">Estimates are based on denial codes, payer appeal windows, and typical overturn rates for
each denial category; actual results depend on documentation and payer review. This report is not legal
or billing advice. Recovery estimates exclude patient-responsibility amounts and expired claims.
Total denied in file reviewed: {money(denied_total)} across {len(claims)} claims.</p>
</body></html>"""


def build_markdown(data, practice):
    """Phone-friendly version - renders directly in the GitHub app/browser."""
    claims = data["claims"]
    batches = data["batches"]
    workable = [c for c in claims if c["appealable"] != "no"]
    expired = [c for c in claims if c["urgency"] == "EXPIRED"]
    workable_total = sum(c["denied_amount"] for c in workable)
    expected = sum(c["expected_value"] for c in workable)
    critical = [c for c in workable if c["urgency"] in ("CRITICAL", "HIGH")]

    lines = [
        f"# Denial Audit — {practice}",
        f"*{date.today().strftime('%B %d, %Y')} · Confidential*",
        "",
        f"## 💰 {money(workable_total)} in appealable denials — est. {money(expected)} recoverable",
        f"- {len(workable)} workable denials · **{len(critical)} must be appealed within 30 days**"
        f" · {len(expired)} expired (excluded)",
        "",
        "## Root causes to attack first",
        "| Payer | Denial | Claims | Denied $ | Expected $ | Days left | Fix |",
        "|---|---|---|---|---|---|---|",
    ]
    for b in batches[:8]:
        dl = b["most_urgent_days_left"]
        lines.append(
            f"| {b['payer']} | CARC {b['carc']} — {b['carc_desc'][:60]} | {b['claims']} "
            f"| {money(b['denied_total'])} | **{money(b['expected_value'])}** "
            f"| {dl if dl is not None else '—'} | {b['recommended_fix'][:90]} |")
    lines += [
        "",
        "## Attack-first claims",
        "| Claim | Payer | CARC | Denied $ | Expected $ | Deadline |",
        "|---|---|---|---|---|---|",
    ]
    for c in workable[:15]:
        dl = c["days_left_to_appeal"]
        urgent = " ⚠️" if c["urgency"] in ("CRITICAL", "HIGH") else ""
        lines.append(
            f"| {c['claim_id']} | {c['payer']} | {c['carc']} | {money(c['denied_amount'])} "
            f"| {money(c['expected_value'])} | {dl if dl is not None else '?'}d{urgent} |")
    lines += [
        "",
        "---",
        "*Fee applies only to approved-inventory claims verified as paid in your own remittance "
        "files. All payer payments flow directly to your accounts. Estimates are estimates.*",
    ]
    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--practice", default="Your Practice")
    ap.add_argument("-o", "--out", default=None)
    ap.add_argument("input", nargs="?", default=None)
    args = ap.parse_args()

    raw = open(args.input).read() if args.input else sys.stdin.read()
    report = build_report(json.loads(raw), args.practice)
    if args.out:
        with open(args.out, "w") as f:
            f.write(report)
        print(f"wrote {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(report)

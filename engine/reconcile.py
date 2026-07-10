"""Reconcile worked claims against new remittance files -> verified recoveries + invoice draft.

This is how we prove our fee: the practice's own 835s show the payer paid claims on our
signed inventory. We never guess and never rely on anyone's word - including our own.

Usage:
    # inventory = the claims we worked (CSV with at least claim_id; optional fee_pct per row)
    python3 engine/reconcile.py --inventory tracker/worked_claims.csv --fee 0.20 \
        --practice "Acme Counseling Group" new_835_july.txt more_remits.csv \
        -o reports/acme_recovery_july.html

Inventory CSV columns (flexible): claim_id[, payer, denied_amount, date_appealed, fee_pct]
"""
import argparse
import csv
import sys
from datetime import date

from parse_835 import parse_file, _clean


def load_inventory(path):
    inv = {}
    with open(path, newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            row = {k.strip().lower().replace(" ", "_"): _clean(v) for k, v in row.items() if k}
            cid = row.get("claim_id") or row.get("claim") or row.get("claim_#")
            if cid:
                inv[cid.upper()] = row
    return inv


def reconcile(inventory, remit_files, default_fee):
    matches = []
    for path in remit_files:
        for c in parse_file(path):
            cid = (c.get("claim_id") or "").upper()
            if cid in inventory and c.get("paid", 0) > 0 and not c.get("reversal"):
                fee_pct = float(inventory[cid].get("fee_pct") or default_fee)
                matches.append({
                    "claim_id": c["claim_id"],
                    "payer": c.get("payer", ""),
                    "payer_claim_number": c.get("payer_claim_number", ""),
                    "service_date": c.get("service_date", ""),
                    "remit_date": c.get("denial_date", ""),  # check date on the paying 835
                    "paid": round(c["paid"], 2),
                    "fee_pct": fee_pct,
                    "fee": round(c["paid"] * fee_pct, 2),
                    "source_file": path,
                })
    return matches


def invoice_html(matches, practice, invoice_no):
    total_paid = sum(m["paid"] for m in matches)
    total_fee = sum(m["fee"] for m in matches)
    rows = "".join(
        f"<tr><td>{m['claim_id']}</td><td>{m['payer']}</td><td>{m['payer_claim_number']}</td>"
        f"<td>{m['service_date']}</td><td>{m['remit_date']}</td>"
        f"<td class='num'>${m['paid']:,.2f}</td><td class='num'>{m['fee_pct']:.0%}</td>"
        f"<td class='num'>${m['fee']:,.2f}</td></tr>"
        for m in matches
    )
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>Recovery Invoice {invoice_no}</title>
<style>body{{font-family:Helvetica,Arial,sans-serif;max-width:860px;margin:40px auto;color:#1a2332;padding:0 24px}}
h1{{font-size:22px}} table{{border-collapse:collapse;width:100%;font-size:13px;margin-top:16px}}
th,td{{text-align:left;padding:7px 9px;border-bottom:1px solid #dde3ea}}
th{{background:#1a2332;color:#fff}} .num{{text-align:right;white-space:nowrap}}
.total{{font-size:16px;font-weight:700;background:#f4f6f8}}
.note{{font-size:12px;color:#6a7683;margin-top:24px}}</style></head><body>
<h1>Recovery Statement &amp; Invoice — {invoice_no}</h1>
<p><b>{practice}</b> · {date.today().strftime('%B %d, %Y')}</p>
<p>The following claims from the approved work inventory were verified as <b>paid by your payers</b>,
per your own remittance (835/EOB) records:</p>
<table><tr><th>Claim</th><th>Payer</th><th>Payer claim #</th><th>DOS</th><th>Remit date</th>
<th class="num">Paid to you</th><th class="num">Fee %</th><th class="num">Fee</th></tr>
{rows}
<tr class="total"><td colspan="5">TOTAL</td><td class="num">${total_paid:,.2f}</td><td></td>
<td class="num">${total_fee:,.2f}</td></tr></table>
<p class="note">All payer payments were made directly to the practice's accounts; this invoice bills
the agreed fee on verified recoveries only. Evidence: source remittance files listed per claim,
available on request. Payment terms: Net 15.</p>
</body></html>"""


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--inventory", required=True)
    ap.add_argument("--fee", type=float, default=0.20)
    ap.add_argument("--practice", required=True)
    ap.add_argument("--invoice-no", default=date.today().strftime("INV-%Y%m%d"))
    ap.add_argument("-o", "--out", required=True)
    ap.add_argument("remits", nargs="+")
    args = ap.parse_args()

    inv = load_inventory(args.inventory)
    matches = reconcile(inv, args.remits, args.fee)
    with open(args.out, "w") as f:
        f.write(invoice_html(matches, args.practice, args.invoice_no))

    total_paid = sum(m["paid"] for m in matches)
    total_fee = sum(m["fee"] for m in matches)
    unmatched = len(inv) - len({m["claim_id"].upper() for m in matches})
    print(
        f"RECONCILED -> {args.out}\n"
        f"  inventory claims  : {len(inv)}\n"
        f"  verified recovered: {len(matches)} claims / ${total_paid:,.2f}\n"
        f"  our fee           : ${total_fee:,.2f}\n"
        f"  still unpaid      : {unmatched} (keep watching future remits)",
        file=sys.stderr,
    )

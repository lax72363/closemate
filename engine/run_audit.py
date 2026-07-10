"""One-command Denial Audit: files in, HTML report out.

Usage:
    python3 engine/run_audit.py --practice "Acme Counseling Group" \
        samples/sample_835_optum.txt samples/sample_denials_export.csv \
        -o reports/acme_audit.html
Accepts any mix of X12 835 files and CSV exports.
"""
import argparse
import json
import sys

from parse_835 import parse_file
from triage import triage, batches
from report import build_report, build_markdown

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--practice", required=True)
    ap.add_argument("-o", "--out", required=True)
    ap.add_argument("--json-out", default=None, help="also dump triaged claims JSON (working file)")
    ap.add_argument("--md-out", default=None, help="also write a markdown report (renders on GitHub mobile)")
    ap.add_argument("files", nargs="+")
    args = ap.parse_args()

    claims = []
    for path in args.files:
        parsed = parse_file(path)
        print(f"  {path}: {len(parsed)} claims", file=sys.stderr)
        claims.extend(parsed)

    t = triage(claims)
    data = {"claims": t, "batches": batches(t)}

    if args.json_out:
        with open(args.json_out, "w") as f:
            json.dump(data, f, indent=2)

    with open(args.out, "w") as f:
        f.write(build_report(data, args.practice))

    if args.md_out:
        with open(args.md_out, "w") as f:
            f.write(build_markdown(data, args.practice))

    workable = [c for c in t if c["appealable"] != "no"]
    print(
        f"\nAUDIT COMPLETE -> {args.out}\n"
        f"  denials analyzed : {len(t)}\n"
        f"  workable         : {len(workable)}  (${sum(c['denied_amount'] for c in workable):,.2f} denied)\n"
        f"  expected recovery: ${sum(c['expected_value'] for c in workable):,.2f}\n"
        f"  urgent (<30 days): {sum(1 for c in workable if c['urgency'] in ('CRITICAL','HIGH'))}",
        file=sys.stderr,
    )

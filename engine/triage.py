"""Triage parsed claims: classify denials, check appeal deadlines, rank by expected value.

Usage:
    python3 engine/parse_835.py samples/sample_835.txt | python3 engine/triage.py
    python3 engine/triage.py claims.json                 # or from a file
Outputs triaged claims JSON (pipe into report.py).
"""
import json
import os
import sys
from datetime import date, datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def load_json(name):
    with open(os.path.join(DATA_DIR, name)) as f:
        return json.load(f)


def appeal_window(payer, deadlines):
    p = (payer or "").upper()
    for key, info in deadlines["payers"].items():
        if key in p:
            return info["appeal_days"], key
    return deadlines["default_commercial"], "default (commercial 180d - VERIFY)"


def triage(claims, today=None):
    carc = load_json("carc_codes.json")
    deadlines = load_json("payer_deadlines.json")
    today = today or date.today()

    out = []
    for c in claims:
        if not c.get("denied") and c.get("paid", 0) > 0:
            # Paid claims: keep only as underpayment-audit candidates (CARC 45 present)
            if not any(a["code"] == "45" for a in c.get("adjustments", [])):
                continue

        # Primary denial reason = largest non-patient-responsibility adjustment
        adjs = [a for a in c.get("adjustments", []) if a.get("group") != "PR"]
        if not adjs:
            continue
        primary = max(adjs, key=lambda a: a.get("amount", 0))
        code = str(primary["code"]).upper()
        info = carc.get(code, {
            "desc": f"CARC {code} (not in knowledge base yet - look it up and add to data/carc_codes.json)",
            "category": "unknown", "appealable": "maybe", "win_prob": 0.3,
            "fix": "Research this code.", "batch": False,
        })

        denied_amount = sum(a["amount"] for a in adjs)
        window_days, window_src = appeal_window(c.get("payer"), deadlines)

        days_left = None
        denial_date = c.get("denial_date") or ""
        try:
            dd = datetime.strptime(denial_date, "%Y-%m-%d").date()
            days_left = window_days - (today - dd).days
        except ValueError:
            pass

        expired = days_left is not None and days_left <= 0
        win_prob = 0.0 if expired else info["win_prob"]
        expected_value = round(denied_amount * win_prob, 2)

        urgency = "EXPIRED" if expired else (
            "CRITICAL" if days_left is not None and days_left <= 14 else
            "HIGH" if days_left is not None and days_left <= 30 else "NORMAL"
        )

        out.append({
            **c,
            "carc": code,
            "carc_desc": info["desc"],
            "category": info["category"],
            "appealable": "no" if expired else info["appealable"],
            "win_prob": win_prob,
            "recommended_fix": info["fix"],
            "batchable": info.get("batch", False),
            "denied_amount": round(denied_amount, 2),
            "appeal_window_days": window_days,
            "appeal_window_source": window_src,
            "days_left_to_appeal": days_left,
            "urgency": urgency,
            "expected_value": expected_value,
        })

    # Rank: workable first, then by expected value; expired sink to the bottom
    out.sort(key=lambda c: (c["appealable"] == "no", -c["expected_value"]))
    return out


def batches(triaged):
    """Group workable claims by (payer, CARC) - one root-cause fix, many claims."""
    groups = {}
    for c in triaged:
        if c["appealable"] == "no":
            continue
        key = (c["payer"] or "UNKNOWN", c["carc"])
        groups.setdefault(key, []).append(c)
    result = []
    for (payer, code), cs in groups.items():
        result.append({
            "payer": payer, "carc": code,
            "carc_desc": cs[0]["carc_desc"], "category": cs[0]["category"],
            "claims": len(cs),
            "denied_total": round(sum(x["denied_amount"] for x in cs), 2),
            "expected_value": round(sum(x["expected_value"] for x in cs), 2),
            "recommended_fix": cs[0]["recommended_fix"],
            "most_urgent_days_left": min(
                (x["days_left_to_appeal"] for x in cs if x["days_left_to_appeal"] is not None),
                default=None),
        })
    result.sort(key=lambda b: -b["expected_value"])
    return result


if __name__ == "__main__":
    raw = open(sys.argv[1]).read() if len(sys.argv) > 1 else sys.stdin.read()
    claims = json.loads(raw)
    t = triage(claims)
    json.dump({"claims": t, "batches": batches(t)}, sys.stdout, indent=2)
    workable = [c for c in t if c["appealable"] != "no"]
    print(
        f"\n-- {len(t)} denials triaged | {len(workable)} workable | "
        f"expected recovery ${sum(c['expected_value'] for c in workable):,.2f}",
        file=sys.stderr,
    )

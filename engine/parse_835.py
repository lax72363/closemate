"""Parse X12 835 remittance files and denial CSV exports into normalized claim records.

Stdlib only - runs anywhere Python 3.10+ runs.

Usage:
    python3 engine/parse_835.py samples/sample_835.txt          # X12 835
    python3 engine/parse_835.py export.csv                      # PMS CSV export
Outputs normalized claims as JSON to stdout (pipe into triage.py).

CSV expectations (flexible, case-insensitive headers; extra columns ignored):
    claim_id, payer, patient (optional/de-identified ok), service_date,
    cpt (optional), charged, paid, denial_code, denial_group (optional),
    denial_date (optional - falls back to service_date)
"""
import csv
import io
import json
import re
import sys
from datetime import datetime


def _clean(s):
    return (s or "").strip()


def parse_x12_835(text):
    """Minimal 835 parser: extracts claim-level payment info (CLP), patient (NM1*QC),
    adjustments (CAS), service lines (SVC), and dates (DTM). Element separator and
    segment terminator are read from the ISA header."""
    text = text.strip()
    if not text.startswith("ISA"):
        raise ValueError("Not an X12 file (missing ISA header)")
    elem_sep = text[3]
    seg_term = text[105] if len(text) > 105 else "~"
    segments = [s.strip() for s in text.split(seg_term) if s.strip()]

    claims = []
    payer_name = ""
    check_date = None
    current = None

    for seg in segments:
        parts = seg.split(elem_sep)
        tag = parts[0]

        if tag == "N1" and len(parts) > 2 and parts[1] == "PR":
            payer_name = _clean(parts[2])
        elif tag == "BPR" and len(parts) > 16:
            # BPR16 = check/EFT date CCYYMMDD
            check_date = _clean(parts[16]) or check_date
        elif tag == "CLP":
            if current:
                claims.append(current)
            status = _clean(parts[2]) if len(parts) > 2 else ""
            current = {
                "claim_id": _clean(parts[1]) if len(parts) > 1 else "",
                "payer": payer_name,
                "status_code": status,
                # CLP status 4 = denied; 1/2/3 = processed; 22 = reversal
                "denied": status == "4",
                "charged": float(parts[3]) if len(parts) > 3 and parts[3] else 0.0,
                "paid": float(parts[4]) if len(parts) > 4 and parts[4] else 0.0,
                "patient_resp": float(parts[5]) if len(parts) > 5 and parts[5] else 0.0,
                "payer_claim_number": _clean(parts[7]) if len(parts) > 7 else "",
                "patient": "",
                "cpt": "",
                "service_date": "",
                "denial_date": _fmt_date(check_date),
                "adjustments": [],  # list of {group, code, amount}
            }
        elif current is not None:
            if tag == "NM1" and len(parts) > 4 and parts[1] == "QC":
                current["patient"] = f"{_clean(parts[3])}, {_clean(parts[4])}"
            elif tag == "CAS" and len(parts) > 3:
                group = _clean(parts[1])
                # CAS repeats triplets: code, amount, quantity
                i = 2
                while i + 1 < len(parts):
                    code, amount = _clean(parts[i]), parts[i + 1]
                    if code:
                        try:
                            amt = float(amount)
                        except (TypeError, ValueError):
                            amt = 0.0
                        current["adjustments"].append(
                            {"group": group, "code": code, "amount": amt}
                        )
                    i += 3
            elif tag == "SVC" and len(parts) > 1:
                proc = parts[1]
                m = re.match(r"HC[:>](\w+)", proc)
                if m and not current["cpt"]:
                    current["cpt"] = m.group(1)
            elif tag == "DTM" and len(parts) > 2 and parts[1] in ("232", "472"):
                if not current["service_date"]:
                    current["service_date"] = _fmt_date(_clean(parts[2]))

    if current:
        claims.append(current)
    return claims


def _fmt_date(ccyymmdd):
    if not ccyymmdd:
        return ""
    s = re.sub(r"\D", "", ccyymmdd)
    if len(s) == 8:
        return f"{s[0:4]}-{s[4:6]}-{s[6:8]}"
    return ccyymmdd


def parse_csv(text):
    """Parse a PMS denial/claims CSV export with flexible headers."""
    aliases = {
        "claim_id": ["claim_id", "claim", "claim number", "claim #", "claimid", "id"],
        "payer": ["payer", "insurance", "carrier", "payer name", "plan"],
        "patient": ["patient", "patient name", "client", "name"],
        "service_date": ["service_date", "dos", "date of service", "service date"],
        "cpt": ["cpt", "procedure", "code", "cpt code", "procedure code"],
        "charged": ["charged", "charge", "billed", "amount", "charge amount", "billed amount"],
        "paid": ["paid", "payment", "paid amount", "insurance paid"],
        "denial_code": ["denial_code", "carc", "reason code", "denial reason code", "adj reason", "denial code"],
        "denial_group": ["denial_group", "group", "group code", "adj group"],
        "denial_date": ["denial_date", "denied date", "remit date", "eob date", "check date"],
    }
    reader = csv.DictReader(io.StringIO(text))
    field_map = {}
    for canon, opts in aliases.items():
        for h in reader.fieldnames or []:
            if h and h.strip().lower() in opts:
                field_map[canon] = h
                break

    if "denial_code" not in field_map:
        raise ValueError(
            f"No denial-code column found. Headers seen: {reader.fieldnames}. "
            "Need one of: denial_code / CARC / reason code."
        )

    claims = []
    for row in reader:
        def g(canon, default=""):
            return _clean(row.get(field_map.get(canon, ""), default))

        def money(canon):
            v = re.sub(r"[^0-9.\-]", "", g(canon) or "0")
            try:
                return float(v or 0)
            except ValueError:
                return 0.0

        charged, paid = money("charged"), money("paid")
        code = g("denial_code").upper().replace("CO-", "").replace("PR-", "").replace("OA-", "").replace("PI-", "")
        claims.append({
            "claim_id": g("claim_id") or f"row{len(claims)+1}",
            "payer": g("payer").upper(),
            "patient": g("patient"),
            "service_date": _norm_csv_date(g("service_date")),
            "cpt": g("cpt"),
            "charged": charged,
            "paid": paid,
            "patient_resp": 0.0,
            "denied": True,
            "status_code": "4",
            "payer_claim_number": "",
            "denial_date": _norm_csv_date(g("denial_date")) or _norm_csv_date(g("service_date")),
            "adjustments": [{
                "group": g("denial_group").upper() or "CO",
                "code": code,
                "amount": max(charged - paid, 0.0),
            }],
        })
    return claims


def _norm_csv_date(s):
    if not s:
        return ""
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%m/%d/%y", "%m-%d-%Y", "%Y%m%d"):
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return s


def parse_file(path):
    with open(path, "r", encoding="utf-8-sig", errors="replace") as f:
        text = f.read()
    if text.lstrip().startswith("ISA"):
        return parse_x12_835(text)
    return parse_csv(text)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    result = parse_file(sys.argv[1])
    json.dump(result, sys.stdout, indent=2)
    print(f"\n-- parsed {len(result)} claims from {sys.argv[1]}", file=sys.stderr)

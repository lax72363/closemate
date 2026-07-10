"""Test suite - no dependencies, run: python3 engine/tests.py
Fixtures are deliberately ugly: reversals, tab-delimited exports, parens negatives,
LQ remark codes, multiple ST transactions, weird headers. If this passes, a real
practice export probably parses.
"""
import json
import os
import sys
import tempfile
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
from parse_835 import parse_x12_835, parse_csv  # noqa: E402
from triage import triage, batches  # noqa: E402
from reconcile import load_inventory, reconcile  # noqa: E402

PASS = 0
FAIL = 0


def check(name, cond, detail=""):
    global PASS, FAIL
    if cond:
        PASS += 1
        print(f"  ok  {name}")
    else:
        FAIL += 1
        print(f" FAIL {name} {detail}")


# ---------- fixture: 835 with two ST transactions, a reversal, and LQ remarks ----------
X12 = (
    "ISA*00*          *00*          *ZZ*UHCPAYER       *ZZ*ACMECOUNSEL    "
    "*260620*1200*^*00501*000000202*0*T*:~"
    "GS*HP*UHCPAYER*ACMECOUNSEL*20260620*1200*202*X*005010X221A1~"
    "ST*835*0001~BPR*I*0.00*C*CHK************20260620~TRN*1*071111111*1999999999~"
    "N1*PR*UNITEDHEALTHCARE~N1*PE*ACME COUNSELING GROUP*XX*1888888888~"
    "LX*1~CLP*T-100*4*160.00*0.00*0.00*MC*26X001*11~NM1*QC*1*ALPHA*ANN~"
    "SVC*HC:90837*160.00*0.00~DTM*232*20260610~CAS*CO*16*160.00~LQ*HE*N290~"
    "LX*2~CLP*T-101*22*-98.50*-98.50*0.00*MC*26X002*11~NM1*QC*1*BETA*BOB~"
    "CAS*CO*45*0.00~"
    "SE*16*0001~"
    "ST*835*0002~BPR*I*250.00*C*CHK************20260620~TRN*1*071111112*1999999999~"
    "N1*PR*UNITEDHEALTHCARE~"
    "LX*1~CLP*T-102*1*160.00*120.00*20.00*MC*26X003*11~NM1*QC*1*GAMMA*GIA~"
    "SVC*HC:90834*160.00*120.00~DTM*232*20260612~CAS*CO*45*20.00~CAS*PR*3*20.00~"
    "LX*2~CLP*T-103*4*145.00*0.00*0.00*MC*26X004*11~NM1*QC*1*DELTA*DAN~"
    "SVC*HC:90834*145.00*0.00~DTM*232*20260614~CAS*CO*197*100.00*1*252*45.00~"
    "SE*14*0002~GE*2*202~IEA*1*000000202~"
)

claims = parse_x12_835(X12)
check("835: parses 4 claims across 2 transactions", len(claims) == 4, f"got {len(claims)}")
c0 = next(c for c in claims if c["claim_id"] == "T-100")
check("835: denial flagged", c0["denied"] is True)
check("835: LQ remark captured", c0["remark_codes"] == ["N290"], str(c0["remark_codes"]))
check("835: payer from N1*PR", c0["payer"] == "UNITEDHEALTHCARE")
check("835: CPT extracted", c0["cpt"] == "90837")
c1 = next(c for c in claims if c["claim_id"] == "T-101")
check("835: reversal flagged", c1["reversal"] is True)
c3 = next(c for c in claims if c["claim_id"] == "T-103")
check("835: multi-CAS triplets", len(c3["adjustments"]) == 2, str(c3["adjustments"]))

# ---------- fixture: nasty tab-delimited CSV with $ and parens ----------
TSV = (
    "Claim Number\tInsurance\tDate of Service\tProcedure\tBilled Amount\tInsurance Paid\tDenial Reason\tRemark\tEOB Date\n"
    'C-1\tAETNA\t06/01/2026\t90837\t"$165.00"\t$0.00\tCO-197\tM62\t06/15/2026\n'
    "C-2\tCIGNA\t06/03/2026\t90834\t$140.00\t(10.00)\t16\tN290; M76\t06/18/2026\n"
)
rows = parse_csv(TSV)
check("csv: tab-delimited sniffed", len(rows) == 2, f"got {len(rows)}")
check("csv: header 'Claim Number' mapped", rows[0]["claim_id"] == "C-1", rows[0]["claim_id"])
check("csv: CO- prefix stripped", rows[0]["adjustments"][0]["code"] == "197")
check("csv: $ amount parsed", rows[0]["charged"] == 165.0)
check("csv: parens negative parsed", rows[1]["paid"] == -10.0, str(rows[1]["paid"]))
check("csv: multiple remark codes split", rows[1]["remark_codes"] == ["N290", "M76"], str(rows[1]["remark_codes"]))
check("csv: date normalized", rows[0]["service_date"] == "2026-06-01", rows[0]["service_date"])

# ---------- triage ----------
t = triage(claims + rows, today=date(2026, 7, 10))
ids = {c["claim_id"] for c in t}
check("triage: reversal excluded", "T-101" not in ids)
check("triage: underpayment candidate (CO-45, paid) kept", "T-102" in ids)
t100 = next(c for c in t if c["claim_id"] == "T-100")
check("triage: RARC note resolved", any("N290" in n for n in t100["remark_notes"]), str(t100["remark_notes"]))
check("triage: UHC 65-day window applied", t100["appeal_window_days"] == 65)
check("triage: days-left math", t100["days_left_to_appeal"] == 65 - 20, str(t100["days_left_to_appeal"]))
c1_csv = next(c for c in t if c["claim_id"] == "C-1")
check("triage: aetna 180-day window", c1_csv["appeal_window_days"] == 180)
check("triage: sorted by expected value desc among workable",
      all(t[i]["expected_value"] >= t[i + 1]["expected_value"]
          for i in range(len(t) - 1) if t[i]["appealable"] != "no" and t[i + 1]["appealable"] != "no"))
b = batches(t)
check("triage: batches non-empty and ranked", len(b) > 0 and b[0]["expected_value"] == max(x["expected_value"] for x in b))

# ---------- expired claim ----------
old = parse_csv("claim_id,payer,service_date,charged,paid,denial_code,denial_date\n"
                "OLD-1,UNITEDHEALTHCARE,2026-01-05,160,0,50,2026-01-20\n")
t_old = triage(old, today=date(2026, 7, 10))
check("triage: expired UHC claim not appealable",
      t_old[0]["appealable"] == "no" and t_old[0]["urgency"] == "EXPIRED")
check("triage: expired claim expected value = 0", t_old[0]["expected_value"] == 0)

# ---------- reconciliation ----------
with tempfile.TemporaryDirectory() as td:
    inv_path = os.path.join(td, "inv.csv")
    with open(inv_path, "w") as f:
        f.write("claim_id,fee_pct\nT-100,0.20\nT-103,\nNOPE-1,0.20\n")
    remit_path = os.path.join(td, "remit.txt")
    # A later 835 shows T-100 now PAID $128 (appeal won); T-103 still unpaid
    with open(remit_path, "w") as f:
        f.write(
            "ISA*00*          *00*          *ZZ*UHCPAYER       *ZZ*ACMECOUNSEL    "
            "*260715*1200*^*00501*000000303*0*T*:~"
            "GS*HP*UHCPAYER*ACMECOUNSEL*20260715*1200*303*X*005010X221A1~"
            "ST*835*0001~BPR*I*128.00*C*CHK************20260715~TRN*1*071111113*1999999999~"
            "N1*PR*UNITEDHEALTHCARE~"
            "LX*1~CLP*T-100*1*160.00*128.00*32.00*MC*26X001R*11~NM1*QC*1*ALPHA*ANN~"
            "SVC*HC:90837*160.00*128.00~DTM*232*20260610~CAS*PR*2*32.00~"
            "SE*10*0001~GE*1*303~IEA*1*000000303~")
    inv = load_inventory(inv_path)
    check("recon: inventory loaded", len(inv) == 3)
    m = reconcile(inv, [remit_path], default_fee=0.20)
    check("recon: matched exactly the paid inventory claim", len(m) == 1 and m[0]["claim_id"] == "T-100")
    check("recon: fee computed", m[0]["fee"] == round(128.00 * 0.20, 2), str(m[0]))

print(f"\n{PASS} passed, {FAIL} failed")
sys.exit(1 if FAIL else 0)

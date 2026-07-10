"""Draft appeal letters for triaged claims. Works offline (templates); uses Claude API
for a polished payer-specific draft when ANTHROPIC_API_KEY is set.

RULE: a human reads and approves EVERY letter before it is sent. No exceptions.
NOTE: with real PHI, only run the API path once you are on a BAA-covered endpoint
      (e.g., Claude on Vertex AI under the GCP BAA). Until then: templates only.

Usage:
    python3 engine/appeal_letter.py reports/demo_audit.json --claim ACG-1001
    python3 engine/appeal_letter.py reports/demo_audit.json --batch "OPTUM BEHAVIORAL HEALTH:197"
"""
import argparse
import json
import os
import sys
import textwrap
import urllib.request
from datetime import date

ARGUMENTS = {
    "authorization": (
        "Authorization-related denial. Arguments: (1) retro-authorization request per plan policy; "
        "(2) clinical necessity of continued treatment (attach treatment plan + progress summary); "
        "(3) if an auth WAS on file, cite the reference number and request reprocessing; "
        "(4) continuity-of-care obligations for established behavioral health patients."),
    "missing_info": (
        "Documentation/information denial. Identify the exact missing element from the RARC, attach it, "
        "and request reprocessing rather than formal appeal where the payer allows corrected claims."),
    "medical_necessity": (
        "Medical-necessity denial. Attach: diagnosis, treatment plan, measurable progress, frequency "
        "rationale, and cite MHPAEA (mental health parity) where the payer applies stricter review to "
        "behavioral health than medical/surgical benefits."),
    "timely_filing": (
        "Timely-filing denial. Attach proof of original timely submission: clearinghouse acceptance "
        "report (999/277CA), submission logs. Request adjudication on the merits."),
    "credentialing": (
        "Provider-eligibility denial. If provider was credentialed/enrolled on DOS, attach roster or "
        "welcome letter and effective dates; request reprocessing of ALL claims in the affected span. "
        "If enrollment was pending, cite payer's retro-enrollment policy."),
    "wrong_payer": (
        "Coverage/payer-routing denial. Verify member eligibility for DOS and correct payer; resubmit "
        "with correct member ID. Ask receiving payer to honor original filing date."),
    "cob": (
        "Coordination-of-benefits denial. Provide primary payer EOB or patient's updated COB attestation; "
        "request reprocessing."),
    "bundling": (
        "Bundling denial. Document that services were separate and distinct; apply appropriate modifier "
        "(59/25) per NCCI guidance; cite payer policy allowing separate reimbursement."),
    "frequency": (
        "Frequency/units denial. Provide clinical rationale for visit frequency, treatment plan showing "
        "planned cadence, and parity argument if BH visit limits are stricter than medical."),
    "network": (
        "Network-status denial. If provider is in-network: attach contract/roster evidence and demand "
        "reprocessing; payer roster errors are common. Otherwise invoke OON benefits or single-case agreement."),
    "coverage": (
        "Coverage denial. Cite the member's actual benefit language (telehealth and BH services are "
        "frequently misadjudicated); include parity argument where applicable."),
}

TEMPLATE = """\
{practice_name}
{practice_address}

{today}

{payer} — Provider Appeals
RE: Appeal of claim denial
   Patient: {patient}
   Claim #: {claim_id}   Payer claim #: {payer_claim_number}
   Date of service: {service_date}   CPT: {cpt}
   Billed: ${charged:.2f}   Denied: ${denied_amount:.2f}
   Denial reason: CARC {carc} — {carc_desc}{remark_block}

To the Appeals Department:

We are appealing the denial of the above claim within the applicable appeal window.

{argument}

The services were rendered as billed, were clinically appropriate, and are covered under the
member's plan. Supporting documentation is enclosed. We request that this claim be reprocessed
and paid according to the terms of the provider agreement.

Please direct questions to the contact below. We request a written determination within the
timeframe required by the plan and applicable law.

Sincerely,

{signer_name}
{signer_title}
{practice_name}
{practice_phone}

Enclosures: {enclosures}
"""


def offline_letter(claim, practice):
    arg = ARGUMENTS.get(claim["category"],
                        "The denial is inconsistent with the member's benefits and the provider "
                        "agreement. See enclosed documentation.")
    checklist = {
        "authorization": "treatment plan; progress note summary; auth reference (if any)",
        "missing_info": "the element named in the RARC; corrected claim form",
        "medical_necessity": "treatment plan; progress notes; necessity letter",
        "timely_filing": "clearinghouse acceptance report (999/277CA); submission log",
        "credentialing": "credentialing letter/roster with effective dates; list of affected claims",
        "cob": "primary payer EOB or updated COB attestation",
    }.get(claim["category"], "supporting clinical/billing documentation")

    remarks = claim.get("remark_notes") or claim.get("remark_codes") or []
    remark_block = ""
    if remarks:
        remark_block = "\n   Remark codes: " + "; ".join(str(r) for r in remarks)

    return TEMPLATE.format(
        remark_block=remark_block,
        today=date.today().strftime("%B %d, %Y"),
        argument=textwrap.fill(arg, 96),
        enclosures=checklist,
        patient=claim.get("patient") or "[PATIENT]",
        payer_claim_number=claim.get("payer_claim_number") or "[PAYER CLAIM #]",
        cpt=claim.get("cpt") or "[CPT]",
        service_date=claim.get("service_date") or "[DOS]",
        claim_id=claim["claim_id"], payer=claim["payer"],
        charged=claim["charged"], denied_amount=claim["denied_amount"],
        carc=claim["carc"], carc_desc=claim["carc_desc"],
        **practice,
    )


def claude_letter(claim, practice, model="claude-opus-4-8"):
    """Polished draft via Claude API. Only for non-PHI/synthetic data until you have a
    BAA-covered endpoint (Vertex AI). Falls back to offline template on any error."""
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        return None
    body = json.dumps({
        "model": model,
        "max_tokens": 1500,
        "messages": [{"role": "user", "content":
            "Draft a professional, firm, payer-ready appeal letter for this denied behavioral "
            "health claim. Use concrete arguments for the denial category, cite mental health "
            "parity (MHPAEA) only where relevant, request reprocessing, and list enclosures. "
            "Output only the letter.\n\nClaim JSON:\n" + json.dumps(claim) +
            "\n\nPractice JSON:\n" + json.dumps(practice) +
            "\n\nKnown effective arguments for this category:\n" +
            ARGUMENTS.get(claim["category"], "")}],
    }).encode()
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages", data=body,
        headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                 "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.load(r)
        return resp["content"][0]["text"]
    except Exception as e:  # noqa: BLE001 - any API failure -> offline template
        print(f"(Claude API unavailable: {e}; using offline template)", file=sys.stderr)
        return None


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("audit_json")
    ap.add_argument("--claim", help="claim_id to draft")
    ap.add_argument("--batch", help="'PAYER:CARC' - one letter covering all matching claims")
    ap.add_argument("--practice-file", default=None, help="JSON with practice letterhead fields")
    args = ap.parse_args()

    practice = {
        "practice_name": "[PRACTICE NAME]", "practice_address": "[ADDRESS]",
        "practice_phone": "[PHONE]", "signer_name": "[BILLING CONTACT]",
        "signer_title": "Billing Department",
    }
    if args.practice_file:
        practice.update(json.load(open(args.practice_file)))

    data = json.load(open(args.audit_json))
    claims = data["claims"]

    if args.claim:
        targets = [c for c in claims if c["claim_id"] == args.claim]
    elif args.batch:
        payer, carc = args.batch.rsplit(":", 1)
        targets = [c for c in claims if c["payer"] == payer and c["carc"] == carc
                   and c["appealable"] != "no"]
        if targets:  # one letter, all claims listed
            merged = dict(targets[0])
            merged["claim_id"] = ", ".join(c["claim_id"] for c in targets)
            merged["payer_claim_number"] = ", ".join(
                c.get("payer_claim_number") or "?" for c in targets)
            merged["denied_amount"] = sum(c["denied_amount"] for c in targets)
            merged["charged"] = sum(c["charged"] for c in targets)
            merged["service_date"] = f"{min(c['service_date'] for c in targets)} through {max(c['service_date'] for c in targets)}"
            targets = [merged]
    else:
        sys.exit("Specify --claim CLAIM_ID or --batch 'PAYER:CARC'")

    if not targets:
        sys.exit("No matching workable claims.")
    for c in targets:
        letter = claude_letter(c, practice) or offline_letter(c, practice)
        print(letter)
        print("\n" + "=" * 90 + "\nREVIEW BEFORE SENDING - verify every fact against the source EOB/835.\n")

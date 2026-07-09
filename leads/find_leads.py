"""Build a lead list of behavioral-health organizations from the free NPPES NPI Registry API.

No API key needed. CMS public data.

Usage:
    python3 leads/find_leads.py --state TX --city Dallas --limit 100 -o leads/tx_dallas.csv
    python3 leads/find_leads.py --state GA --limit 200 -o leads/ga.csv
"""
import argparse
import csv
import json
import sys
import time
import urllib.parse
import urllib.request

API = "https://npiregistry.cms.hhs.gov/api/?version=2.1"

# Organizational taxonomies that skew behavioral health
BH_TAXONOMY_HINTS = (
    "MENTAL HEALTH", "BEHAVIORAL", "PSYCHOLOG", "COUNSEL", "SOCIAL WORK",
    "PSYCHIATR", "SUBSTANCE", "MARRIAGE & FAMILY",
)


def fetch(params):
    url = API + "&" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)


def find(state, city=None, limit=100, taxonomy="Mental Health"):
    """NPI-2 = organizations. The API caps at 200/request and 1200 skip."""
    rows, skip = [], 0
    while len(rows) < limit and skip <= 1000:
        params = {
            "enumeration_type": "NPI-2",
            "state": state,
            "taxonomy_description": taxonomy,
            "limit": min(200, limit - len(rows)),
            "skip": skip,
        }
        if city:
            params["city"] = city
        data = fetch(params)
        results = data.get("results", [])
        if not results:
            break
        for org in results:
            basic = org.get("basic", {})
            addr = next((a for a in org.get("addresses", [])
                         if a.get("address_purpose") == "LOCATION"),
                        (org.get("addresses") or [{}])[0])
            taxonomies = "; ".join(
                t.get("desc", "") for t in org.get("taxonomies", []) if t.get("primary"))
            name = basic.get("organization_name", "")
            # Skip obvious non-targets (hospitals, mega-systems)
            if any(x in name.upper() for x in ("HOSPITAL", "HEALTH SYSTEM", "UNIVERSITY")):
                continue
            rows.append({
                "organization": name,
                "npi": org.get("number", ""),
                "city": addr.get("city", ""),
                "state": addr.get("state", ""),
                "address": f"{addr.get('address_1','')} {addr.get('address_2','')}".strip(),
                "phone": addr.get("telephone_number", ""),
                "taxonomy": taxonomies,
                "authorized_official": f"{basic.get('authorized_official_first_name','')} "
                                       f"{basic.get('authorized_official_last_name','')}".strip(),
                "official_title": basic.get("authorized_official_title_or_position", ""),
                # you fill these while qualifying:
                "website": "", "email": "", "clinician_count": "", "takes_insurance": "",
                "status": "new", "notes": "",
            })
        skip += len(results)
        time.sleep(0.5)  # be polite to a free government API
    return rows[:limit]


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--state", required=True)
    ap.add_argument("--city", default=None)
    ap.add_argument("--limit", type=int, default=100)
    ap.add_argument("--taxonomy", default="Mental Health",
                    help='try also: "Counselor", "Psychologist", "Clinical Social Worker"')
    ap.add_argument("-o", "--out", required=True)
    args = ap.parse_args()

    rows = find(args.state, args.city, args.limit, args.taxonomy)
    if not rows:
        sys.exit("No results - try a different taxonomy or drop --city.")
    with open(args.out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {len(rows)} leads -> {args.out}", file=sys.stderr)
    print("Next: qualify each lead (website, clinician count 5-50, takes insurance) "
          "before emailing. Authorized official is often the owner.", file=sys.stderr)

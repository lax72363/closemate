#!/usr/bin/env python3
"""Weighted scoring of 42 business models for the 72-hour challenge."""

# Weights (sum = 1.00). Rationale: with a 72-hour clock, time-to-first-sale,
# ease of customer acquisition, and urgency dominate; scale paths matter but
# are discounted because they pay off after the challenge.
WEIGHTS = {
    "urgency": 0.15,
    "willingness_to_pay": 0.12,
    "competition": 0.08,      # 10 = low competition
    "ease_of_customers": 0.15, # in 72h specifically
    "startup_cost": 0.08,     # 10 = near-zero cost
    "time_to_first_sale": 0.15,# 10 = same-day possible
    "margin": 0.08,
    "automation": 0.05,
    "ai_leverage": 0.05,
    "path_10k": 0.05,
    "path_100k": 0.04,
}
DIMS = list(WEIGHTS)

# name: [U, WTP, Comp, Ease, Cost, TTFS, Margin, Auto, AI, 10k, 100k]
MODELS = {
    "Form 5500-EZ deadline-rescue concierge (solo 401k owners)": [10,8,9,7,10,9,10,8,9,8,6],
    "DFVCP late-filing amnesty service (small employer plans)":  [8,9,8,4,9,5,10,7,8,8,7],
    "Closemate: AI chatbot for real estate lead gen (SaaS)":     [6,6,3,5,9,5,9,9,10,7,7],
    "Speed-to-lead install, productized service for agents":     [7,7,5,6,9,7,9,8,9,8,6],
    "AI voice receptionist for home-service contractors":        [7,7,4,5,8,5,8,9,10,8,8],
    "Google review response / reputation mgmt for local biz":    [5,5,4,6,10,7,9,9,10,6,4],
    "Law-firm intake automation (personal injury)":              [7,9,5,4,8,4,9,8,9,9,8],
    "GovCon RFP/proposal writing with AI":                       [7,9,6,4,9,4,9,6,9,9,8],
    "AI listing descriptions + photo enhancement for agents":    [3,4,4,7,10,8,9,9,10,4,2],
    "Missed-call text-back productized service":                 [6,6,3,6,9,7,9,10,7,6,4],
    "AI SOP/documentation writing for SMBs":                     [4,6,7,4,10,5,9,7,9,6,4],
    "Micro-SaaS: 5500-EZ self-prep software":                    [9,6,7,5,8,6,10,10,8,6,5],
    "Dispatch/scheduling SaaS for mobile detailers":             [4,5,6,3,7,2,9,9,7,5,5],
    "Google Business Profile optimization sprint":               [5,6,4,7,10,8,9,7,8,7,4],
    "Local SEO citation cleanup":                                [4,5,5,6,10,7,9,8,7,5,3],
    "Website speed-fix service for local businesses":            [4,5,5,5,10,6,9,7,7,5,3],
    "Facebook-ads agency for med spas":                          [6,8,3,4,8,4,8,6,7,8,7],
    "Google LSA management for contractors":                     [6,7,5,5,9,5,9,7,6,8,6],
    "CDL driver recruiting ads for trucking companies":          [8,8,5,4,8,4,8,7,7,8,7],
    "Landlord bookkeeping template packs":                       [3,4,6,5,10,7,10,10,8,4,2],
    "Solo 401k course / paid guide":                             [4,4,6,5,10,7,10,10,9,5,3],
    "AI adoption workshops for professional firms":              [5,7,6,4,10,5,10,5,9,7,5],
    "Zapier/Make automation buildouts for agencies":             [5,7,5,5,10,6,9,6,8,7,5],
    "CRM cleanup + automation for real estate teams":            [5,6,6,5,10,6,9,7,8,6,4],
    "Reverse recruiting for laid-off tech workers":              [7,6,5,6,10,7,9,6,8,6,4],
    "Niche contingency recruiting":                              [6,9,4,3,10,2,10,4,6,8,8],
    "ADA website compliance audits":                             [4,5,3,4,10,5,9,8,8,5,4],
    "HIPAA compliance starter kits for small practices":         [5,6,5,4,10,5,10,8,8,6,5],
    "Medical billing denial recovery":                           [8,9,5,3,9,2,8,7,9,9,9],
    "Provider credentialing service (new practices)":            [8,8,6,4,10,3,9,6,7,8,7],
    "QuickBooks cleanup sprints":                                [6,7,5,5,10,6,9,6,8,7,5],
    "Sales-tax nexus review for e-commerce":                     [6,7,6,4,10,4,9,6,7,7,5],
    "Permit expediting for small contractors":                   [8,8,7,5,10,5,9,5,6,8,6],
    "Construction bid-package assembly service":                 [6,7,7,4,10,5,9,6,8,7,5],
    "Freight carrier setup / MC-authority compliance packets":   [7,7,6,5,10,6,9,7,7,7,5],
    "Security-deposit dispute documentation service":            [6,5,8,4,10,6,9,7,8,4,2],
    "STR (Airbnb) listing optimization sprints":                 [5,6,5,6,10,7,9,7,9,6,4],
    "College essay coaching":                                    [5,7,4,5,10,6,10,5,7,6,4],
    "Executive resume/LinkedIn rewrite service":                 [6,6,3,6,10,8,10,7,9,6,3],
    "Estate 'death binder' document-organization service":       [4,6,8,4,10,5,9,7,8,5,4],
    "COI (insurance certificate) tracking for property mgrs":    [6,7,7,4,10,4,9,8,8,7,6],
    "ISO 9001 documentation prep for small manufacturers":       [5,8,7,3,10,3,9,6,8,7,5],
}

def total(scores):
    return round(sum(s * WEIGHTS[d] for s, d in zip(scores, DIMS)) * 10, 1)  # scale to 100

ranked = sorted(MODELS.items(), key=lambda kv: total(kv[1]), reverse=True)
hdr = ["Rank", "Model"] + ["Urg","WTP","Comp","Ease","Cost","TTFS","Mgn","Auto","AI","10k","100k","Score"]
print("| " + " | ".join(hdr) + " |")
print("|" + "---|" * len(hdr))
for i, (name, s) in enumerate(ranked, 1):
    print(f"| {i} | {name} | " + " | ".join(map(str, s)) + f" | **{total(s)}** |")

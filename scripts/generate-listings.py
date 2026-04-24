#!/usr/bin/env python3
"""
Generate additional SophiaMarket listings to bring total from 20 to 120.
Preserves the existing 20 entries, appends 100 new ones.
Country names match market.html exactly (United Kingdom, United States, etc.).
"""
import json
import pathlib
from datetime import date, timedelta
import random

ROOT = pathlib.Path(__file__).resolve().parent.parent
TARGET = ROOT / "sample-listings.json"

random.seed(42)

# (country, flag, city, region)
CITIES = {
    "Americas": [
        ("United States", "🇺🇸", "New York"), ("United States", "🇺🇸", "Los Angeles"),
        ("United States", "🇺🇸", "Miami"), ("Canada", "🇨🇦", "Vancouver"),
        ("Mexico", "🇲🇽", "Mexico City"), ("Mexico", "🇲🇽", "Guadalajara"),
        ("Brazil", "🇧🇷", "Rio de Janeiro"), ("Brazil", "🇧🇷", "Brasilia"),
        ("Argentina", "🇦🇷", "Buenos Aires"), ("Colombia", "🇨🇴", "Bogotá"),
        ("Colombia", "🇨🇴", "Medellín"), ("Chile", "🇨🇱", "Santiago"),
        ("Peru", "🇵🇪", "Lima"), ("Ecuador", "🇪🇨", "Quito"),
        ("Dominican Republic", "🇩🇴", "Santo Domingo"),
        ("Guatemala", "🇬🇹", "Guatemala City"), ("Cuba", "🇨🇺", "Havana"),
        ("Jamaica", "🇯🇲", "Kingston"), ("Uruguay", "🇺🇾", "Montevideo"),
        ("Panama", "🇵🇦", "Panama City"),
    ],
    "Europe": [
        ("United Kingdom", "🇬🇧", "Manchester"), ("United Kingdom", "🇬🇧", "Edinburgh"),
        ("Germany", "🇩🇪", "Munich"), ("Germany", "🇩🇪", "Hamburg"),
        ("Spain", "🇪🇸", "Madrid"), ("Spain", "🇪🇸", "Barcelona"),
        ("Italy", "🇮🇹", "Milan"), ("Italy", "🇮🇹", "Rome"),
        ("Netherlands", "🇳🇱", "Amsterdam"), ("Portugal", "🇵🇹", "Lisbon"),
        ("Sweden", "🇸🇪", "Stockholm"), ("Poland", "🇵🇱", "Warsaw"),
        ("Switzerland", "🇨🇭", "Zurich"), ("Belgium", "🇧🇪", "Brussels"),
        ("Norway", "🇳🇴", "Oslo"), ("Denmark", "🇩🇰", "Copenhagen"),
        ("Greece", "🇬🇷", "Athens"), ("Ireland", "🇮🇪", "Dublin"),
        ("Czech Republic", "🇨🇿", "Prague"), ("Romania", "🇷🇴", "Bucharest"),
    ],
    "Africa": [
        ("Nigeria", "🇳🇬", "Abuja"), ("Nigeria", "🇳🇬", "Port Harcourt"),
        ("South Africa", "🇿🇦", "Johannesburg"), ("South Africa", "🇿🇦", "Durban"),
        ("Kenya", "🇰🇪", "Mombasa"), ("Ethiopia", "🇪🇹", "Addis Ababa"),
        ("Ghana", "🇬🇭", "Kumasi"), ("Tanzania", "🇹🇿", "Dar es Salaam"),
        ("Egypt", "🇪🇬", "Cairo"), ("Egypt", "🇪🇬", "Alexandria"),
        ("Morocco", "🇲🇦", "Casablanca"), ("Morocco", "🇲🇦", "Marrakech"),
        ("Uganda", "🇺🇬", "Kampala"), ("Algeria", "🇩🇿", "Algiers"),
        ("Tunisia", "🇹🇳", "Tunis"), ("Senegal", "🇸🇳", "Dakar"),
        ("Cameroon", "🇨🇲", "Douala"), ("Ivory Coast", "🇨🇮", "Abidjan"),
        ("Rwanda", "🇷🇼", "Kigali"), ("Zambia", "🇿🇲", "Lusaka"),
        ("Zimbabwe", "🇿🇼", "Harare"), ("Angola", "🇦🇴", "Luanda"),
        ("Mozambique", "🇲🇿", "Maputo"), ("Madagascar", "🇲🇬", "Antananarivo"),
        ("Mali", "🇲🇱", "Bamako"),
    ],
    "Middle East": [
        ("Saudi Arabia", "🇸🇦", "Jeddah"), ("Saudi Arabia", "🇸🇦", "Dammam"),
        ("UAE", "🇦🇪", "Abu Dhabi"), ("UAE", "🇦🇪", "Sharjah"),
        ("Turkey", "🇹🇷", "Istanbul"), ("Turkey", "🇹🇷", "Ankara"),
        ("Israel", "🇮🇱", "Tel Aviv"), ("Qatar", "🇶🇦", "Doha"),
        ("Kuwait", "🇰🇼", "Kuwait City"), ("Jordan", "🇯🇴", "Amman"),
        ("Lebanon", "🇱🇧", "Beirut"), ("Bahrain", "🇧🇭", "Manama"),
        ("Oman", "🇴🇲", "Muscat"),
    ],
    "Asia-Pacific": [
        ("China", "🇨🇳", "Guangzhou"), ("China", "🇨🇳", "Shanghai"),
        ("Japan", "🇯🇵", "Tokyo"), ("Japan", "🇯🇵", "Osaka"),
        ("India", "🇮🇳", "Delhi"), ("India", "🇮🇳", "Bangalore"),
        ("India", "🇮🇳", "Chennai"), ("South Korea", "🇰🇷", "Busan"),
        ("Australia", "🇦🇺", "Melbourne"), ("Australia", "🇦🇺", "Brisbane"),
        ("Indonesia", "🇮🇩", "Surabaya"), ("Philippines", "🇵🇭", "Cebu"),
        ("Vietnam", "🇻🇳", "Hanoi"), ("Thailand", "🇹🇭", "Bangkok"),
        ("Thailand", "🇹🇭", "Chiang Mai"), ("Singapore", "🇸🇬", "Singapore"),
        ("Pakistan", "🇵🇰", "Karachi"), ("Bangladesh", "🇧🇩", "Dhaka"),
        ("New Zealand", "🇳🇿", "Auckland"), ("Taiwan", "🇹🇼", "Taipei"),
        ("Hong Kong", "🇭🇰", "Hong Kong"), ("Sri Lanka", "🇱🇰", "Colombo"),
        ("Malaysia", "🇲🇾", "Penang"), ("Myanmar", "🇲🇲", "Yangon"),
    ],
}

# 18 categories matching existing listings exactly
CATEGORIES = [
    "Wholesale & Manufacturing", "Real Estate", "Food & Restaurants",
    "Import/Export", "Education & Training", "Energy & Resources",
    "Automotive", "Finance & Investment", "Fashion & Apparel",
    "Tech & Software", "Beauty & Health", "Construction",
    "Travel & Tourism", "Agriculture & Farming", "Business Services",
    "Retail & Shopping", "Entertainment & Media", "Dating & Relationships",
]

# Per-category business name fragments and description templates
TEMPLATES = {
    "Wholesale & Manufacturing": [
        ("{city} Industrial Co.", "Contract manufacturer serving global brands. ISO 9001 certified. MOQ from 500 units. OEM/ODM capable. Ships to 40+ countries.", ["OEM", "ISO 9001", "Wholesale"]),
        ("{city} Sourcing Group", "Full-service sourcing and supplier vetting across {country} and regional partners. Quality inspection on every shipment.", ["Sourcing", "QC", "B2B"]),
        ("Prime {city} Factory Direct", "Direct-from-factory wholesale pricing on consumer electronics, appliances, and household goods. Container loads available.", ["Factory Direct", "Electronics", "Container"]),
    ],
    "Real Estate": [
        ("{city} Realty Partners", "Full-service brokerage: residential, commercial, and land. Licensed agents, multilingual team. Trusted by local and diaspora investors.", ["Residential", "Commercial", "Diaspora"]),
        ("{city} Property Management", "Professional property management for owners and absentee landlords. Tenant screening, maintenance, 24/7 reporting.", ["Management", "Rentals", "Investor"]),
        ("Gateway {city} Homes", "Boutique real estate advisory serving high-net-worth clients. Off-market deals, new developments, investment strategy.", ["HNW", "Off-market", "Advisory"]),
    ],
    "Food & Restaurants": [
        ("{city} Bites", "Authentic regional cuisine with a modern twist. Dine-in, delivery, corporate catering. Featured in local press multiple years.", ["Catering", "Restaurant", "Dine-in"]),
        ("{city} Organic Market", "Certified organic grocer and meal-prep subscription service. Partnered with local farms. Weekly produce boxes.", ["Organic", "Farm-to-table", "Subscription"]),
        ("Street {city} Kitchen", "Street-food empire with 6 locations and growing. Franchise opportunities open for qualified operators.", ["Franchise", "Street Food", "Growth"]),
    ],
    "Import/Export": [
        ("{city} Global Trade", "End-to-end import/export services: customs brokerage, freight forwarding, trade finance. Licensed and bonded.", ["Customs", "Freight", "Bonded"]),
        ("{city} Commodity Traders", "Licensed commodity traders specializing in grains, coffee, and metals. FX-hedged contracts. Serving industrial buyers.", ["Commodities", "FX-hedged", "B2B"]),
    ],
    "Education & Training": [
        ("{city} Online Academy", "Online professional certificates in business, AI, and trades. Industry-recognized credentials. Pay-what-you-can tier.", ["Online", "Certificates", "Affordable"]),
        ("{city} Skills Institute", "In-person and hybrid vocational training. Graduates placed with 120+ employer partners. Government-subsidized options.", ["Vocational", "Placement", "Subsidized"]),
    ],
    "Energy & Resources": [
        ("{city} Solar Systems", "Residential and commercial solar installation. Financing available. Off-grid and grid-tied solutions.", ["Solar", "Residential", "Financing"]),
        ("{city} Green Energy", "Renewable energy advisory and project development. Wind, solar, hydro. Partner with utilities and independent producers.", ["Renewables", "Utilities", "Development"]),
    ],
    "Automotive": [
        ("{city} Auto Group", "New and certified pre-owned vehicles. Service center with factory-trained technicians. Fleet sales division.", ["New", "CPO", "Fleet"]),
        ("{city} Parts Supply", "Aftermarket parts wholesaler. Nationwide same-day shipping. B2B accounts with extended credit terms.", ["Aftermarket", "B2B", "Same-day"]),
    ],
    "Finance & Investment": [
        ("{city} Capital Advisors", "Wealth management and corporate advisory for founders, operators, and family offices. Independent and fiduciary.", ["Wealth", "Fiduciary", "Advisory"]),
        ("{city} Fintech Solutions", "Payment infrastructure and lending platform for SMEs. API-first, PCI-DSS compliant. Serving 12,000+ businesses.", ["Payments", "SME", "API"]),
    ],
    "Fashion & Apparel": [
        ("{city} Apparel House", "Private-label clothing manufacturer. Full-package production from design to delivery. MOQ 300 units per style.", ["Private Label", "OEM", "300 MOQ"]),
        ("{city} Boutique Collective", "Multi-brand boutique featuring local designers. E-commerce plus flagship store. Wholesale accounts open.", ["Designers", "Multi-brand", "Wholesale"]),
    ],
    "Tech & Software": [
        ("{city} Dev Studio", "Mobile and web development agency. React, React Native, Node.js, Python. Agile sprints, transparent pricing.", ["Mobile", "Web", "Agile"]),
        ("{city} AI Labs", "Applied AI consulting for enterprises. LLM integration, custom model training, production deployment. US-based engineering leads.", ["AI", "LLM", "Enterprise"]),
        ("{city} CloudOps", "DevOps and cloud-infrastructure consultancy. AWS, GCP, Azure certified engineers. 24/7 SRE support tier.", ["DevOps", "SRE", "Multi-cloud"]),
    ],
    "Beauty & Health": [
        ("{city} Wellness Clinic", "Integrative health clinic: functional medicine, aesthetics, wellness coaching. Telehealth available.", ["Functional", "Aesthetics", "Telehealth"]),
        ("{city} Beauty Distributors", "B2B distributor of professional beauty brands. Stocking 400+ SKUs. Salon accounts welcome.", ["B2B", "Salon", "Professional"]),
    ],
    "Construction": [
        ("{city} Build Group", "General contractor for residential, commercial, and public-sector projects. Bonded and insured to $20M per project.", ["General Contractor", "Bonded", "Commercial"]),
        ("{city} Design & Build", "Design-build firm specializing in boutique hotels, restaurants, and mid-rise residential. Award-winning team.", ["Design-Build", "Hospitality", "Award-winning"]),
    ],
    "Travel & Tourism": [
        ("{city} Adventures", "Experiential travel operator: small-group tours, cultural immersion, adventure itineraries. Eco-certified.", ["Small Group", "Culture", "Eco"]),
        ("{city} Concierge Travel", "Luxury travel concierge for honeymoons, milestone trips, and private group travel. Virtuoso affiliated.", ["Luxury", "Virtuoso", "Concierge"]),
    ],
    "Agriculture & Farming": [
        ("{city} Agri Cooperative", "Farmer-owned cooperative supplying grains, coffee, and specialty crops to domestic and export buyers. Fair-trade certified.", ["Fair Trade", "Cooperative", "Export"]),
        ("{city} Fresh Produce", "Direct-from-farm fruit and vegetable wholesaler. Cold chain logistics. Retail and HORECA accounts.", ["Cold Chain", "Wholesale", "HORECA"]),
    ],
    "Business Services": [
        ("{city} Legal Group", "Corporate law firm: entity formation, contracts, M&A, dispute resolution. Multilingual attorneys. Fixed-fee packages available.", ["Corporate", "M&A", "Fixed-fee"]),
        ("{city} Accounting Partners", "Bookkeeping, tax, and CFO services for SMEs. Cloud-based workflow via QuickBooks and Xero. Monthly retainers.", ["Bookkeeping", "Tax", "CFO"]),
        ("{city} HR Consultants", "End-to-end HR services for growing businesses: recruiting, payroll, compliance, culture. 15+ years experience.", ["HR", "Recruiting", "Compliance"]),
    ],
    "Retail & Shopping": [
        ("{city} Marketplace", "Omnichannel retailer: brick-and-mortar, e-commerce, and social commerce. Specializing in household and lifestyle goods.", ["Omnichannel", "Lifestyle", "Retail"]),
        ("{city} Specialty Store", "Curated specialty retail serving locals and visitors. Strong Instagram following. Private label merchandise available.", ["Specialty", "Curated", "Private Label"]),
    ],
    "Entertainment & Media": [
        ("{city} Productions", "Full-service video production: commercials, documentaries, corporate films. Own equipment, 4K/8K capable.", ["Production", "4K", "Commercial"]),
        ("{city} Media Agency", "Integrated media buying and creative agency. Digital, OOH, print, influencer. Data-driven campaign measurement.", ["Media Buying", "Digital", "Creative"]),
    ],
    "Dating & Relationships": [
        ("{city} Matchmakers", "Professional matchmaking service for busy professionals. Hand-vetted introductions. Confidential and thorough.", ["Matchmaking", "Professional", "Confidential"]),
        ("{city} Relationship Coaching", "Certified coaches for singles, couples, and blended families. In-person and virtual. Sliding-scale options.", ["Coaching", "Couples", "Virtual"]),
    ],
}

CONTACT_PATTERNS = {
    "United States": ("@{slug}.com", "+1-212-555-{n:04d}"),
    "Canada": ("@{slug}.ca", "+1-416-555-{n:04d}"),
    "Mexico": ("@{slug}.mx", "+52-55-{n:04d}-{m:04d}"),
    "Brazil": ("@{slug}.com.br", "+55-11-{n:04d}-{m:04d}"),
    "Argentina": ("@{slug}.com.ar", "+54-11-{n:04d}-{m:04d}"),
    "Colombia": ("@{slug}.com.co", "+57-1-{n:03d}-{m:04d}"),
    "Chile": ("@{slug}.cl", "+56-2-{n:04d}-{m:04d}"),
    "Peru": ("@{slug}.pe", "+51-1-{n:03d}-{m:04d}"),
    "Ecuador": ("@{slug}.ec", "+593-2-{n:04d}-{m:03d}"),
    "Dominican Republic": ("@{slug}.do", "+1-809-555-{n:04d}"),
    "Guatemala": ("@{slug}.com.gt", "+502-2{n:03d}-{m:04d}"),
    "Cuba": ("@{slug}.cu", "+53-7-{n:03d}-{m:04d}"),
    "Jamaica": ("@{slug}.com.jm", "+1-876-555-{n:04d}"),
    "Uruguay": ("@{slug}.com.uy", "+598-2-{n:03d}-{m:04d}"),
    "Panama": ("@{slug}.com.pa", "+507-{n:03d}-{m:04d}"),
    "United Kingdom": ("@{slug}.co.uk", "+44-20-{n:04d}-{m:04d}"),
    "Germany": ("@{slug}.de", "+49-30-{n:04d}-{m:04d}"),
    "Spain": ("@{slug}.es", "+34-91-{n:03d}-{m:04d}"),
    "Italy": ("@{slug}.it", "+39-02-{n:04d}-{m:04d}"),
    "Netherlands": ("@{slug}.nl", "+31-20-{n:03d}-{m:04d}"),
    "Portugal": ("@{slug}.pt", "+351-21-{n:03d}-{m:04d}"),
    "Sweden": ("@{slug}.se", "+46-8-{n:03d}-{m:04d}"),
    "Poland": ("@{slug}.pl", "+48-22-{n:03d}-{m:04d}"),
    "Switzerland": ("@{slug}.ch", "+41-44-{n:03d}-{m:04d}"),
    "Belgium": ("@{slug}.be", "+32-2-{n:03d}-{m:04d}"),
    "Norway": ("@{slug}.no", "+47-22-{n:02d}-{m:04d}"),
    "Denmark": ("@{slug}.dk", "+45-{n:02d}-{m:06d}"),
    "Greece": ("@{slug}.gr", "+30-21-{n:03d}-{m:04d}"),
    "Ireland": ("@{slug}.ie", "+353-1-{n:03d}-{m:04d}"),
    "Czech Republic": ("@{slug}.cz", "+420-2-{n:04d}-{m:04d}"),
    "Romania": ("@{slug}.ro", "+40-21-{n:03d}-{m:04d}"),
    "Nigeria": ("@{slug}.ng", "+234-1-{n:03d}-{m:04d}"),
    "South Africa": ("@{slug}.co.za", "+27-11-{n:03d}-{m:04d}"),
    "Kenya": ("@{slug}.co.ke", "+254-20-{n:03d}-{m:04d}"),
    "Ethiopia": ("@{slug}.et", "+251-11-{n:03d}-{m:04d}"),
    "Ghana": ("@{slug}.com.gh", "+233-30-{n:03d}-{m:04d}"),
    "Tanzania": ("@{slug}.co.tz", "+255-22-{n:03d}-{m:04d}"),
    "Egypt": ("@{slug}.com.eg", "+20-2-{n:04d}-{m:04d}"),
    "Morocco": ("@{slug}.ma", "+212-5-{n:03d}-{m:04d}"),
    "Uganda": ("@{slug}.ug", "+256-41-{n:03d}-{m:04d}"),
    "Algeria": ("@{slug}.dz", "+213-21-{n:02d}-{m:04d}"),
    "Tunisia": ("@{slug}.tn", "+216-71-{n:03d}-{m:04d}"),
    "Senegal": ("@{slug}.sn", "+221-33-{n:03d}-{m:04d}"),
    "Cameroon": ("@{slug}.cm", "+237-2-{n:04d}-{m:04d}"),
    "Ivory Coast": ("@{slug}.ci", "+225-{n:02d}-{m:06d}"),
    "Rwanda": ("@{slug}.rw", "+250-7{n:02d}-{m:06d}"),
    "Zambia": ("@{slug}.co.zm", "+260-21-{n:03d}-{m:04d}"),
    "Zimbabwe": ("@{slug}.co.zw", "+263-242-{n:03d}-{m:04d}"),
    "Angola": ("@{slug}.ao", "+244-2-{n:04d}-{m:04d}"),
    "Mozambique": ("@{slug}.co.mz", "+258-21-{n:03d}-{m:04d}"),
    "Madagascar": ("@{slug}.mg", "+261-20-{n:03d}-{m:04d}"),
    "Mali": ("@{slug}.ml", "+223-20-{n:02d}-{m:04d}"),
    "Saudi Arabia": ("@{slug}.sa", "+966-11-{n:03d}-{m:04d}"),
    "UAE": ("@{slug}.ae", "+971-4-{n:03d}-{m:04d}"),
    "Turkey": ("@{slug}.com.tr", "+90-212-{n:03d}-{m:04d}"),
    "Israel": ("@{slug}.co.il", "+972-3-{n:03d}-{m:04d}"),
    "Qatar": ("@{slug}.qa", "+974-4{n:03d}-{m:04d}"),
    "Kuwait": ("@{slug}.com.kw", "+965-2{n:03d}-{m:04d}"),
    "Jordan": ("@{slug}.jo", "+962-6-{n:03d}-{m:04d}"),
    "Lebanon": ("@{slug}.com.lb", "+961-1-{n:03d}-{m:03d}"),
    "Bahrain": ("@{slug}.bh", "+973-{n:04d}-{m:04d}"),
    "Oman": ("@{slug}.om", "+968-2{n:03d}-{m:04d}"),
    "China": ("@{slug}.cn", "+86-{n:03d}-{m:04d}-{m:04d}"),
    "Japan": ("@{slug}.jp", "+81-3-{n:04d}-{m:04d}"),
    "India": ("@{slug}.in", "+91-{n:03d}-{m:04d}-{m:04d}"),
    "South Korea": ("@{slug}.kr", "+82-2-{n:04d}-{m:04d}"),
    "Australia": ("@{slug}.com.au", "+61-{n:01d}-{m:04d}-{m:04d}"),
    "Indonesia": ("@{slug}.co.id", "+62-21-{n:03d}-{m:04d}"),
    "Philippines": ("@{slug}.ph", "+63-2-{n:03d}-{m:04d}"),
    "Vietnam": ("@{slug}.vn", "+84-28-{n:03d}-{m:04d}"),
    "Thailand": ("@{slug}.co.th", "+66-2-{n:03d}-{m:04d}"),
    "Singapore": ("@{slug}.sg", "+65-{n:04d}-{m:04d}"),
    "Pakistan": ("@{slug}.pk", "+92-21-{n:03d}-{m:04d}"),
    "Bangladesh": ("@{slug}.com.bd", "+880-2-{n:04d}-{m:04d}"),
    "New Zealand": ("@{slug}.co.nz", "+64-9-{n:03d}-{m:04d}"),
    "Taiwan": ("@{slug}.tw", "+886-2-{n:04d}-{m:04d}"),
    "Hong Kong": ("@{slug}.hk", "+852-{n:04d}-{m:04d}"),
    "Sri Lanka": ("@{slug}.lk", "+94-11-{n:03d}-{m:04d}"),
    "Malaysia": ("@{slug}.com.my", "+60-3-{n:04d}-{m:04d}"),
    "Myanmar": ("@{slug}.com.mm", "+95-1-{n:03d}-{m:04d}"),
}

def slugify(s):
    return "".join(c.lower() if c.isalnum() else "" for c in s.replace(" ", ""))

def generate_listings(start_id, count):
    # Target distribution by region
    region_targets = {
        "Africa": 25, "Asia-Pacific": 22, "Americas": 20,
        "Europe": 18, "Middle East": 15,
    }
    # Adjust so total == count
    total = sum(region_targets.values())
    assert total == count, f"region totals {total} != {count}"

    listings = []
    current_id = start_id
    base_date = date(2026, 4, 1)

    # Category rotation to spread evenly
    cat_index = 0

    for region, n in region_targets.items():
        pool = CITIES[region][:]
        # Over-sample cities so we get variety
        chosen = []
        for _ in range(n):
            chosen.append(random.choice(pool))

        for country, flag, city in chosen:
            cat = CATEGORIES[cat_index % len(CATEGORIES)]
            cat_index += 1
            tpl_choices = TEMPLATES.get(cat, [])
            if not tpl_choices:
                continue
            name_tpl, desc_tpl, tags = random.choice(tpl_choices)
            name = name_tpl.format(city=city, country=country)
            description = desc_tpl.format(city=city, country=country)

            slug = slugify(name)[:24]
            email_fmt, phone_fmt = CONTACT_PATTERNS.get(country, ("@{slug}.com", "+000-{n:04d}-{m:04d}"))
            email = ("info" + email_fmt).format(slug=slug)
            phone = phone_fmt.format(n=random.randint(10, 999), m=random.randint(1000, 9999))

            featured = random.random() < 0.22  # ~22% featured
            listed = base_date + timedelta(days=random.randint(-60, 25))

            social = {}
            if random.random() < 0.9:
                social["linkedin"] = "#"
            if random.random() < 0.5:
                social["instagram"] = "#"
            if random.random() < 0.3:
                social["facebook"] = "#"

            listings.append({
                "id": current_id,
                "name": name,
                "country": country,
                "flag": flag,
                "category": cat,
                "description": description,
                "city": city,
                "featured": featured,
                "logo": None,
                "contact": email,
                "phone": phone,
                "website": f"https://{slug}.example",
                "social": social,
                "tags": tags[:3],
                "listed": listed.isoformat(),
            })
            current_id += 1

    return listings


def main():
    existing = json.loads(TARGET.read_text())
    assert len(existing) == 20, f"expected 20 existing listings, found {len(existing)}"
    max_id = max(l["id"] for l in existing)

    new_ones = generate_listings(start_id=max_id + 1, count=100)
    combined = existing + new_ones
    TARGET.write_text(json.dumps(combined, indent=2, ensure_ascii=False))

    print(f"✓ Listings: {len(existing)} -> {len(combined)}")
    from collections import Counter
    print(f"  Featured: {sum(1 for l in combined if l['featured'])}/{len(combined)}")
    print(f"  Countries covered: {len(set(l['country'] for l in combined))}")
    print(f"  Categories: {len(set(l['category'] for l in combined))}")
    print()
    print("Top 10 countries by listing count:")
    for country, n in Counter(l["country"] for l in combined).most_common(10):
        print(f"  {n:3d}  {country}")


if __name__ == "__main__":
    main()

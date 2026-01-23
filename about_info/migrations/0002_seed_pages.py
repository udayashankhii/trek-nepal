from django.db import migrations


def seed_about_pages(apps, schema_editor):
    AboutPage = apps.get_model("about_info", "AboutPage")

    pages = [
        {
            "slug": "about-us",
            "title": "About EverTrek Nepal",
            "subtitle": "Local experts delivering premium Himalayan journeys.",
            "summary": "EverTrek Nepal is a local, expert-led trekking company delivering premium Himalayan adventures with safety, sustainability, and cultural depth.",
            "hero_image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "hero_badge": "About EverTrek Nepal",
            "blocks": [
                {
                    "type": "stats",
                    "items": [
                        {"value": "10K+", "label": "Travelers guided since 2010"},
                        {"value": "98%", "label": "Guest satisfaction rating"},
                        {"value": "100%", "label": "Locally led teams"},
                    ],
                },
                {
                    "type": "content",
                    "heading": "Our story",
                    "body": [
                        "EverTrek Nepal was founded by Rajib Adhikari and Udaya Shankhi after years of exploring the Himalayas in their free time. They left corporate careers to build a travel company rooted in local leadership and meticulous planning.",
                        "Today our team designs itineraries that balance iconic highlights with quieter, community-led experiences. Every trip is supported by certified guides, altitude-aware operations, and a dedicated support desk in Kathmandu.",
                    ],
                },
                {
                    "type": "feature_grid",
                    "heading": "The EverTrek standard",
                    "description": "Premium journeys engineered around safety, comfort, and cultural access.",
                    "items": [
                        {
                            "title": "Local, certified guides",
                            "text": "Guides trained in first aid, altitude response, and cultural interpretation.",
                        },
                        {
                            "title": "Curated routes",
                            "text": "Balanced itineraries blending iconic summits with authentic village life.",
                        },
                        {
                            "title": "Operational excellence",
                            "text": "Dedicated logistics team managing permits, transfers, and contingency plans.",
                        },
                        {
                            "title": "Responsible travel",
                            "text": "Community partnerships, fair wages, and leave-no-trace practices.",
                        },
                    ],
                },
                {
                    "type": "team",
                    "heading": "Leadership",
                    "description": "Meet the people behind each expedition.",
                    "items": [
                        {
                            "name": "Rajib Adhikari",
                            "role": "Co-Founder & Adventure Lead",
                            "image": "/rajib.jpg",
                        },
                        {
                            "name": "Udaya Shankhi",
                            "role": "Co-Founder & Operations Director",
                            "image": "/udaya.jpg",
                        },
                        {
                            "name": "Pasang Sherpa",
                            "role": "Lead Mountain Guide",
                            "image": "/images/team_pasang.jpg",
                        },
                    ],
                },
                {
                    "type": "cta",
                    "heading": "Ready to explore the Himalayas?",
                    "body": "Tell us your goals and we will design a trek or cultural tour tailored to your pace, comfort, and season.",
                    "primary": {"label": "Talk to our planners", "url": "/contact-us"},
                    "secondary": {"label": "View trekking packages", "url": "/trekking-in-nepal"},
                },
            ],
            "meta_title": "About Us | EverTrek Nepal",
            "meta_description": "Meet the local experts behind EverTrek Nepal and discover our mission, values, and impact across the Himalayas.",
            "meta_keywords": ["EverTrek Nepal", "Himalayan trekking", "local guides"],
            "og_image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "order": 1,
        },
        {
            "slug": "how-to-make-a-payment",
            "title": "How to Make a Payment",
            "subtitle": "Secure payment options with instant confirmation.",
            "summary": "Pay securely using cards, bank transfer, mobile wallets, or cash on arrival.",
            "hero_image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "hero_badge": "Payments",
            "blocks": [
                {
                    "type": "feature_grid",
                    "heading": "Payment methods",
                    "items": [
                        {
                            "title": "International cards",
                            "text": "Visa, MasterCard, and American Express with bank-grade security.",
                        },
                        {
                            "title": "Bank transfer",
                            "text": "Swift and local transfers through leading Nepali banks.",
                        },
                        {
                            "title": "Mobile wallets",
                            "text": "eSewa, Khalti, IME Pay, and QR payments where supported.",
                        },
                        {
                            "title": "Cash on arrival",
                            "text": "Pay in person at our Kathmandu office on arrival.",
                        },
                    ],
                },
                {
                    "type": "steps",
                    "heading": "Payment flow",
                    "items": [
                        {
                            "step": "01",
                            "title": "Choose your trip",
                            "description": "Select your trek, dates, and group size. We confirm availability.",
                        },
                        {
                            "step": "02",
                            "title": "Share traveler details",
                            "description": "Provide traveler names, passport details, and emergency contacts.",
                        },
                        {
                            "step": "03",
                            "title": "Select payment method",
                            "description": "Pick card, transfer, wallet, or cash on arrival.",
                        },
                        {
                            "step": "04",
                            "title": "Complete secure checkout",
                            "description": "Payments are encrypted and processed via PCI-compliant gateways.",
                        },
                        {
                            "step": "05",
                            "title": "Receive confirmation",
                            "description": "Instant email confirmation and receipt.",
                        },
                    ],
                },
                {
                    "type": "cta",
                    "heading": "Need payment help?",
                    "body": "Our team responds quickly with guidance on invoices, transfers, and receipts.",
                    "primary": {"label": "Contact support", "url": "/contact-us"},
                    "secondary": {"label": "Payment FAQs", "url": "/travel-info/faqs"},
                },
            ],
            "meta_title": "How to Make a Payment | EverTrek Nepal",
            "meta_description": "Secure payment options for EverTrek Nepal - cards, bank transfer, mobile wallets, or cash on arrival.",
            "meta_keywords": ["EverTrek Nepal payments", "trek payment", "secure checkout"],
            "og_image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "order": 2,
        },
        {
            "slug": "legal-documents",
            "title": "Legal Documents",
            "subtitle": "Registrations, licenses, and certifications.",
            "summary": "Verified registrations and licenses that confirm our status as a trusted Nepal trekking operator.",
            "hero_image_url": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
            "hero_badge": "Compliance",
            "blocks": [
                {
                    "type": "documents",
                    "heading": "Documents",
                    "items": [
                        {
                            "title": "Company Registration Certificate",
                            "image": "/docs/company-registration.jpg",
                        },
                        {
                            "title": "PAN Registration Certificate",
                            "image": "/docs/pan-registration.jpg",
                        },
                        {
                            "title": "Tourism Department License",
                            "image": "/docs/tourism-license.jpg",
                        },
                        {
                            "title": "Foreign Exchange Certificate",
                            "image": "/docs/foreign-exchange.jpg",
                        },
                        {
                            "title": "TAAN Membership Certificate",
                            "image": "/docs/taan-certificate.jpg",
                        },
                        {
                            "title": "NMA Membership Certificate",
                            "image": "/docs/nma-certificate.jpg",
                        },
                    ],
                },
                {
                    "type": "cta",
                    "heading": "Questions about compliance?",
                    "body": "Reach out to our legal team for verification details.",
                    "primary": {"label": "Email legal team", "url": "mailto:legal@evertreknepal.com"},
                },
            ],
            "meta_title": "Legal Documents | EverTrek Nepal",
            "meta_description": "Official registrations, licenses, and certificates for EverTrek Nepal.",
            "meta_keywords": ["EverTrek Nepal legal", "tourism license Nepal"],
            "og_image_url": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
            "order": 3,
        },
        {
            "slug": "privacy-policy",
            "title": "Privacy Policy",
            "subtitle": "How we protect your data and privacy.",
            "summary": "Learn how EverTrek Nepal collects, uses, and safeguards personal information.",
            "hero_image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "hero_badge": "Legal",
            "blocks": [
                {
                    "type": "policy",
                    "heading": "Privacy policy overview",
                    "items": [
                        {
                            "title": "Information we collect",
                            "bullets": [
                                "Identity details for permits and compliance.",
                                "Contact details for confirmations and updates.",
                                "Booking details to tailor your itinerary.",
                                "Payment confirmations via PCI-compliant gateways.",
                                "Optional preferences for marketing and surveys.",
                            ],
                        },
                        {
                            "title": "Security of information",
                            "bullets": [
                                "SSL/TLS encryption across all data transfers.",
                                "Role-based access controls for staff.",
                                "Regular audits, backups, and incident response plans.",
                            ],
                        },
                        {
                            "title": "Cookies and analytics",
                            "bullets": [
                                "Essential cookies for authentication and security.",
                                "Analytics cookies for site performance.",
                                "Marketing cookies only with consent where applicable.",
                            ],
                        },
                    ],
                },
                {
                    "type": "cta",
                    "heading": "Privacy questions?",
                    "body": "Contact our Data Protection Officer for requests or clarifications.",
                    "primary": {"label": "privacy@evertreknepal.com", "url": "mailto:privacy@evertreknepal.com"},
                },
            ],
            "meta_title": "Privacy Policy | EverTrek Nepal",
            "meta_description": "How EverTrek Nepal collects, uses, and protects your personal information.",
            "meta_keywords": ["EverTrek Nepal privacy", "data protection"],
            "og_image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "order": 4,
        },
        {
            "slug": "our-team",
            "title": "Our Team",
            "subtitle": "Local experts and guides behind every expedition.",
            "summary": "Meet the local experts, guides, and operations team behind EverTrek Nepal.",
            "hero_image_url": "/guide.jpg",
            "hero_badge": "Leadership",
            "blocks": [
                {
                    "type": "team",
                    "heading": "Leadership & guides",
                    "items": [
                        {"name": "Rajib Adhikari", "role": "Co-Founder & Adventure Lead", "image": "/rajib.jpg"},
                        {"name": "Udaya Shankhi", "role": "Co-Founder & Operations Director", "image": "/udaya.jpg"},
                        {"name": "Pasang Sherpa", "role": "Lead Mountain Guide", "image": "/images/team_pasang.jpg"},
                        {"name": "Pema Gurung", "role": "Culture & Community Guide", "image": "/images/team_pema.jpg"},
                        {"name": "Sunita Lama", "role": "Safety & Sustainability Officer", "image": "/images/team_sunita.jpg"},
                        {"name": "Arjun Thapa", "role": "Guest Experience Manager", "image": "/images/team_arjun.jpg"},
                    ],
                },
                {
                    "type": "cta",
                    "heading": "Ready to meet the team?",
                    "body": "Reach out to our Kathmandu office for a tailored itinerary and direct access to our expert guides.",
                    "primary": {"label": "Contact our team", "url": "/contact-us"},
                },
            ],
            "meta_title": "Our Team | EverTrek Nepal",
            "meta_description": "Meet the local experts and guides behind EverTrek Nepal.",
            "meta_keywords": ["EverTrek Nepal team", "local guides Nepal"],
            "og_image_url": "/guide.jpg",
            "order": 5,
        },
    ]

    for page in pages:
        AboutPage.objects.update_or_create(slug=page["slug"], defaults=page)


def unseed_about_pages(apps, schema_editor):
    AboutPage = apps.get_model("about_info", "AboutPage")
    AboutPage.objects.filter(
        slug__in=[
            "about-us",
            "how-to-make-a-payment",
            "legal-documents",
            "privacy-policy",
            "our-team",
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [("about_info", "0001_initial")]

    operations = [migrations.RunPython(seed_about_pages, reverse_code=unseed_about_pages)]

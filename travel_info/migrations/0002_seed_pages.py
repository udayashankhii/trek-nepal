from django.db import migrations


def seed_travel_info(apps, schema_editor):
    TravelInfoPage = apps.get_model("travel_info", "TravelInfoPage")

    pages = [
        {
            "slug": "visa-information",
            "title": "Visa Information",
            "subtitle": "Entry requirements, fees, and official processes for Nepal.",
            "summary": "Clear, up-to-date visa guidance so you can arrive prepared and avoid delays at entry.",
            "hero_image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "highlights": [
                "Visa on arrival eligibility",
                "Online application steps",
                "Entry points and documentation",
            ],
            "sections": [
                {
                    "heading": "Visa on Arrival",
                    "body": "Most travelers can obtain a visa on arrival at Tribhuvan International Airport and select land borders. Bring a passport valid for six months and a passport photo.",
                    "bullets": [
                        "Complete arrival form or use the online pre‑arrival form",
                        "Carry cash in USD for visa fees",
                        "Keep a printed confirmation if you apply online",
                    ],
                },
                {
                    "heading": "Tourist Visa Fees",
                    "body": "Standard tourist visas are issued for 15, 30, or 90 days. Fees are fixed by the Nepal Immigration Department.",
                    "cards": [
                        {"title": "15 Days", "description": "USD 30"},
                        {"title": "30 Days", "description": "USD 50"},
                        {"title": "90 Days", "description": "USD 125"},
                    ],
                },
                {
                    "heading": "Required Documents",
                    "body": "Bring original documents for immigration checks.",
                    "bullets": [
                        "Passport with 6+ months validity",
                        "Recent passport photo",
                        "Completed arrival card",
                        "Proof of onward travel (recommended)",
                    ],
                },
            ],
            "tips": [
                {
                    "title": "Pre‑arrival form",
                    "description": "Complete the official online form within 15 days of arrival to speed up processing.",
                },
                {
                    "title": "Keep USD cash",
                    "description": "Visa fees are easiest to pay in clean USD notes.",
                },
            ],
            "faqs": [
                {
                    "question": "Can I extend my tourist visa?",
                    "answer": "Yes. Extensions are available at the Immigration Office in Kathmandu or Pokhara.",
                },
                {
                    "question": "Do I need a visa for a short transit?",
                    "answer": "A 24‑hour transit visa is available for USD 5 for quick stopovers.",
                },
            ],
            "meta_title": "Nepal Visa Information | Evertrek Nepal",
            "meta_description": "Nepal visa requirements, fees, entry points, and documents for a smooth arrival.",
            "meta_keywords": ["Nepal visa", "visa on arrival", "Nepal immigration", "tourist visa"],
            "og_image_url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
            "order": 1,
        },
        {
            "slug": "health-safety",
            "title": "Health & Safety",
            "subtitle": "Medical preparation, altitude guidance, and on‑ground safety tips.",
            "summary": "Practical health guidance and safety considerations for trekking and touring in Nepal.",
            "hero_image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "highlights": ["Altitude awareness", "Emergency contacts", "Travel insurance basics"],
            "sections": [
                {
                    "heading": "Altitude Safety",
                    "body": "Ascend gradually, stay hydrated, and recognize early symptoms of altitude sickness.",
                    "bullets": [
                        "Follow acclimatization days on treks",
                        "Avoid alcohol at altitude",
                        "Inform your guide if symptoms appear",
                    ],
                },
                {
                    "heading": "Insurance & Evacuation",
                    "body": "Confirm your policy covers high‑altitude trekking and helicopter evacuation.",
                    "bullets": [
                        "Carry your policy details",
                        "Share emergency numbers with your group",
                    ],
                },
            ],
            "tips": [
                {
                    "title": "Hydration",
                    "description": "Drink 3–4 liters of water daily on trekking routes.",
                },
                {
                    "title": "Medication",
                    "description": "Carry essential prescriptions and basic first‑aid supplies.",
                },
            ],
            "faqs": [
                {
                    "question": "Is altitude sickness common?",
                    "answer": "It can occur above 2,500m. Prevention and slow ascent reduce risk significantly.",
                }
            ],
            "meta_title": "Health & Safety in Nepal | Evertrek Nepal",
            "meta_description": "Altitude, insurance, and medical tips to travel safely in Nepal.",
            "meta_keywords": ["Nepal health", "altitude sickness", "travel safety", "insurance"],
            "og_image_url": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
            "order": 2,
        },
        {
            "slug": "packing-list",
            "title": "Packing List",
            "subtitle": "Curated gear lists for tours and treks across Nepal.",
            "summary": "Pack light, smart, and season‑specific essentials for comfort and safety.",
            "hero_image_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
            "highlights": ["Seasonal gear", "Layering system", "What to leave behind"],
            "sections": [
                {
                    "heading": "Essentials",
                    "bullets": [
                        "Passport and copies",
                        "Waterproof daypack",
                        "Sun protection and sunglasses",
                    ],
                },
                {
                    "heading": "Trekking Layers",
                    "body": "Use a base layer, insulating mid‑layer, and a waterproof shell.",
                    "bullets": [
                        "Moisture‑wicking base layer",
                        "Down or fleece mid‑layer",
                        "Rain jacket and pants",
                    ],
                },
            ],
            "tips": [
                {
                    "title": "Pack light",
                    "description": "Stick to versatile pieces and quick‑dry fabrics.",
                }
            ],
            "faqs": [
                {
                    "question": "Can I rent gear in Nepal?",
                    "answer": "Yes, Kathmandu and Pokhara have plenty of rental shops for major items.",
                }
            ],
            "meta_title": "Nepal Packing List | Evertrek Nepal",
            "meta_description": "Essential packing checklist for Nepal tours and treks.",
            "meta_keywords": ["Nepal packing list", "trekking gear", "travel essentials"],
            "og_image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
            "order": 3,
        },
        {
            "slug": "transportation",
            "title": "Transportation",
            "subtitle": "Flights, tourist buses, private transfers, and local rides.",
            "summary": "Navigate Nepal smoothly with clear guidance on transport options.",
            "hero_image_url": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
            "highlights": ["Domestic flights", "Tourist buses", "Local transport tips"],
            "sections": [
                {
                    "heading": "Domestic Flights",
                    "body": "Best for long distances and mountain regions. Morning flights are most reliable.",
                    "bullets": [
                        "Bring a light jacket",
                        "Expect weather delays in monsoon",
                    ],
                },
                {
                    "heading": "Tourist Buses",
                    "body": "Comfortable and affordable for Kathmandu–Pokhara and other popular routes.",
                    "bullets": [
                        "Reserve seats in advance during peak season",
                        "Carry snacks and water",
                    ],
                },
            ],
            "tips": [
                {
                    "title": "Ride sharing",
                    "description": "Use Pathao or InDrive for safer city travel.",
                }
            ],
            "faqs": [
                {
                    "question": "Is night bus travel recommended?",
                    "answer": "We recommend daytime travel for safety and comfort.",
                }
            ],
            "meta_title": "Nepal Transportation Guide | Evertrek Nepal",
            "meta_description": "Transportation options in Nepal, including flights, buses, and local travel tips.",
            "meta_keywords": ["Nepal transport", "domestic flights", "tourist bus"],
            "og_image_url": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
            "order": 4,
        },
        {
            "slug": "faqs",
            "title": "Travel FAQs",
            "subtitle": "Expert answers to the questions travelers ask most.",
            "summary": "Quick, reliable answers for planning and travel in Nepal.",
            "hero_image_url": "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
            "highlights": ["Permits", "Best seasons", "Local customs"],
            "sections": [
                {
                    "heading": "Planning Essentials",
                    "body": "General guidance for timing, permits, and etiquette when visiting Nepal.",
                }
            ],
            "faqs": [
                {
                    "question": "What are the best trekking seasons?",
                    "answer": "Spring (Mar–May) and autumn (Sep–Nov) offer the best weather and visibility.",
                },
                {
                    "question": "Do I need trekking permits?",
                    "answer": "Yes. Popular regions require TIMS and national park permits.",
                },
                {
                    "question": "Is Nepal safe for solo travelers?",
                    "answer": "Yes, with standard travel precautions and reliable local support.",
                },
            ],
            "meta_title": "Nepal Travel FAQs | Evertrek Nepal",
            "meta_description": "Answers to the most common questions about traveling and trekking in Nepal.",
            "meta_keywords": ["Nepal travel FAQ", "permits", "trekking seasons"],
            "og_image_url": "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
            "order": 5,
        },
    ]

    for page in pages:
        TravelInfoPage.objects.update_or_create(slug=page["slug"], defaults=page)


def unseed_travel_info(apps, schema_editor):
    TravelInfoPage = apps.get_model("travel_info", "TravelInfoPage")
    TravelInfoPage.objects.filter(
        slug__in=[
            "visa-information",
            "health-safety",
            "packing-list",
            "transportation",
            "faqs",
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [("travel_info", "0001_initial")]

    operations = [migrations.RunPython(seed_travel_info, reverse_code=unseed_travel_info)]

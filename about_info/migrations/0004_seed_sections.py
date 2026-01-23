from django.db import migrations


def seed_sections(apps, schema_editor):
    AboutPage = apps.get_model("about_info", "AboutPage")
    AboutStat = apps.get_model("about_info", "AboutStat")
    AboutFeature = apps.get_model("about_info", "AboutFeature")
    AboutTeamMember = apps.get_model("about_info", "AboutTeamMember")
    AboutDocument = apps.get_model("about_info", "AboutDocument")
    AboutStep = apps.get_model("about_info", "AboutStep")
    AboutPolicySection = apps.get_model("about_info", "AboutPolicySection")
    AboutTestimonial = apps.get_model("about_info", "AboutTestimonial")
    AboutMilestone = apps.get_model("about_info", "AboutMilestone")
    AboutCTA = apps.get_model("about_info", "AboutCTA")

    def get_page(slug):
        return AboutPage.objects.filter(slug=slug).first()

    about = get_page("about-us")
    if about and not about.stats.exists():
        stats = [
            ("10K+", "Travelers guided since 2010"),
            ("98%", "Guest satisfaction rating"),
            ("100%", "Locally led teams"),
        ]
        for idx, (value, label) in enumerate(stats):
            AboutStat.objects.create(page=about, value=value, label=label, order=idx)

    if about and not about.features.exists():
        features = [
            ("Local, certified guides", "Guides trained in first aid, altitude response, and cultural interpretation."),
            ("Curated routes", "Balanced itineraries blending iconic summits with authentic village life."),
            ("Operational excellence", "Dedicated logistics team managing permits, transfers, and contingency plans."),
            ("Responsible travel", "Community partnerships, fair wages, and leave-no-trace practices."),
        ]
        for idx, (title, text) in enumerate(features):
            AboutFeature.objects.create(page=about, title=title, text=text, order=idx)

    if about and not about.team_members.exists():
        team = [
            ("Rajib Adhikari", "Co-Founder & Adventure Lead", "/rajib.jpg"),
            ("Udaya Shankhi", "Co-Founder & Operations Director", "/udaya.jpg"),
            ("Pasang Sherpa", "Lead Mountain Guide", "/images/team_pasang.jpg"),
            ("Pema Gurung", "Culture & Community Guide", "/images/team_pema.jpg"),
            ("Sunita Lama", "Safety & Sustainability Officer", "/images/team_sunita.jpg"),
            ("Arjun Thapa", "Guest Experience Manager", "/images/team_arjun.jpg"),
        ]
        for idx, (name, role, image) in enumerate(team):
            AboutTeamMember.objects.create(page=about, name=name, role=role, image=image, order=idx)

    if about and not about.milestones.exists():
        milestones = [
            ("2010", "Founded in Kathmandu with a vision for local-led trekking."),
            ("2015", "1,000+ trekkers guided through personal referrals."),
            ("2020", "Expanded to Bhutan and Tibet with curated cultural extensions."),
            ("2025", "10,000+ travelers and national recognition for eco-tourism leadership."),
        ]
        for idx, (year, description) in enumerate(milestones):
            AboutMilestone.objects.create(page=about, year=year, description=description, order=idx)

    if about and not about.testimonials.exists():
        testimonials = [
            ("The most professional team we have ever trekked with.", "Alice J.", "USA"),
            ("Impeccable logistics and real cultural insight.", "Mark T.", "UK"),
            ("Safety, kindness, and stunning routes.", "Priya S.", "India"),
        ]
        for idx, (quote, author, detail) in enumerate(testimonials):
            AboutTestimonial.objects.create(page=about, quote=quote, author=author, detail=detail, order=idx)

    if about and not about.ctas.exists():
        AboutCTA.objects.create(
            page=about,
            heading="Ready to explore the Himalayas?",
            body="Tell us your goals and we will design a trek or cultural tour tailored to your pace, comfort, and season.",
            primary_label="Talk to our planners",
            primary_url="/contact-us",
            secondary_label="View trekking packages",
            secondary_url="/trekking-in-nepal",
            order=0,
        )

    payments = get_page("how-to-make-a-payment")
    if payments and not payments.steps.exists():
        steps = [
            ("01", "Choose your trip", "Select your trek, dates, and group size. We confirm availability."),
            ("02", "Share traveler details", "Provide traveler names, passport details, and emergency contacts."),
            ("03", "Select payment method", "Pick card, transfer, wallet, or cash on arrival."),
            ("04", "Complete secure checkout", "Payments are encrypted and processed via PCI-compliant gateways."),
            ("05", "Receive confirmation", "Instant email confirmation and receipt."),
        ]
        for idx, (step, title, description) in enumerate(steps):
            AboutStep.objects.create(page=payments, step=step, title=title, description=description, order=idx)

    if payments and not payments.features.exists():
        methods = [
            ("International cards", "Visa, MasterCard, and American Express with bank-grade security."),
            ("Bank transfer", "Swift and local transfers through leading Nepali banks."),
            ("Mobile wallets", "eSewa, Khalti, IME Pay, and QR payments where supported."),
            ("Cash on arrival", "Pay in person at our Kathmandu office on arrival."),
        ]
        for idx, (title, text) in enumerate(methods):
            AboutFeature.objects.create(page=payments, title=title, text=text, order=idx)

    if payments and not payments.ctas.exists():
        AboutCTA.objects.create(
            page=payments,
            heading="Need payment help?",
            body="Our team responds quickly with guidance on invoices, transfers, and receipts.",
            primary_label="Contact support",
            primary_url="/contact-us",
            secondary_label="Payment FAQs",
            secondary_url="/travel-info/faqs",
            order=0,
        )

    legal = get_page("legal-documents")
    if legal and not legal.documents.exists():
        docs = [
            ("Company Registration Certificate", "/docs/company-registration.jpg"),
            ("PAN Registration Certificate", "/docs/pan-registration.jpg"),
            ("Tourism Department License", "/docs/tourism-license.jpg"),
            ("Foreign Exchange Certificate", "/docs/foreign-exchange.jpg"),
            ("TAAN Membership Certificate", "/docs/taan-certificate.jpg"),
            ("NMA Membership Certificate", "/docs/nma-certificate.jpg"),
        ]
        for idx, (title, image) in enumerate(docs):
            AboutDocument.objects.create(page=legal, title=title, image=image, order=idx)

    if legal and not legal.ctas.exists():
        AboutCTA.objects.create(
            page=legal,
            heading="Questions about compliance?",
            body="Reach out to our legal team for verification details.",
            primary_label="Email legal team",
            primary_url="mailto:legal@evertreknepal.com",
            order=0,
        )

    policy = get_page("privacy-policy")
    if policy and not policy.policy_sections.exists():
        sections = [
            (
                "Information we collect",
                [
                    "Identity details for permits and compliance.",
                    "Contact details for confirmations and updates.",
                    "Booking details to tailor your itinerary.",
                    "Payment confirmations via PCI-compliant gateways.",
                    "Optional preferences for marketing and surveys.",
                ],
            ),
            (
                "Security of information",
                [
                    "SSL/TLS encryption across all data transfers.",
                    "Role-based access controls for staff.",
                    "Regular audits, backups, and incident response plans.",
                ],
            ),
            (
                "Cookies and analytics",
                [
                    "Essential cookies for authentication and security.",
                    "Analytics cookies for site performance.",
                    "Marketing cookies only with consent where applicable.",
                ],
            ),
        ]
        for idx, (title, bullets) in enumerate(sections):
            AboutPolicySection.objects.create(page=policy, title=title, bullets=bullets, order=idx)

    if policy and not policy.ctas.exists():
        AboutCTA.objects.create(
            page=policy,
            heading="Privacy questions?",
            body="Contact our Data Protection Officer for requests or clarifications.",
            primary_label="privacy@evertreknepal.com",
            primary_url="mailto:privacy@evertreknepal.com",
            order=0,
        )

    team = get_page("our-team")
    if team and not team.team_members.exists():
        team_members = [
            ("Rajib Adhikari", "Co-Founder & Adventure Lead", "/rajib.jpg"),
            ("Udaya Shankhi", "Co-Founder & Operations Director", "/udaya.jpg"),
            ("Pasang Sherpa", "Lead Mountain Guide", "/images/team_pasang.jpg"),
            ("Pema Gurung", "Culture & Community Guide", "/images/team_pema.jpg"),
            ("Sunita Lama", "Safety & Sustainability Officer", "/images/team_sunita.jpg"),
            ("Arjun Thapa", "Guest Experience Manager", "/images/team_arjun.jpg"),
        ]
        for idx, (name, role, image) in enumerate(team_members):
            AboutTeamMember.objects.create(page=team, name=name, role=role, image=image, order=idx)

    if team and not team.ctas.exists():
        AboutCTA.objects.create(
            page=team,
            heading="Ready to meet the team?",
            body="Reach out to our Kathmandu office for a tailored itinerary and direct access to our expert guides.",
            primary_label="Contact our team",
            primary_url="/contact-us",
            order=0,
        )


def unseed_sections(apps, schema_editor):
    AboutStat = apps.get_model("about_info", "AboutStat")
    AboutFeature = apps.get_model("about_info", "AboutFeature")
    AboutTeamMember = apps.get_model("about_info", "AboutTeamMember")
    AboutDocument = apps.get_model("about_info", "AboutDocument")
    AboutStep = apps.get_model("about_info", "AboutStep")
    AboutPolicySection = apps.get_model("about_info", "AboutPolicySection")
    AboutTestimonial = apps.get_model("about_info", "AboutTestimonial")
    AboutMilestone = apps.get_model("about_info", "AboutMilestone")
    AboutCTA = apps.get_model("about_info", "AboutCTA")

    AboutStat.objects.all().delete()
    AboutFeature.objects.all().delete()
    AboutTeamMember.objects.all().delete()
    AboutDocument.objects.all().delete()
    AboutStep.objects.all().delete()
    AboutPolicySection.objects.all().delete()
    AboutTestimonial.objects.all().delete()
    AboutMilestone.objects.all().delete()
    AboutCTA.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [("about_info", "0003_add_section_models")]

    operations = [migrations.RunPython(seed_sections, reverse_code=unseed_sections)]

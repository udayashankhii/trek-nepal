from rest_framework import serializers

from about_info.models import (
    AboutCTA,
    AboutDocument,
    AboutFeature,
    AboutMilestone,
    AboutPage,
    AboutPolicySection,
    AboutStat,
    AboutStep,
    AboutTeamMember,
    AboutTestimonial,
)


class AboutStatInputSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()
    order = serializers.IntegerField(required=False, default=0)


class AboutFeatureInputSerializer(serializers.Serializer):
    title = serializers.CharField()
    text = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False, default=0)


class AboutTeamMemberInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    role = serializers.CharField(required=False, allow_blank=True)
    image = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False, default=0)


class AboutDocumentInputSerializer(serializers.Serializer):
    title = serializers.CharField()
    image = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False, default=0)


class AboutStepInputSerializer(serializers.Serializer):
    step = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False, default=0)


class AboutPolicySectionInputSerializer(serializers.Serializer):
    title = serializers.CharField()
    bullets = serializers.ListField(child=serializers.CharField(), required=False)
    order = serializers.IntegerField(required=False, default=0)


class AboutTestimonialInputSerializer(serializers.Serializer):
    quote = serializers.CharField()
    author = serializers.CharField(required=False, allow_blank=True)
    detail = serializers.CharField(required=False, allow_blank=True)
    image = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False, default=0)


class AboutMilestoneInputSerializer(serializers.Serializer):
    year = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False, default=0)


class AboutCTAInputSerializer(serializers.Serializer):
    heading = serializers.CharField()
    body = serializers.CharField(required=False, allow_blank=True)
    primary_label = serializers.CharField(required=False, allow_blank=True)
    primary_url = serializers.CharField(required=False, allow_blank=True)
    secondary_label = serializers.CharField(required=False, allow_blank=True)
    secondary_url = serializers.CharField(required=False, allow_blank=True)
    order = serializers.IntegerField(required=False, default=0)


class AboutPageAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = [
            "id",
            "slug",
            "title",
            "subtitle",
            "summary",
            "hero_image_url",
            "hero_badge",
            "is_published",
            "order",
            "updated_at",
        ]
        read_only_fields = fields


class AboutPageAdminDetailSerializer(serializers.ModelSerializer):
    stats = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    team_members = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()
    steps = serializers.SerializerMethodField()
    policy_sections = serializers.SerializerMethodField()
    testimonials = serializers.SerializerMethodField()
    milestones = serializers.SerializerMethodField()
    ctas = serializers.SerializerMethodField()

    class Meta:
        model = AboutPage
        fields = "__all__"

    def _as_list(self, qs, fields):
        return [{field: getattr(obj, field) for field in fields} for obj in qs]

    def get_stats(self, obj):
        return self._as_list(obj.stats.all(), ["value", "label", "order"])

    def get_features(self, obj):
        return self._as_list(obj.features.all(), ["title", "text", "order"])

    def get_team_members(self, obj):
        return self._as_list(obj.team_members.all(), ["name", "role", "image", "bio", "order"])

    def get_documents(self, obj):
        return self._as_list(obj.documents.all(), ["title", "image", "order"])

    def get_steps(self, obj):
        return self._as_list(obj.steps.all(), ["step", "title", "description", "order"])

    def get_policy_sections(self, obj):
        return self._as_list(obj.policy_sections.all(), ["title", "bullets", "order"])

    def get_testimonials(self, obj):
        return self._as_list(obj.testimonials.all(), ["quote", "author", "detail", "image", "order"])

    def get_milestones(self, obj):
        return self._as_list(obj.milestones.all(), ["year", "description", "order"])

    def get_ctas(self, obj):
        return self._as_list(
            obj.ctas.all(),
            ["heading", "body", "primary_label", "primary_url", "secondary_label", "secondary_url", "order"],
        )


class AboutPageAdminWriteSerializer(serializers.ModelSerializer):
    stats = AboutStatInputSerializer(many=True, required=False)
    features = AboutFeatureInputSerializer(many=True, required=False)
    team_members = AboutTeamMemberInputSerializer(many=True, required=False)
    documents = AboutDocumentInputSerializer(many=True, required=False)
    steps = AboutStepInputSerializer(many=True, required=False)
    policy_sections = AboutPolicySectionInputSerializer(many=True, required=False)
    testimonials = AboutTestimonialInputSerializer(many=True, required=False)
    milestones = AboutMilestoneInputSerializer(many=True, required=False)
    ctas = AboutCTAInputSerializer(many=True, required=False)

    class Meta:
        model = AboutPage
        fields = [
            "slug",
            "title",
            "subtitle",
            "summary",
        "hero_image_url",
        "hero_badge",
        "blocks",
        "team_description",
            "meta_title",
            "meta_description",
            "meta_keywords",
            "og_image_url",
            "twitter_image_url",
            "is_published",
            "order",
            "stats",
            "features",
            "team_members",
            "documents",
            "steps",
            "policy_sections",
            "testimonials",
            "milestones",
            "ctas",
        ]

    def _upsert_sections(self, page, sections):
        section_map = {
            "stats": (AboutStat, page.stats),
            "features": (AboutFeature, page.features),
            "team_members": (AboutTeamMember, page.team_members),
            "documents": (AboutDocument, page.documents),
            "steps": (AboutStep, page.steps),
            "policy_sections": (AboutPolicySection, page.policy_sections),
            "testimonials": (AboutTestimonial, page.testimonials),
            "milestones": (AboutMilestone, page.milestones),
            "ctas": (AboutCTA, page.ctas),
        }

        for key, items in sections.items():
            if items is None:
                continue
            model, related_manager = section_map[key]
            related_manager.all().delete()
            for item in items:
                model.objects.create(page=page, **item)

    def create(self, validated_data):
        sections = {key: validated_data.pop(key, None) for key in self.section_fields()}
        page = AboutPage.objects.create(**validated_data)
        self._upsert_sections(page, sections)
        return page

    def update(self, instance, validated_data):
        sections = {key: validated_data.pop(key, None) for key in self.section_fields()}
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self._upsert_sections(instance, sections)
        return instance

    def section_fields(self):
        return [
            "stats",
            "features",
            "team_members",
            "documents",
            "steps",
            "policy_sections",
            "testimonials",
            "milestones",
            "ctas",
        ]

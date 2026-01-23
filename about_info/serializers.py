from rest_framework import serializers

from .models import (
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


class AboutStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutStat
        fields = ["value", "label", "order"]


class AboutFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutFeature
        fields = ["title", "text", "order"]


class AboutTeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutTeamMember
        fields = ["name", "role", "image", "bio", "order"]


class AboutDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutDocument
        fields = ["title", "image", "order"]


class AboutStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutStep
        fields = ["step", "title", "description", "order"]


class AboutPolicySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPolicySection
        fields = ["title", "bullets", "order"]


class AboutTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutTestimonial
        fields = ["quote", "author", "detail", "image", "order"]


class AboutMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutMilestone
        fields = ["year", "description", "order"]


class AboutCTASerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutCTA
        fields = [
            "heading",
            "body",
            "primary_label",
            "primary_url",
            "secondary_label",
            "secondary_url",
            "order",
        ]


class AboutPageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = [
            "slug",
            "title",
            "subtitle",
            "summary",
            "hero_image_url",
            "hero_badge",
            "order",
            "updated_at",
        ]


class AboutPageDetailSerializer(serializers.ModelSerializer):
    stats = AboutStatSerializer(many=True, read_only=True)
    features = AboutFeatureSerializer(many=True, read_only=True)
    team_members = AboutTeamMemberSerializer(many=True, read_only=True)
    documents = AboutDocumentSerializer(many=True, read_only=True)
    steps = AboutStepSerializer(many=True, read_only=True)
    policy_sections = AboutPolicySectionSerializer(many=True, read_only=True)
    testimonials = AboutTestimonialSerializer(many=True, read_only=True)
    milestones = AboutMilestoneSerializer(many=True, read_only=True)
    ctas = AboutCTASerializer(many=True, read_only=True)

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
            "stats",
            "features",
            "team_members",
            "team_description",
            "documents",
            "steps",
            "policy_sections",
            "testimonials",
            "milestones",
            "ctas",
            "meta_title",
            "meta_description",
            "meta_keywords",
            "og_image_url",
            "twitter_image_url",
            "updated_at",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data.get("blocks"):
            blocks = []
            if data.get("stats"):
                blocks.append({"type": "stats", "items": data["stats"]})
            if data.get("features"):
                blocks.append(
                    {
                        "type": "feature_grid",
                        "heading": "The EverTrek standard",
                        "items": data["features"],
                    }
                )
            if data.get("team_members"):
                blocks.append({"type": "team", "items": data["team_members"]})
            if data.get("documents"):
                blocks.append({"type": "documents", "items": data["documents"]})
            if data.get("steps"):
                blocks.append({"type": "steps", "items": data["steps"]})
            if data.get("policy_sections"):
                blocks.append({"type": "policy", "items": data["policy_sections"]})
            if data.get("testimonials"):
                blocks.append({"type": "testimonials", "items": data["testimonials"]})
            if data.get("milestones"):
                blocks.append({"type": "milestones", "items": data["milestones"]})
            if data.get("ctas"):
                primary = data["ctas"][0] if data["ctas"] else None
                if primary:
                    blocks.append(
                        {
                            "type": "cta",
                            "heading": primary.get("heading"),
                            "body": primary.get("body"),
                            "primary": {
                                "label": primary.get("primary_label"),
                                "url": primary.get("primary_url"),
                            },
                            "secondary": {
                                "label": primary.get("secondary_label"),
                                "url": primary.get("secondary_url"),
                            },
                        }
                    )
            data["blocks"] = blocks
        return data

from rest_framework import serializers

from tours.models import HomeFeaturedTour, Tour
from TrekCard.models import HomeBestTrek, TrekInfo


class HomeBestTrekListSerializer(serializers.ModelSerializer):
    trek_title = serializers.CharField(source="trek.title", read_only=True)
    trek_slug = serializers.CharField(source="trek.slug", read_only=True)
    trek_duration = serializers.CharField(source="trek.duration", read_only=True)
    trek_trip_grade = serializers.CharField(source="trek.trip_grade", read_only=True)
    trek_rating = serializers.FloatField(source="trek.rating", read_only=True)
    trek_reviews = serializers.IntegerField(source="trek.reviews", read_only=True)
    trek_badge = serializers.SerializerMethodField()
    trek_image = serializers.SerializerMethodField()
    trek_price = serializers.SerializerMethodField()
    trek_original_price = serializers.SerializerMethodField()

    class Meta:
        model = HomeBestTrek
        fields = [
            "id",
            "order",
            "is_active",
            "trek",
            "trek_title",
            "trek_slug",
            "trek_duration",
            "trek_trip_grade",
            "trek_rating",
            "trek_reviews",
            "trek_badge",
            "trek_image",
            "trek_price",
            "trek_original_price",
        ]

    def _booking_card(self, trek: TrekInfo):
        return getattr(trek, "booking_card", None)

    def _format_price(self, value):
        try:
            if value is None:
                return None
            return float(value)
        except (TypeError, ValueError):
            return None

    def get_trek_badge(self, obj):
        card = self._booking_card(obj.trek)
        if card and card.badge_label:
            return card.badge_label
        if obj.trek.trip_grade:
            return obj.trek.trip_grade
        return "Best Trek"

    def _resolve_image(self, trek: TrekInfo):
        card = self._booking_card(trek)
        hero = getattr(trek, "hero_section", None)
        if hero and getattr(hero, "image", None):
            return hero.image.url if hero.image else None
        if card and getattr(card, "image", None):
            return card.image.url
        return None

    def get_trek_image(self, obj):
        request = self.context.get("request")
        image_url = self._resolve_image(obj.trek)
        if image_url and request:
            return request.build_absolute_uri(image_url)
        return image_url

    def get_trek_price(self, obj):
        card = self._booking_card(obj.trek)
        if card and card.base_price:
            return self._format_price(card.base_price)
        return None

    def get_trek_original_price(self, obj):
        card = self._booking_card(obj.trek)
        if card and card.original_price:
            return self._format_price(card.original_price)
        return None


class HomeBestTrekWriteSerializer(serializers.ModelSerializer):
    trek = serializers.PrimaryKeyRelatedField(queryset=TrekInfo.objects.all())

    class Meta:
        model = HomeBestTrek
        fields = ["id", "trek", "order", "is_active"]


class HomeFeaturedTourListSerializer(serializers.ModelSerializer):
    entry_type = serializers.SerializerMethodField()
    tour_title = serializers.SerializerMethodField()
    tour_slug = serializers.SerializerMethodField()
    trek_title = serializers.SerializerMethodField()
    trek_slug = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    badge = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    old_price = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = HomeFeaturedTour
        fields = [
            "id",
            "order",
            "is_active",
            "tour",
            "trek",
            "entry_type",
            "tour_title",
            "tour_slug",
            "trek_title",
            "trek_slug",
            "title",
            "slug",
            "duration",
            "location",
            "badge",
            "image",
            "price",
            "old_price",
            "rating",
            "reviews",
        ]

    def _booking_card(self, trek: TrekInfo):
        return getattr(trek, "booking_card", None)

    def _format_price(self, value):
        try:
            if value is None:
                return None
            return float(value)
        except (TypeError, ValueError):
            return None

    def get_entry_type(self, obj):
        if obj.trek_id:
            return "trek"
        if obj.tour_id:
            return "tour"
        return None

    def get_tour_title(self, obj):
        return obj.tour.title if obj.tour else None

    def get_tour_slug(self, obj):
        return obj.tour.slug if obj.tour else None

    def get_trek_title(self, obj):
        return obj.trek.title if obj.trek else None

    def get_trek_slug(self, obj):
        return obj.trek.slug if obj.trek else None

    def get_title(self, obj):
        target = obj.trek or obj.tour
        return target.title if target else None

    def get_slug(self, obj):
        target = obj.trek or obj.tour
        return target.slug if target else None

    def get_duration(self, obj):
        if obj.trek:
            return obj.trek.duration
        if obj.tour:
            return obj.tour.duration
        return None

    def get_location(self, obj):
        return obj.tour.location if obj.tour else None

    def get_badge(self, obj):
        if obj.trek:
            card = self._booking_card(obj.trek)
            if card and card.badge_label:
                return card.badge_label
            if obj.trek.trip_grade:
                return obj.trek.trip_grade
            return "Best Trek"
        return obj.tour.badge if obj.tour else None

    def get_image(self, obj):
        request = self.context.get("request")
        image_url = None
        if obj.tour:
            image_url = obj.tour.image_url
        elif obj.trek:
            hero = getattr(obj.trek, "hero_section", None)
            if hero and getattr(hero, "image", None):
                image_url = hero.image.url if hero.image else None
            else:
                card = self._booking_card(obj.trek)
                if card and getattr(card, "image", None):
                    image_url = card.image.url
        if image_url and request:
            return request.build_absolute_uri(image_url)
        return image_url

    def get_price(self, obj):
        if obj.tour:
            return self._format_price(obj.tour.price)
        if obj.trek:
            card = self._booking_card(obj.trek)
            if card and card.base_price:
                return self._format_price(card.base_price)
        return None

    def get_old_price(self, obj):
        if obj.tour:
            return self._format_price(obj.tour.old_price)
        if obj.trek:
            card = self._booking_card(obj.trek)
            if card and card.original_price:
                return self._format_price(card.original_price)
        return None

    def get_rating(self, obj):
        if obj.tour:
            return obj.tour.rating
        if obj.trek:
            return obj.trek.rating
        return None

    def get_reviews(self, obj):
        if obj.tour:
            return obj.tour.reviews_count
        if obj.trek:
            return obj.trek.reviews
        return None


class HomeFeaturedTourWriteSerializer(serializers.ModelSerializer):
    tour = serializers.PrimaryKeyRelatedField(queryset=Tour.objects.all(), required=False, allow_null=True)
    trek = serializers.PrimaryKeyRelatedField(queryset=TrekInfo.objects.all(), required=False, allow_null=True)

    class Meta:
        model = HomeFeaturedTour
        fields = ["id", "tour", "trek", "order", "is_active"]

    def validate(self, data):
        tour = data.get("tour")
        trek = data.get("trek")
        if bool(tour) == bool(trek):
            raise serializers.ValidationError("Exactly one of tour or trek must be provided.")
        return data

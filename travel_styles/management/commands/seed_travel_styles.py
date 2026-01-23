from django.core.management.base import BaseCommand
from django.db import transaction

from tours.models import (
    Tour,
    TourCost,
    TourGalleryImage,
    TourGroupPrice,
    TourHighlight,
    TourItineraryDay,
)
from travel_styles.models import TravelStyle


TRAVEL_STYLE_DATA = {
    "name": "Hiking",
    "slug": "hiking",
    "description": "Summits, ridgelines, and cultural treks that balance daily mileage with scenery.",
    "hero_image_url": "https://example.com/hero-hiking.jpg",
    "icon": "mountain",
    "accent_color": "#16a34a",
    "metadata": {
        "experience_level": "Moderate",
        "season": "Spring & Autumn",
    },
    "is_published": True,
    "order": 1,
}

TOUR_DATA = {
    "title": "Sivapuri Heritage Hike",
    "slug": "sivapuri-heritage-hike",
    "location": "Kathmandu Valley",
    "tagline": "Walk through Shivapuri’s sacred trails",
    "short_description": "A guided day hike through forested ridges, stupas, and city views.",
    "long_description": (
        "Start from Thamel, ascend through Shivapuri National Park, visit the sacred monasteries, "
        "and finish with a sunset vista over the valley."
    ),
    "image_url": "https://example.com/sivapuri.jpg",
    "duration": "6 hours",
    "group_size": 12,
    "difficulty": "Easy to Moderate",
    "start_point": "Thamel",
    "max_altitude": "2300m",
    "activity": "Hiking",
    "badge": "New",
    "rating": 4.8,
    "reviews_count": 26,
    "price": 1200.0,
    "old_price": 1500.0,
    "base_price": 1200.0,
    "original_price": 1500.0,
    "tags": ["heritage", "forest", "valley"],
    "categories": ["Day hike", "Cultural"],
    "highlights": ["Guided monastery visit", "Sunset viewpoint", "Forest trail"],
    "is_published": True,
}

TOUR_ITINERARY = [
    "Meet in Thamel and transfer to Shivapuri National Park",
    "Hike through the forest, stopping at key viewpoints",
    "Visit the Nagi Gompa meditation center",
    "Return to Thamel for a rooftop farewell",
]

TOUR_COST = {
    "inclusions": ["Transport", "Guide", "Snacks"],
    "exclusions": ["Lunch", "Personal expenses"],
}

GROUP_PRICES = [
    {
        "label": "Private Group",
        "price": 1800.0,
        "min_size": 4,
        "max_size": 12,
    }
]

GALLERY_IMAGES = [
    {
        "image_url": "https://example.com/gallery1.jpg",
        "caption": "View from Sivapuri",
        "alt_text": "Kathmandu valley view",
    }
]


class Command(BaseCommand):
    help = "Seeds the Hiking travel style and one representative tour (Sivapuri Heritage Hike)."

    def handle(self, *args, **options):
        with transaction.atomic():
            style, created = TravelStyle.objects.update_or_create(
                slug=TRAVEL_STYLE_DATA["slug"],
                defaults={
                    "name": TRAVEL_STYLE_DATA["name"],
                    "description": TRAVEL_STYLE_DATA["description"],
                    "hero_image_url": TRAVEL_STYLE_DATA["hero_image_url"],
                    "icon": TRAVEL_STYLE_DATA["icon"],
                    "accent_color": TRAVEL_STYLE_DATA["accent_color"],
                    "metadata": TRAVEL_STYLE_DATA["metadata"],
                    "is_published": TRAVEL_STYLE_DATA["is_published"],
                    "order": TRAVEL_STYLE_DATA["order"],
                },
            )
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} travel style: {style.name} ({style.slug})")

            tour_defaults = {
                "title": TOUR_DATA["title"],
                "location": TOUR_DATA["location"],
                "tagline": TOUR_DATA["tagline"],
                "short_description": TOUR_DATA["short_description"],
                "long_description": TOUR_DATA["long_description"],
                "image_url": TOUR_DATA["image_url"],
                "duration": TOUR_DATA["duration"],
                "group_size": TOUR_DATA["group_size"],
                "difficulty": TOUR_DATA["difficulty"],
                "start_point": TOUR_DATA["start_point"],
                "max_altitude": TOUR_DATA["max_altitude"],
                "activity": TOUR_DATA["activity"],
                "travel_style": style.slug,
                "badge": TOUR_DATA["badge"],
                "rating": TOUR_DATA["rating"],
                "reviews_count": TOUR_DATA["reviews_count"],
                "price": TOUR_DATA["price"],
                "old_price": TOUR_DATA["old_price"],
                "base_price": TOUR_DATA["base_price"],
                "original_price": TOUR_DATA["original_price"],
                "tags": TOUR_DATA["tags"],
                "categories": TOUR_DATA["categories"],
                "highlights": TOUR_DATA["highlights"],
                "is_published": TOUR_DATA["is_published"],
            }

            tour, tour_created = Tour.objects.update_or_create(
                slug=TOUR_DATA["slug"], defaults=tour_defaults
            )
            if not tour.travel_style:
                tour.travel_style = style.slug
            tour.save()
            self.stdout.write(
                f'{"Created" if tour_created else "Updated"} tour: {tour.title} ({tour.slug})'
            )

            TourItineraryDay.objects.filter(tour=tour).delete()
            for day_index, description in enumerate(TOUR_ITINERARY, start=1):
                TourItineraryDay.objects.create(
                    tour=tour,
                    day=day_index,
                    title=f"Leg {day_index}",
                    description=description,
                    duration="2-3 hours" if day_index != 4 else "1.5 hours",
                )

            TourHighlight.objects.filter(tour=tour).delete()
            for order, text in enumerate(TOUR_DATA["highlights"]):
                TourHighlight.objects.create(tour=tour, text=text, order=order)

            TourCost.objects.update_or_create(
                tour=tour,
                defaults={
                    "inclusions": TOUR_COST["inclusions"],
                    "exclusions": TOUR_COST["exclusions"],
                },
            )

            TourGroupPrice.objects.filter(tour=tour).delete()
            for order, group in enumerate(GROUP_PRICES):
                TourGroupPrice.objects.create(
                    tour=tour,
                    order=order,
                    label=group["label"],
                    price=group["price"],
                    min_size=group["min_size"],
                    max_size=group["max_size"],
                )

            TourGalleryImage.objects.filter(tour=tour).delete()
            for order, image in enumerate(GALLERY_IMAGES):
                TourGalleryImage.objects.create(
                    tour=tour,
                    order=order,
                    image_url=image["image_url"],
                    caption=image.get("caption", ""),
                    alt_text=image.get("alt_text", ""),
                )

        self.stdout.write(self.style.SUCCESS("Travel style + tour seeding complete."))

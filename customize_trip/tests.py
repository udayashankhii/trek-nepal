from datetime import date, timedelta

from django.core.cache import cache
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import CustomizeTripRequest


class CustomizeTripRequestAPITest(APITestCase):
    def setUp(self):
        cache.clear()

    def _build_payload(self):
        return {
            "product_type": "trek",
            "product_slug": "everest-base-camp",
            "product_name": "Everest Base Camp Trek",
            "trip_slug": "everest-base-camp",
            "trip_name": "Everest Base Camp Trek",
            "preferred_region": "everest",
            "preferred_start_date": (date.today() + timedelta(days=30)).isoformat(),
            "date_flexibility": "plus_7",
            "duration_days": 14,
            "adults": 2,
            "children": 1,
            "private_trip": True,
            "accommodation": "comfort",
            "transport": "Tourist bus",
            "guide_required": True,
            "porter_preference": "shared",
            "add_ons": ["acclimatizationDay"],
            "special_requests": "Vegetarian meals",
            "origin_url": "https://example.com/trek/everest-base-camp",
            "source": "trek_detail_hero",
            "contact_name": "Jane Doe",
            "contact_email": "jane@example.com",
            "contact_phone": "+14155551234",
            "contact_country": "United States",
            "fitness_level": "average",
            "budget": "mid",
            "consent_to_contact": True,
        }

    def test_create_request_returns_reference(self):
        url = reverse("customize_trip:requests-create")
        payload = self._build_payload()
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("requestId", response.data)
        self.assertEqual(CustomizeTripRequest.objects.count(), 1)
        request = CustomizeTripRequest.objects.first()
        self.assertEqual(request.product_type, "trek")
        self.assertEqual(request.source, "trek_detail_hero")

    def test_missing_consent_is_rejected(self):
        url = reverse("customize_trip:requests-create")
        payload = self._build_payload()
        payload["consent_to_contact"] = False
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("consent_to_contact", response.data)

    def test_throttling_applies_after_limit(self):
        url = reverse("customize_trip:requests-create")
        payload = self._build_payload()
        for i in range(10):
            payload["contact_email"] = f"user{i}@example.com"
            response = self.client.post(url, payload, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        payload["contact_email"] = "user-limit@example.com"
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_honeypot_field_short_circuits(self):
        url = reverse("customize_trip:requests-create")
        payload = self._build_payload()
        payload["website"] = "https://spam.example/submit"
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomizeTripRequest.objects.count(), 0)

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from tours.models import Tour
from travel_styles.models import TravelStyle, TravelStyleTour


class TravelStyleCollectionsAPITest(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="strong-pass",
            is_staff=True,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.style = TravelStyle.objects.create(name="Everest Style", slug="everest-style")
        self.tour_one = Tour.objects.create(title="Everest Base Camp", slug="everest-base-camp")
        self.tour_two = Tour.objects.create(title="Annapurna Circuit", slug="annapurna-circuit")

    def test_attach_tour_and_reorder_featured_public(self):
        base_url = f"/api/admin/travel-styles/{self.style.slug}/tours/"

        # Attach first tour
        response = self.client.post(base_url, {"tour_id": self.tour_one.id}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        first_item = response.data
        self.assertEqual(first_item["order"], 1)
        self.assertFalse(first_item["is_featured"])

        # Attach second tour
        response = self.client.post(base_url, {"tour_id": self.tour_two.id}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        second_item = response.data
        self.assertEqual(second_item["order"], 2)

        # Reorder tours (swap their positions)
        reorder_url = f"/api/admin/travel-styles/{self.style.slug}/tours/reorder/"
        payload = {
            "items": [
                {"tour_id": self.tour_two.id, "order": 1},
                {"tour_id": self.tour_one.id, "order": 2},
            ]
        }
        response = self.client.patch(reorder_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["updated"], 2)

        # Mark second tour (now order 1) as featured
        feature_url = f"/api/admin/travel-styles/{self.style.slug}/tours/{self.tour_two.id}/"
        response = self.client.patch(feature_url, {"is_featured": True}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_featured"])

        # Public detail should respect order + featured flag
        public_url = f"/api/travel-styles/{self.style.slug}/"
        public_response = self.client.get(public_url)
        self.assertEqual(public_response.status_code, status.HTTP_200_OK)
        payload = public_response.data
        self.assertEqual(payload["travel_style"]["slug"], self.style.slug)
        self.assertEqual(len(payload["tours"]), 2)
        first_public = payload["tours"][0]
        second_public = payload["tours"][1]
        self.assertEqual(first_public["tour"]["slug"], self.tour_two.slug)
        self.assertTrue(first_public["is_featured"])
        self.assertEqual(first_public["order"], 1)
        self.assertEqual(second_public["order"], 2)

        # Removing a tour should clear it from the collection
        delete_response = self.client.delete(feature_url)
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        remaining = TravelStyleTour.objects.filter(travel_style=self.style).count()
        self.assertEqual(remaining, 1)

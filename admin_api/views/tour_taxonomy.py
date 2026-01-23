from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from admin_api.permissions import IsStaff
from tours.models import Tour


class TourStyleListView(APIView):
    """
    GET /api/admin/tour-styles/
    Returns unique travel styles used by tours.
    """

    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request):
        styles = (
            Tour.objects.exclude(travel_style="")
            .exclude(travel_style__isnull=True)
            .values_list("travel_style", flat=True)
            .distinct()
            .order_by("travel_style")
        )
        return Response({"styles": list(styles)})

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from admin_api.permissions import IsStaff
from admin_api.serializers.tour import TourAdminSerializer
from admin_api.views.tour import tour_full_queryset


class ToursListView(APIView):
    """
    GET /api/admin/tours-list/
    Returns a non-paginated list of tours for the admin panel.
    """

    permission_classes = [IsAuthenticated, IsStaff]

    def get(self, request):
        qs = tour_full_queryset().order_by("-id")
        data = TourAdminSerializer(qs, many=True, context={"request": request}).data
        return Response(data)

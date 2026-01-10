# admin_api/views/region.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter

from TrekCard.models import Region
from admin_api.permissions import IsStaff
from admin_api.serializers.region import RegionAdminSerializer


class RegionAdminViewSet(ModelViewSet):
    """Admin CRUD for Regions by **slug**.

      - GET    /api/admin/regions/
      - POST   /api/admin/regions/
      - GET    /api/admin/regions/<slug>/
      - PATCH  /api/admin/regions/<slug>/
      - DELETE /api/admin/regions/<slug>/
    """

    queryset = Region.objects.all()
    serializer_class = RegionAdminSerializer
    permission_classes = [IsAuthenticated, IsStaff]
    filter_backends = [SearchFilter, OrderingFilter]

    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    search_fields = ["name", "slug", "short_label"]
    ordering_fields = ["order", "name", "slug"]
    ordering = ["order", "name"]

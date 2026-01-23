from .region import RegionAdminSerializer
from .trek import TrekAdminSerializer, TrekFullAdminSerializer
from .tour import TourAdminSerializer, TourFullAdminSerializer
from .import_payload import AdminImportPayloadSerializer
from .blog import (
    BlogAdminSerializer,
    BlogAuthorAdminSerializer,
    BlogCategoryAdminSerializer,
    BlogRegionAdminSerializer,
    BlogFullAdminSerializer,
)
from .booking import BookingAdminListSerializer, BookingAdminDetailSerializer, BookingAdminUpdateSerializer
from .travel_info import TravelInfoAdminListSerializer, TravelInfoAdminDetailSerializer, TravelInfoAdminWriteSerializer
from .about_info import AboutPageAdminListSerializer, AboutPageAdminDetailSerializer, AboutPageAdminWriteSerializer
from .customize_trip import CustomizeTripRequestAdminDetailSerializer, CustomizeTripRequestAdminListSerializer

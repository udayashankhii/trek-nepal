from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import CustomizeTripRequest
from .serializers import (
    CustomizeTripRequestAdminSerializer,
    CustomizeTripRequestCreateSerializer,
)
from .services import send_customize_trip_notification


class CustomizeTripRequestCreateAPIView(generics.CreateAPIView):
    queryset = CustomizeTripRequest.objects.all()
    serializer_class = CustomizeTripRequestCreateSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "inquiry_create"

    def create(self, request, *args, **kwargs):
        if request.data.get("website"):
            return Response(
                {"detail": "Thank you for your submission."},
                status=status.HTTP_201_CREATED,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        send_customize_trip_notification(instance)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "requestId": instance.request_ref,
                "publicId": str(instance.public_id),
                "status": instance.status,
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class CustomizeTripRequestAdminListAPIView(generics.ListAPIView):
    queryset = CustomizeTripRequest.objects.all()
    serializer_class = CustomizeTripRequestAdminSerializer
    permission_classes = [permissions.IsAdminUser]


class CustomizeTripRequestAdminDetailAPIView(generics.RetrieveAPIView):
    queryset = CustomizeTripRequest.objects.all()
    serializer_class = CustomizeTripRequestAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "request_ref"
    lookup_url_kwarg = "request_ref"


class CustomizeTripRequestAdminUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = CustomizeTripRequest.objects.all()
    serializer_class = CustomizeTripRequestAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "request_ref"
    lookup_url_kwarg = "request_ref"

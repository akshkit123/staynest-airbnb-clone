from django.urls import path
from .views import (
    PropertyListCreateView,
    PropertyDetailView,
    PropertyAvailabilityView,
    PropertyImageUploadView,
    AmenityListView,
)

urlpatterns = [
    path("", PropertyListCreateView.as_view(), name="property-list-create"),
    path("<int:pk>/", PropertyDetailView.as_view(), name="property-detail"),
    path(
        "<int:pk>/availability/",
        PropertyAvailabilityView.as_view(),
        name="property-availability",
    ),
    path(
        "<int:pk>/images/",
        PropertyImageUploadView.as_view(),
        name="property-image-upload",
    ),
    path("amenities/", AmenityListView.as_view(), name="amenity-list"),
]

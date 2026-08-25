from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from properties.views import HostPropertiesView, AdminPropertiesView
from bookings.views import (
    HostBookingsView,
    HostEarningsView,
    AdminBookingsView,
    AdminStatsView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth endpoints
    path("api/auth/", include("accounts.urls")),
    # Properties & Reviews endpoints
    path("api/properties/", include("properties.urls")),
    path("api/properties/", include("reviews.urls")),
    # Bookings endpoints
    path("api/bookings/", include("bookings.urls")),
    # Wishlist endpoints
    path("api/wishlist/", include("wishlist.urls")),
    # Host dashboard endpoints
    path(
        "api/host/properties/",
        HostPropertiesView.as_view(),
        name="host-properties",
    ),
    path("api/host/bookings/", HostBookingsView.as_view(), name="host-bookings"),
    path("api/host/earnings/", HostEarningsView.as_view(), name="host-earnings"),
    # Admin dashboard endpoints
    path(
        "api/admin/properties/",
        AdminPropertiesView.as_view(),
        name="admin-properties",
    ),
    path(
        "api/admin/bookings/",
        AdminBookingsView.as_view(),
        name="admin-bookings",
    ),
    path("api/admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

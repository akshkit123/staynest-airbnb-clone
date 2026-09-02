from django.urls import path
from .views import PropertyReviewsView, ReviewDetailView

urlpatterns = [
    path(
        "<int:property_id>/reviews/",
        PropertyReviewsView.as_view(),
        name="property-reviews",
    ),
    path(
        "reviews/<int:pk>/",
        ReviewDetailView.as_view(),
        name="review-detail",
    ),
]

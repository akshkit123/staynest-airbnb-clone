from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from properties.models import Property
from accounts.permissions import IsOwnerOrReadOnly


class PropertyReviewsView(generics.ListCreateAPIView):
    """
    List all reviews for a property or post a new review.
    """

    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        property_id = self.kwargs.get("property_id")
        return (
            Review.objects.filter(property_id=property_id)
            .select_related("user")
            .order_by("-created_at")
        )

    def create(self, request, *args, **kwargs):
        property_id = self.kwargs.get("property_id")
        prop = get_object_or_404(Property, id=property_id)

        serializer = self.get_serializer(
            data=request.data,
            context={"request": request, "property_instance": prop},
        )
        serializer.is_valid(raise_exception=True)
        review = serializer.save()

        return Response(
            ReviewSerializer(review).data, status=status.HTTP_201_CREATED
        )


class ReviewDetailView(generics.RetrieveDestroyAPIView):
    """
    Retrieve or delete a review.
    """

    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

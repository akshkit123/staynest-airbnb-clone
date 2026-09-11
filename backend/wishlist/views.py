from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Wishlist
from .serializers import WishlistSerializer
from properties.models import Property


class WishlistListCreateView(generics.ListCreateAPIView):
    """
    List user's saved wishlist properties or save a new property.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WishlistSerializer

    def get_queryset(self):
        return (
            Wishlist.objects.filter(user=self.request.user)
            .select_related("property")
            .prefetch_related("property__images")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save()


class WishlistRemoveView(APIView):
    """
    Remove a property from user's wishlist by property_id.
    """

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, property_id):
        item = Wishlist.objects.filter(
            user=request.user, property_id=property_id
        ).first()
        if item:
            item.delete()
            return Response(
                {"message": "Property removed from wishlist."},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Property was not in wishlist."},
            status=status.HTTP_404_NOT_FOUND,
        )

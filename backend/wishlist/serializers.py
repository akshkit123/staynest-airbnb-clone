from rest_framework import serializers
from .models import Wishlist
from properties.models import Property
from properties.serializers import PropertyListSerializer


class WishlistSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    property_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "property", "property_id", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        property_id = validated_data.pop("property_id")
        user = self.context["request"].user

        try:
            prop = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise serializers.ValidationError({"property_id": "Property not found."})

        wishlist_item, created = Wishlist.objects.get_or_create(
            user=user, property=prop
        )
        return wishlist_item

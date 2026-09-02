from rest_framework import serializers
from .models import Review
from properties.serializers import HostBasicSerializer


class ReviewSerializer(serializers.ModelSerializer):
    user = HostBasicSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "property",
            "user",
            "booking",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["id", "user", "property", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        property_instance = self.context.get("property_instance")
        return Review.objects.create(
            user=request.user, property=property_instance, **validated_data
        )

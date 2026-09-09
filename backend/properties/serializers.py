from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Property, Amenity, PropertyImage, PropertyAmenity

User = get_user_model()


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ["id", "name", "icon"]


class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source="get_image_url", read_only=True)

    class Meta:
        model = PropertyImage
        fields = ["id", "image", "image_url", "url", "is_primary"]


class HostBasicSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    avatar = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "phone", "avatar", "created_at"]


class PropertyListSerializer(serializers.ModelSerializer):
    primary_image = serializers.CharField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    host = HostBasicSerializer(read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "property_type",
            "category",
            "location",
            "city",
            "country",
            "price_per_night",
            "cleaning_fee",
            "service_fee",
            "max_guests",
            "bedrooms",
            "beds",
            "bathrooms",
            "primary_image",
            "average_rating",
            "review_count",
            "host",
            "is_favorited",
            "created_at",
        ]

    def get_is_favorited(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


class PropertyDetailSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    host = HostBasicSerializer(read_only=True)
    primary_image = serializers.CharField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "description",
            "property_type",
            "category",
            "location",
            "city",
            "country",
            "latitude",
            "longitude",
            "price_per_night",
            "cleaning_fee",
            "service_fee",
            "max_guests",
            "bedrooms",
            "beds",
            "bathrooms",
            "images",
            "amenities",
            "host",
            "primary_image",
            "average_rating",
            "review_count",
            "is_favorited",
            "created_at",
            "updated_at",
        ]

    def get_is_favorited(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    amenity_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    image_urls = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "description",
            "property_type",
            "category",
            "location",
            "city",
            "country",
            "latitude",
            "longitude",
            "price_per_night",
            "cleaning_fee",
            "service_fee",
            "max_guests",
            "bedrooms",
            "beds",
            "bathrooms",
            "amenity_ids",
            "image_urls",
        ]

    def create(self, validated_data):
        amenity_ids = validated_data.pop("amenity_ids", [])
        image_urls = validated_data.pop("image_urls", [])

        # Assign host from authenticated user
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["host"] = request.user

        property_instance = Property.objects.create(**validated_data)

        # Set amenities
        if amenity_ids:
            amenities = Amenity.objects.filter(id__in=amenity_ids)
            property_instance.amenities.set(amenities)

        # Add image URLs if provided
        for idx, url in enumerate(image_urls):
            PropertyImage.objects.create(
                property=property_instance,
                image_url=url,
                is_primary=(idx == 0),
            )

        return property_instance

    def update(self, instance, validated_data):
        amenity_ids = validated_data.pop("amenity_ids", None)
        image_urls = validated_data.pop("image_urls", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if amenity_ids is not None:
            amenities = Amenity.objects.filter(id__in=amenity_ids)
            instance.amenities.set(amenities)

        if image_urls is not None and len(image_urls) > 0:
            for idx, url in enumerate(image_urls):
                PropertyImage.objects.create(
                    property=instance,
                    image_url=url,
                    is_primary=False,
                )

        return instance

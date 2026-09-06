from rest_framework import serializers
from datetime import date
from django.contrib.auth import get_user_model
from .models import Booking
from properties.models import Property
from properties.serializers import HostBasicSerializer

User = get_user_model()


class PropertyBookingBasicSerializer(serializers.ModelSerializer):
    primary_image = serializers.CharField(read_only=True)
    host = HostBasicSerializer(read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "property_type",
            "city",
            "country",
            "location",
            "price_per_night",
            "cleaning_fee",
            "service_fee",
            "primary_image",
            "host",
        ]


class BookingSerializer(serializers.ModelSerializer):
    property = PropertyBookingBasicSerializer(read_only=True)
    guest = HostBasicSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "property",
            "guest",
            "check_in",
            "check_out",
            "guests",
            "nights",
            "total_price",
            "status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "nights",
            "total_price",
            "created_at",
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    property_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "property_id",
            "check_in",
            "check_out",
            "guests",
            "nights",
            "total_price",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "nights", "total_price", "status", "created_at"]

    def validate(self, attrs):
        check_in = attrs.get("check_in")
        check_out = attrs.get("check_out")
        property_id = attrs.get("property_id")
        guests_count = attrs.get("guests", 1)

        if check_in and check_out:
            if check_in < date.today():
                raise serializers.ValidationError(
                    {"check_in": "Check-in date cannot be in the past."}
                )
            if check_in >= check_out:
                raise serializers.ValidationError(
                    {"check_out": "Check-out date must be after check-in date."}
                )

        try:
            property_instance = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            raise serializers.ValidationError({"property_id": "Property not found."})

        if guests_count > property_instance.max_guests:
            raise serializers.ValidationError(
                {
                    "guests": f"Maximum allowed guests for this property is {property_instance.max_guests}."
                }
            )

        # Overlap validation
        overlapping = Booking.objects.filter(
            property=property_instance,
            status__in=["confirmed", "pending"],
            check_in__lt=check_out,
            check_out__gt=check_in,
        ).exists()

        if overlapping:
            raise serializers.ValidationError(
                {
                    "non_field_errors": [
                        "This property is already booked for the selected dates. Please choose different dates."
                    ]
                }
            )

        nights = (check_out - check_in).days
        total_price = (
            (nights * property_instance.price_per_night)
            + property_instance.cleaning_fee
            + property_instance.service_fee
        )

        attrs["property_instance"] = property_instance
        attrs["nights"] = nights
        attrs["total_price"] = total_price

        return attrs

    def create(self, validated_data):
        property_instance = validated_data.pop("property_instance")
        validated_data.pop("property_id")
        request = self.context.get("request")

        booking = Booking.objects.create(
            property=property_instance,
            guest=request.user,
            status="confirmed",
            **validated_data,
        )
        return booking

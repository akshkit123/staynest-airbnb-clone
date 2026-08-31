from django.db import models
from django.conf import settings
from django.db.models import Avg


class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, default="CheckCircle")

    class Meta:
        verbose_name_plural = "Amenities"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Property(models.Model):
    CATEGORY_CHOICES = (
        ("beach", "Beach"),
        ("mountains", "Mountains"),
        ("city", "City"),
        ("countryside", "Countryside"),
        ("luxury", "Luxury"),
        ("pools", "Pools"),
        ("amazing views", "Amazing views"),
        ("cabins", "Cabins"),
    )

    host = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    property_type = models.CharField(max_length=50, default="Apartment")
    category = models.CharField(
        max_length=50, choices=CATEGORY_CHOICES, default="beach"
    )
    location = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    cleaning_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00
    )
    service_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00
    )
    max_guests = models.PositiveIntegerField(default=1)
    bedrooms = models.PositiveIntegerField(default=1)
    beds = models.PositiveIntegerField(default=1)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, default=1.0)
    amenities = models.ManyToManyField(
        Amenity, through="PropertyAmenity", related_name="properties", blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Properties"

    def __str__(self):
        return f"{self.title} - {self.city}, {self.country}"

    @property
    def average_rating(self):
        avg = self.reviews.aggregate(Avg("rating"))["rating__avg"]
        return round(avg, 2) if avg is not None else 4.85

    @property
    def review_count(self):
        return self.reviews.count()

    @property
    def primary_image(self):
        primary = self.images.filter(is_primary=True).first()
        if not primary:
            primary = self.images.first()
        if primary:
            if primary.image:
                return primary.image.url
            if primary.image_url:
                return primary.image_url
        return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"


class PropertyAmenity(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    amenity = models.ForeignKey(Amenity, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("property", "amenity")

    def __str__(self):
        return f"{self.property.title} - {self.amenity.name}"


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="properties/", blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, default="")
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_primary", "id"]

    def __str__(self):
        return f"Image for {self.property.title}"

    def get_image_url(self):
        if self.image:
            return self.image.url
        if self.image_url:
            return self.image_url
        return ""

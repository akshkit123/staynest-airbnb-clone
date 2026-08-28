from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Booking(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    )

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    guest = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings",
    )
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveIntegerField(default=1)
    nights = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="confirmed"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Booking #{self.id} - {self.property.title} by {self.guest.email}"

    def clean(self):
        if self.check_in and self.check_out:
            if self.check_in >= self.check_out:
                raise ValidationError("Check-out date must be after check-in date.")

            # Overlapping bookings check (ignoring cancelled bookings and current booking instance)
            overlapping = Booking.objects.filter(
                property=self.property,
                status__in=["confirmed", "pending"],
                check_in__lt=self.check_out,
                check_out__gt=self.check_in,
            )
            if self.pk:
                overlapping = overlapping.exclude(pk=self.pk)

            if overlapping.exists():
                raise ValidationError(
                    "This property is already booked for the selected dates."
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q
from .models import Property, Amenity, PropertyImage
from .serializers import (
    PropertyListSerializer,
    PropertyDetailSerializer,
    PropertyCreateUpdateSerializer,
    AmenitySerializer,
    PropertyImageSerializer,
)
from accounts.permissions import IsHostUserRole, IsAdminUserRole, IsOwnerOrReadOnly


class PropertyListCreateView(generics.ListCreateAPIView):
    """
    List properties with full multi-attribute filtering & sorting,
    or create a new property (Host/Admin only).
    """

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsHostUserRole()]
        return [permissions.AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PropertyCreateUpdateSerializer
        return PropertyListSerializer

    def get_queryset(self):
        queryset = (
            Property.objects.all()
            .select_related("host")
            .prefetch_related("images", "reviews", "favorited_by")
        )
        params = self.request.query_params

        # Search term or location filter
        location = params.get("location")
        if location:
            queryset = queryset.filter(
                Q(city__icontains=location)
                | Q(country__icontains=location)
                | Q(location__icontains=location)
                | Q(title__icontains=location)
            )

        city = params.get("city")
        if city:
            queryset = queryset.filter(city__icontains=city)

        category = params.get("category")
        if category and category.lower() != "all":
            queryset = queryset.filter(category__iexact=category)

        prop_type = params.get("property_type")
        if prop_type and prop_type.lower() != "all":
            queryset = queryset.filter(property_type__iexact=prop_type)

        min_price = params.get("min_price")
        if min_price:
            try:
                queryset = queryset.filter(price_per_night__gte=float(min_price))
            except ValueError:
                pass

        max_price = params.get("max_price")
        if max_price:
            try:
                queryset = queryset.filter(price_per_night__lte=float(max_price))
            except ValueError:
                pass

        guests = params.get("guests")
        if guests:
            try:
                queryset = queryset.filter(max_guests__gte=int(guests))
            except ValueError:
                pass

        bedrooms = params.get("bedrooms")
        if bedrooms:
            try:
                queryset = queryset.filter(bedrooms__gte=int(bedrooms))
            except ValueError:
                pass

        beds = params.get("beds")
        if beds:
            try:
                queryset = queryset.filter(beds__gte=int(beds))
            except ValueError:
                pass

        bathrooms = params.get("bathrooms")
        if bathrooms:
            try:
                queryset = queryset.filter(bathrooms__gte=float(bathrooms))
            except ValueError:
                pass

        amenity_ids = params.get("amenities")
        if amenity_ids:
            try:
                ids = [
                    int(a.strip())
                    for a in amenity_ids.split(",")
                    if a.strip().isdigit()
                ]
                for a_id in ids:
                    queryset = queryset.filter(amenities__id=a_id)
            except Exception:
                pass

        # Sorting
        sort = params.get("sort", "-created_at")
        if sort == "price_asc":
            queryset = queryset.order_by("price_per_night")
        elif sort == "price_desc":
            queryset = queryset.order_by("-price_per_night")
        elif sort == "newest":
            queryset = queryset.order_by("-created_at")
        else:
            queryset = queryset.order_by("-created_at")

        return queryset.distinct()


class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve single property details (public),
    or update/delete (Host owner or Admin only).
    """

    queryset = (
        Property.objects.all()
        .select_related("host")
        .prefetch_related("images", "amenities", "reviews__user")
    )

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return PropertyCreateUpdateSerializer
        return PropertyDetailSerializer


class PropertyAvailabilityView(APIView):
    """
    Returns list of booked date ranges for a property
    and allows checking if specific check_in / check_out are available.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            prop = Property.objects.get(pk=pk)
        except Property.DoesNotExist:
            return Response(
                {"error": "Property not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        active_bookings = prop.bookings.filter(
            status__in=["confirmed", "pending"]
        ).values("id", "check_in", "check_out")

        check_in = request.query_params.get("check_in")
        check_out = request.query_params.get("check_out")
        is_available = True

        if check_in and check_out:
            overlap = prop.bookings.filter(
                status__in=["confirmed", "pending"],
                check_in__lt=check_out,
                check_out__gt=check_in,
            ).exists()
            is_available = not overlap

        return Response(
            {
                "property_id": prop.id,
                "is_available": is_available,
                "booked_dates": list(active_bookings),
            }
        )


class PropertyImageUploadView(APIView):
    """Host can upload real file images to a property."""

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            prop = Property.objects.get(pk=pk)
        except Property.DoesNotExist:
            return Response(
                {"error": "Property not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(request, prop)

        files = request.FILES.getlist("images") or request.FILES.getlist(
            "image"
        )
        if not files:
            return Response(
                {"error": "No image files provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        created_images = []
        is_first = not prop.images.exists()

        for idx, file_obj in enumerate(files):
            img = PropertyImage.objects.create(
                property=prop,
                image=file_obj,
                is_primary=(is_first and idx == 0),
            )
            created_images.append(PropertyImageSerializer(img).data)

        return Response(
            {
                "message": f"Successfully uploaded {len(created_images)} images.",
                "images": created_images,
            },
            status=status.HTTP_201_CREATED,
        )


class AmenityListView(generics.ListAPIView):
    """List all available amenities."""

    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


# Host specific views
class HostPropertiesView(generics.ListAPIView):
    """List properties managed by the authenticated host."""

    permission_classes = [IsHostUserRole]
    serializer_class = PropertyListSerializer

    def get_queryset(self):
        return (
            Property.objects.filter(host=self.request.user)
            .select_related("host")
            .prefetch_related("images", "reviews")
        )


# Admin specific views
class AdminPropertiesView(generics.ListAPIView):
    """Admin-only view to list and monitor all properties."""

    permission_classes = [IsAdminUserRole]
    serializer_class = PropertyListSerializer

    def get_queryset(self):
        queryset = (
            Property.objects.all()
            .select_related("host")
            .prefetch_related("images", "reviews")
        )
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(city__icontains=search)
                | Q(host__email__icontains=search)
            )
        return queryset

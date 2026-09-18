from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from datetime import date, timedelta
from decimal import Decimal
from properties.models import Property, Amenity, PropertyImage
from bookings.models import Booking
from reviews.models import Review
from wishlist.models import Wishlist

User = get_user_model()


class Command(BaseCommand):
    help = "Seed database with users, amenities, 16+ properties, images, reviews, and bookings."

    def handle(self, *args, **options):
        self.stdout.write("Starting StayNest seed data generation...")

        # 1. Create Users
        admin_user, _ = User.objects.get_or_create(
            email="admin@staynest.com",
            defaults={
                "username": "admin@staynest.com",
                "first_name": "StayNest",
                "last_name": "Admin",
                "role": "admin",
                "is_staff": True,
                "is_superuser": True,
                "phone": "+1-800-555-0199",
                "profile_image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            },
        )
        admin_user.set_password("admin123")
        admin_user.role = "admin"
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()

        host1, _ = User.objects.get_or_create(
            email="host@staynest.com",
            defaults={
                "username": "host@staynest.com",
                "first_name": "Aarav",
                "last_name": "Sharma",
                "role": "host",
                "phone": "+91-98765-43210",
                "profile_image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            },
        )
        host1.set_password("host123")
        host1.role = "host"
        host1.save()

        host2, _ = User.objects.get_or_create(
            email="sarah.host@staynest.com",
            defaults={
                "username": "sarah.host@staynest.com",
                "first_name": "Sarah",
                "last_name": "Jenkins",
                "role": "host",
                "phone": "+44-20-7946-0958",
                "profile_image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            },
        )
        host2.set_password("host123")
        host2.role = "host"
        host2.save()

        host3, _ = User.objects.get_or_create(
            email="jean.host@staynest.com",
            defaults={
                "username": "jean.host@staynest.com",
                "first_name": "Jean",
                "last_name": "Dupont",
                "role": "host",
                "phone": "+33-1-42-68-55-00",
                "profile_image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            },
        )
        host3.set_password("host123")
        host3.role = "host"
        host3.save()

        guest1, _ = User.objects.get_or_create(
            email="guest@staynest.com",
            defaults={
                "username": "guest@staynest.com",
                "first_name": "Priya",
                "last_name": "Patel",
                "role": "guest",
                "phone": "+91-91234-56789",
                "profile_image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
            },
        )
        guest1.set_password("guest123")
        guest1.role = "guest"
        guest1.save()

        guest2, _ = User.objects.get_or_create(
            email="john.guest@staynest.com",
            defaults={
                "username": "john.guest@staynest.com",
                "first_name": "John",
                "last_name": "Doe",
                "role": "guest",
                "phone": "+1-415-555-2671",
                "profile_image_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
            },
        )
        guest2.set_password("guest123")
        guest2.role = "guest"
        guest2.save()

        self.stdout.write("Created/verified standard users: admin, hosts, guests.")

        # 2. Create Amenities
        amenities_data = [
            ("Wifi", "Wifi"),
            ("Air conditioning", "Wind"),
            ("Kitchen", "Utensils"),
            ("Free parking", "Car"),
            ("Swimming pool", "Waves"),
            ("Hot tub", "Flame"),
            ("Dedicated workspace", "Laptop"),
            ("TV", "Tv"),
            ("Washer & dryer", "Shirt"),
            ("Balcony", "Compass"),
            ("Mountain view", "Mountain"),
            ("Beach access", "Sun"),
            ("Gym", "Dumbbell"),
            ("BBQ grill", "Flame"),
            ("Patio or terrace", "Coffee"),
            ("Indoor fireplace", "Flame"),
            ("Pet friendly", "Heart"),
            ("EV charger", "Zap"),
            ("Ocean view", "Eye"),
            ("Security cameras", "ShieldCheck"),
        ]

        amenities_dict = {}
        for name, icon in amenities_data:
            amenity_obj, _ = Amenity.objects.get_or_create(
                name=name, defaults={"icon": icon}
            )
            amenities_dict[name] = amenity_obj

        self.stdout.write(f"Created {len(amenities_dict)} amenities.")

        # 3. Create Properties List
        properties_catalog = [
            {
                "host": host1,
                "title": "Sea-Facing Ultra Luxury Penthouse",
                "description": "Experience panoramic views of the Arabian Sea from this iconic Bandra penthouse. Features floor-to-ceiling glass walls, Italian marble interiors, high-end entertainment systems, and a private sundeck overlooking the sunset.",
                "property_type": "Penthouse",
                "category": "luxury",
                "location": "Carter Road, Bandra West",
                "city": "Mumbai",
                "country": "India",
                "price_per_night": Decimal("18500.00"),
                "cleaning_fee": Decimal("1500.00"),
                "service_fee": Decimal("1200.00"),
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": Decimal("3.5"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Free parking", "Ocean view", "Dedicated workspace", "TV", "Balcony", "Security cameras"],
                "images": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host1,
                "title": "Serene Hillside Eco-Villa with Infinity Pool",
                "description": "Nestled among tranquil greenery in Pune's most distinguished residential enclave. Enjoy expansive private lawns, infinity plunge pool, open-concept gourmet kitchen, and birdsong morning breezes.",
                "property_type": "Villa",
                "category": "countryside",
                "location": "North Main Road, Koregaon Park",
                "city": "Pune",
                "country": "India",
                "price_per_night": Decimal("9500.00"),
                "cleaning_fee": Decimal("900.00"),
                "service_fee": Decimal("750.00"),
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 4,
                "bathrooms": Decimal("4.0"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Free parking", "Swimming pool", "Patio or terrace", "BBQ grill", "Pet friendly"],
                "images": [
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host1,
                "title": "Portuguese Heritage Beachfront Villa",
                "description": "Step back into historic charm with direct beach access to Candolim shore. This 150-year-old restored Goan villa boasts high wooden rafters, an azure pool surrounded by coconut palms, and private chef services.",
                "property_type": "Villa",
                "category": "beach",
                "location": "Candolim Beach Road",
                "city": "Goa",
                "country": "India",
                "price_per_night": Decimal("14200.00"),
                "cleaning_fee": Decimal("1200.00"),
                "service_fee": Decimal("980.00"),
                "max_guests": 10,
                "bedrooms": 5,
                "beds": 6,
                "bathrooms": Decimal("5.0"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Free parking", "Swimming pool", "Beach access", "Patio or terrace", "Ocean view", "BBQ grill"],
                "images": [
                    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host1,
                "title": "Tropical Palm Oasis with Private Pool",
                "description": "Chic bohemian bungalow located 5 minutes from the vibrant Anjuna cliffs and flea market. Surrounded by lush bamboo gardens, this private hideaway offers an open-air rain shower, hammock deck, and plunge pool.",
                "property_type": "House",
                "category": "pools",
                "location": "De Mello Vaddo, Anjuna",
                "city": "Goa",
                "country": "India",
                "price_per_night": Decimal("8200.00"),
                "cleaning_fee": Decimal("800.00"),
                "service_fee": Decimal("600.00"),
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": Decimal("2.0"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Swimming pool", "Patio or terrace", "Dedicated workspace"],
                "images": [
                    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host1,
                "title": "Designer Glass Loft Overlooking Hauz Khas Lake",
                "description": "Modern minimalist haven in the arts capital of Delhi. Features soaring ceilings, curated art collections, smart lighting, high-speed fiber internet, and a private terrace overlooking the 13th-century monument ruins and lake.",
                "property_type": "Loft",
                "category": "city",
                "location": "Hauz Khas Village, South Delhi",
                "city": "Delhi",
                "country": "India",
                "price_per_night": Decimal("6800.00"),
                "cleaning_fee": Decimal("600.00"),
                "service_fee": Decimal("500.00"),
                "max_guests": 3,
                "bedrooms": 1,
                "beds": 2,
                "bathrooms": Decimal("1.5"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Dedicated workspace", "TV", "Balcony", "Security cameras"],
                "images": [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host1,
                "title": "Garden Penthouse in Silicon Valley Hub",
                "description": "Contemporary green sanctuary situated on 100ft road in Indiranagar. Walk to craft microbreweries, specialty roasters, and boutiques while enjoying complete quietude in your sound-isolated smart apartment.",
                "property_type": "Apartment",
                "category": "city",
                "location": "12th Main, Indiranagar",
                "city": "Bangalore",
                "country": "India",
                "price_per_night": Decimal("5900.00"),
                "cleaning_fee": Decimal("500.00"),
                "service_fee": Decimal("450.00"),
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": Decimal("2.0"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Dedicated workspace", "Washer & dryer", "Gym", "EV charger"],
                "images": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host1,
                "title": "Royal Heritage Courtyard Haveli",
                "description": "Live like royal maharajas in this authentic heritage suite. Adorned with handcrafted Jodhpur stone arches, antique rosewood furnishings, jharokha balconies, and a serene central fountain courtyard.",
                "property_type": "Villa",
                "category": "luxury",
                "location": "Johari Bazaar, Old Walled City",
                "city": "Jaipur",
                "country": "India",
                "price_per_night": Decimal("11000.00"),
                "cleaning_fee": Decimal("1000.00"),
                "service_fee": Decimal("850.00"),
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": Decimal("3.0"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Free parking", "Patio or terrace", "Indoor fireplace", "Security cameras"],
                "images": [
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host1,
                "title": "Cedar Wood Cabin with Roaring Fireplace",
                "description": "Cozy pine-scented cabin situated amidst apple orchards with uninterrupted panoramas of snow-capped Pir Panjal peaks. Warm up by the stone fireplace after a day of hiking or skiing.",
                "property_type": "Cabin",
                "category": "cabins",
                "location": "Log Huts Area, Old Manali",
                "city": "Manali",
                "country": "India",
                "price_per_night": Decimal("6400.00"),
                "cleaning_fee": Decimal("500.00"),
                "service_fee": Decimal("400.00"),
                "max_guests": 5,
                "bedrooms": 2,
                "beds": 3,
                "bathrooms": Decimal("2.0"),
                "amenities": ["Wifi", "Indoor fireplace", "Mountain view", "Free parking", "Kitchen", "Hot tub", "Balcony", "Pet friendly"],
                "images": [
                    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host1,
                "title": "Snow Peak Mountain Glass Chalet",
                "description": "An architectural marvel perched high on the ridge with 270-degree floor-to-ceiling glass. Features heated wooden floors, panoramic hot tub on the deck, and starlit sky views.",
                "property_type": "Cabin",
                "category": "mountains",
                "location": "Solang Valley Ridge",
                "city": "Manali",
                "country": "India",
                "price_per_night": Decimal("8900.00"),
                "cleaning_fee": Decimal("750.00"),
                "service_fee": Decimal("650.00"),
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": Decimal("2.0"),
                "amenities": ["Wifi", "Mountain view", "Indoor fireplace", "Hot tub", "Kitchen", "Free parking", "Balcony"],
                "images": [
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host2,
                "title": "Burj Khalifa Panoramic View Penthouse",
                "description": "Direct skyline views of the Burj Khalifa and the Dubai Fountains. This ultra-modern sky residence offers private elevator access, designer Italian finishes, concierge services, and gym access.",
                "property_type": "Penthouse",
                "category": "luxury",
                "location": "Sheikh Mohammed bin Rashid Blvd, Downtown",
                "city": "Dubai",
                "country": "United Arab Emirates",
                "price_per_night": Decimal("26000.00"),
                "cleaning_fee": Decimal("2500.00"),
                "service_fee": Decimal("1800.00"),
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 3,
                "bathrooms": Decimal("3.5"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Swimming pool", "Gym", "Dedicated workspace", "Free parking", "Security cameras", "EV charger"],
                "images": [
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host2,
                "title": "Palm Jumeirah Signature Beachfront Villa",
                "description": "Private beach with white sand and private sea infinity pool on the world-famous Palm fronds. Includes private mooring, 5 ensuite master bedrooms, outdoor BBQ kitchen, and full Dubai Marina skyline vista.",
                "property_type": "Villa",
                "category": "pools",
                "location": "Frond G, Palm Jumeirah",
                "city": "Dubai",
                "country": "United Arab Emirates",
                "price_per_night": Decimal("45000.00"),
                "cleaning_fee": Decimal("3500.00"),
                "service_fee": Decimal("2900.00"),
                "max_guests": 12,
                "bedrooms": 5,
                "beds": 6,
                "bathrooms": Decimal("6.0"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Swimming pool", "Hot tub", "Beach access", "Ocean view", "BBQ grill", "Free parking"],
                "images": [
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host3,
                "title": "Romantic Haussmann Loft with Eiffel Tower Views",
                "description": "Watch the Eiffel Tower sparkle every hour from your private iron balcony. Beautiful parquet chevron floors, crown moldings, marble fireplace, and Nespresso breakfast bar in Paris's most coveted 7th district.",
                "property_type": "Apartment",
                "category": "amazing views",
                "location": "Avenue de La Bourdonnais, 7th Arrondissement",
                "city": "Paris",
                "country": "France",
                "price_per_night": Decimal("22000.00"),
                "cleaning_fee": Decimal("1800.00"),
                "service_fee": Decimal("1500.00"),
                "max_guests": 3,
                "bedrooms": 1,
                "beds": 2,
                "bathrooms": Decimal("1.0"),
                "amenities": ["Wifi", "Kitchen", "Dedicated workspace", "Balcony", "TV", "Washer & dryer"],
                "images": [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host3,
                "title": "Bohemian Artist Atelier in Sacré-Cœur Montmartre",
                "description": "Sun-drenched historic artist studio with soaring skylights where Impressionist painters once worked. Steps from charming bistros, vineyard alleys, and cobblestone stairways.",
                "property_type": "Loft",
                "category": "city",
                "location": "Rue des Saules, Montmartre",
                "city": "Paris",
                "country": "France",
                "price_per_night": Decimal("13500.00"),
                "cleaning_fee": Decimal("1100.00"),
                "service_fee": Decimal("900.00"),
                "max_guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": Decimal("1.0"),
                "amenities": ["Wifi", "Kitchen", "Dedicated workspace", "Washer & dryer"],
                "images": [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host2,
                "title": "Classic Victorian Townhouse in South Kensington",
                "description": "Elegant 4-story Victorian heritage home with private mews garden. Steps from the Natural History Museum and Hyde Park. Features classic English library, freestanding clawfoot tub, and chef range.",
                "property_type": "House",
                "category": "city",
                "location": "Queen's Gate, South Kensington",
                "city": "London",
                "country": "United Kingdom",
                "price_per_night": Decimal("28500.00"),
                "cleaning_fee": Decimal("2200.00"),
                "service_fee": Decimal("1900.00"),
                "max_guests": 8,
                "bedrooms": 4,
                "beds": 5,
                "bathrooms": Decimal("3.5"),
                "amenities": ["Wifi", "Kitchen", "Patio or terrace", "Dedicated workspace", "Washer & dryer", "TV", "Indoor fireplace"],
                "images": [
                    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host2,
                "title": "Thames Riverside Sky Suite in Canary Wharf",
                "description": "Watch the boats glide along the river Thames from this high-floor architectural glass tower. Direct access to Jubilee Line and Elizabeth Line, with swimming pool, 24/7 concierge, and gym on-site.",
                "property_type": "Apartment",
                "category": "amazing views",
                "location": "Marsh Wall, Canary Wharf",
                "city": "London",
                "country": "United Kingdom",
                "price_per_night": Decimal("16500.00"),
                "cleaning_fee": Decimal("1400.00"),
                "service_fee": Decimal("1100.00"),
                "max_guests": 4,
                "bedrooms": 2,
                "beds": 2,
                "bathrooms": Decimal("2.0"),
                "amenities": ["Wifi", "Air conditioning", "Kitchen", "Swimming pool", "Gym", "Dedicated workspace", "TV", "Security cameras"],
                "images": [
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                ],
            },
            {
                "host": host3,
                "title": "Alpine Chalet with Direct Matterhorn Views",
                "description": "Iconic timber ski chalet directly facing the Matterhorn peak. Ski-in/ski-out convenience, Finnish sauna, cedar hot tub under starlit peaks, and crackling log fire.",
                "property_type": "Cabin",
                "category": "mountains",
                "location": "Winkelmatten Alpine Trail",
                "city": "Zermatt",
                "country": "Switzerland",
                "price_per_night": Decimal("32000.00"),
                "cleaning_fee": Decimal("2400.00"),
                "service_fee": Decimal("2100.00"),
                "max_guests": 6,
                "bedrooms": 3,
                "beds": 4,
                "bathrooms": Decimal("3.0"),
                "amenities": ["Wifi", "Mountain view", "Hot tub", "Indoor fireplace", "Kitchen", "Balcony", "Patio or terrace", "Pet friendly"],
                "images": [
                    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
                ],
            },
        ]

        created_props = []
        for prop_data in properties_catalog:
            amenity_names = prop_data.pop("amenities")
            image_urls = prop_data.pop("images")

            prop_obj, created = Property.objects.get_or_create(
                title=prop_data["title"],
                city=prop_data["city"],
                defaults=prop_data,
            )

            # Set amenities
            matched_amenities = [
                amenities_dict[name]
                for name in amenity_names
                if name in amenities_dict
            ]
            prop_obj.amenities.set(matched_amenities)

            # Add images
            if created or not prop_obj.images.exists():
                for idx, url in enumerate(image_urls):
                    PropertyImage.objects.create(
                        property=prop_obj,
                        image_url=url,
                        is_primary=(idx == 0),
                    )

            created_props.append(prop_obj)

        self.stdout.write(f"Created/verified {len(created_props)} properties.")

        # 4. Create Reviews
        reviews_samples = [
            ("Priya Patel", 5, "Absolute perfection! The views were breathtaking and the host Aarav made check-in seamless. Clean, spacious, and even better than the photos."),
            ("John Doe", 5, "One of the best stays we've ever booked. High quality bedding, super fast wifi for remote work, and excellent location."),
            ("Sophia Chen", 5, "Remarkable attention to detail. The sunset from the terrace is something we will never forget! Highly recommended."),
            ("David Miller", 4, "Great stay overall. Location was ideal and kitchen had everything we needed to cook meals. Would definitely book again."),
        ]

        review_users = [guest1, guest2]
        for prop in created_props:
            if not prop.reviews.exists():
                for idx, (author, rating, text) in enumerate(reviews_samples[:3]):
                    u = review_users[idx % len(review_users)]
                    Review.objects.create(
                        property=prop,
                        user=u,
                        rating=rating,
                        comment=text,
                    )

        self.stdout.write("Created authentic guest reviews for all properties.")

        # 5. Create Sample Bookings
        today = date.today()
        sample_bookings_specs = [
            (created_props[0], guest1, today + timedelta(days=5), today + timedelta(days=9), 4, "confirmed"),
            (created_props[1], guest1, today + timedelta(days=14), today + timedelta(days=18), 3, "confirmed"),
            (created_props[2], guest2, today - timedelta(days=20), today - timedelta(days=15), 4, "completed"),
            (created_props[4], guest2, today + timedelta(days=10), today + timedelta(days=13), 2, "confirmed"),
            (created_props[9], guest1, today - timedelta(days=35), today - timedelta(days=30), 2, "completed"),
        ]

        for prop, guest, c_in, c_out, guests_count, status_str in sample_bookings_specs:
            nights = (c_out - c_in).days
            total = (nights * prop.price_per_night) + prop.cleaning_fee + prop.service_fee
            Booking.objects.get_or_create(
                property=prop,
                guest=guest,
                check_in=c_in,
                check_out=c_out,
                defaults={
                    "guests": guests_count,
                    "nights": nights,
                    "total_price": total,
                    "status": status_str,
                },
            )

        self.stdout.write("Created active and past sample bookings.")

        # 6. Create Wishlist items for guest1
        for prop in created_props[:4]:
            Wishlist.objects.get_or_create(user=guest1, property=prop)

        self.stdout.write(
            self.style.SUCCESS("StayNest seed data generated successfully!")
        )

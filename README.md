# StayNest - Full-Stack Vacation Rental Platform

**StayNest** is a full-stack vacation rental web application inspired by Airbnb, built with a decoupled architecture featuring a **React (Vite) frontend** and a **Django REST Framework (DRF) backend**.

StayNest supports three user roles (**Guest**, **Host**, and **Admin**), dynamic search & multi-attribute filtering, interactive availability calendars with strict overlap prevention, image galleries, reviews with star ratings, wishlists, and role-based management dashboards.

---

## 🌟 Key Features

### 1. Guest Experience
- **Authentication**: JWT token registration, login, session restoration, and profile editing.
- **Search & Discovery**:
  - Filter by location, city, category (Beach, Mountains, City, Countryside, Luxury, Pools, Amazing views, Cabins).
  - Multi-attribute filtering: Price range, property type, bedrooms, bathrooms, and amenities.
  - Sorting: Price (Low to High, High to Low), Newest listings.
- **Property Details**:
  - 5-photo Airbnb-style grid gallery with full-screen photo modal.
  - Room specs (guests, bedrooms, beds, baths) and amenity icon list.
  - Host info with verified badge and Superhost status.
  - Guest reviews list and interactive rating form.
  - Real-time availability calendar highlighting and disabling booked dates.
- **Booking Flow**:
  - Floating reservation widget with dynamic price calculations (nights × price + cleaning + service fees).
  - Server-side date overlap prevention so double-booking is impossible.
  - Multi-step checkout with mock payment processing.
  - Booking confirmation screen with unique booking reference (`#STAY-XXX`).
  - Trips management: View upcoming/past trips and cancel reservations.
- **Wishlist**: Save favorite properties with optimistic UI heart toggling.

### 2. Host Experience
- **Host Dashboard**:
  - Total earnings, total bookings, active listing counts.
  - Monthly earnings bar visualization and trend tracking.
  - Recent guest reservations table.
- **Listing Management**:
  - Create new listings with multi-image support (URLs & file uploads).
  - Edit pricing, description, category, room layout, and amenities.
  - Delete property listings.
- **Reservations**:
  - Review all guest check-in/checkout dates, guest counts, and revenue.
- **Earnings & Payouts**:
  - Revenue analytics and StayCover host protection status.

### 3. Admin Capabilities
- **Platform Analytics**: Total users, hosts, guests, listings, total platform volume, and recent bookings.
- **User Moderation**: Search users, toggle roles (Guest / Host / Admin), and delete spam accounts.
- **Listing Moderation**: Inspect all global listings and remove violating/inappropriate listings.
- **Bookings Oversight**: Complete audit log of transactions and reservations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Routing**: React Router v7
- **Styling**: Modern Vanilla CSS Design System with responsive breakpoints
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT request & refresh interceptors
- **State Management**: React Context API (`AuthContext`, `WishlistContext`, `BookingContext`)

### Backend
- **Framework**: Django 5.x / 6.x
- **API Engine**: Django REST Framework (DRF)
- **Authentication**: Simple JWT (`djangorestframework-simplejwt`)
- **Database**: PostgreSQL (with automatic SQLite fallback for rapid local setup)
- **CORS**: `django-cors-headers`
- **Image Processing**: Pillow

---

## 📁 Project Structure

```
airbnb clone/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── accounts/          # User model, JWT authentication, profiles, admin user views
│   ├── properties/        # Property, Amenity, PropertyImage models, search, filters
│   │   └── management/
│   │       └── commands/
│   │           └── seed_data.py # Seed data for 16+ properties across 10 global cities
│   ├── bookings/          # Bookings, overlap validation, host earnings, admin stats
│   ├── reviews/           # Property reviews and star ratings
│   ├── wishlist/          # User wishlist favorites
│   └── media/             # Uploaded property & profile images
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css      # Design system tokens and styles
│       ├── api/
│       │   └── axios.js   # Axios instance with JWT interceptors
│       ├── context/       # Auth, Wishlist, and Booking contexts
│       ├── components/    # Reusable UI components
│       ├── pages/         # Public, Guest, Host, and Admin pages
│       ├── services/      # Modular DRF API clients
│       └── utils/         # Date, currency, and pricing helpers
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
SECRET_KEY=django-insecure-staynest-super-secret-key-change-in-production-2026
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,*

# Database Configuration
DATABASE_ENGINE=sqlite        # Set to 'postgresql' when connecting to PostgreSQL
DATABASE_NAME=staynest_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python**: 3.10+
- **Node.js**: 18+ (Node 20+ recommended)
- **PostgreSQL** (Optional; SQLite is configured as default fallback out of the box)

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **(Optional) Create and activate a virtual environment**:
   ```bash
   # Windows PowerShell:
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **PostgreSQL Configuration (Optional)**:
   - Create a database in PostgreSQL:
     ```sql
     CREATE DATABASE staynest_db;
     ```
   - In `backend/.env`, set `DATABASE_ENGINE=postgresql` and enter your PostgreSQL credentials.
   - If using SQLite, keep `DATABASE_ENGINE=sqlite`.

5. **Apply Database Migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Seed Sample Data (16+ properties, amenities, reviews, bookings, users)**:
   ```bash
   python manage.py seed_data
   ```

7. **Create a Custom Superuser (Optional)**:
   ```bash
   python manage.py createsuperuser
   ```

8. **Start Django Backend Server**:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   *The API will be available at `http://127.0.0.1:8000/api/`*

---

### 3. Frontend Setup

1. **Navigate to the frontend directory** (in a separate terminal):
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   *The React application will be accessible at `http://localhost:5173/`*

---

## 🔑 Demo Login Credentials

The `seed_data` command generates pre-configured test accounts for each user role:

| Role | Email | Password | Permissions & Dashboard |
|---|---|---|---|
| **Admin** | `admin@staynest.com` | `admin123` | Full administrative control, users, properties moderation, all bookings |
| **Host** | `host@staynest.com` | `host123` | Host dashboard, listing creation, reservations, earnings |
| **Host 2** | `sarah.host@staynest.com` | `host123` | International listings in London and Dubai |
| **Guest** | `guest@staynest.com` | `guest123` | Bookings, profile, wishlist, search & filter |

> **Pro Tip**: On the `/login` page, you can use the **Quick Demo Login** buttons ("Demo Guest", "Demo Host", "Demo Admin") to log in with one click!

---

## 📡 REST API Reference

### Authentication (`/api/auth/`)
- `POST /api/auth/register/` - Register new guest or host user
- `POST /api/auth/login/` - Obtain JWT access & refresh tokens
- `POST /api/auth/refresh/` - Refresh expired access token
- `GET /api/auth/profile/` - Retrieve authenticated user profile
- `PUT /api/auth/profile/` - Update user profile information & role

### Properties (`/api/properties/`)
- `GET /api/properties/` - List & filter properties:
  - Query parameters: `location`, `city`, `category`, `property_type`, `min_price`, `max_price`, `guests`, `bedrooms`, `bathrooms`, `amenities`, `sort`
- `POST /api/properties/` - Create a new property listing (Host/Admin)
- `GET /api/properties/<id>/` - Retrieve full property details
- `PUT /api/properties/<id>/` - Update property (Host owner/Admin)
- `DELETE /api/properties/<id>/` - Delete property listing (Host owner/Admin)
- `GET /api/properties/<id>/availability/` - Return booked dates & check availability
- `POST /api/properties/<id>/images/` - Upload image files for property
- `GET /api/properties/amenities/` - List all amenities

### Bookings (`/api/bookings/`)
- `POST /api/bookings/` - Create a reservation (with overlap validation)
- `GET /api/bookings/` - List current user's reservations
- `GET /api/bookings/<id>/` - Retrieve single booking details
- `PUT /api/bookings/<id>/` - Update or cancel booking
- `DELETE /api/bookings/<id>/` - Cancel/delete booking

### Reviews (`/api/properties/<id>/reviews/`)
- `GET /api/properties/<id>/reviews/` - List property reviews
- `POST /api/properties/<id>/reviews/` - Submit a review (Rating 1-5 + Comment)

### Wishlist (`/api/wishlist/`)
- `GET /api/wishlist/` - List saved wishlist properties
- `POST /api/wishlist/` - Add property to wishlist
- `DELETE /api/wishlist/<property_id>/` - Remove property from wishlist

### Host Dashboard (`/api/host/`)
- `GET /api/host/properties/` - List properties owned by host
- `GET /api/host/bookings/` - List all reservations for host properties
- `GET /api/host/earnings/` - Get host financial stats & monthly breakdown

### Admin Console (`/api/admin/` & `/api/auth/admin/`)
- `GET /api/auth/admin/users/` - List & search all users
- `PATCH /api/auth/admin/users/<id>/` - Update user role
- `DELETE /api/auth/admin/users/<id>/` - Delete user account
- `GET /api/admin/properties/` - List & moderate all properties
- `DELETE /api/properties/<id>/` - Delete inappropriate listing
- `GET /api/admin/bookings/` - List all platform bookings
- `GET /api/admin/stats/` - Aggregate platform overview metrics

---

## 🛡️ Security Features
- **Password Hashing**: Django PBKDF2 with SHA-256
- **JWT Protection**: Tokens signed with secret keys, stored in client with automatic refresh
- **Role-Based Access Control**: `IsHostUserRole`, `IsAdminUserRole`, and `IsOwnerOrReadOnly`
- **Database Validation**: Overlapping date prevention at both model clean and DRF serializer level
- **CORS Protection**: Configured via `django-cors-headers`
- **Environment Isolation**: No hardcoded secrets; configuration loaded from `.env`

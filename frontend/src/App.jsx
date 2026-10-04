import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { BookingProvider } from './context/BookingContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  ProtectedRoute,
  HostRoute,
  AdminRoute,
} from './components/ProtectedRoutes';

// Public Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Guest Pages
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import MyBookings from './pages/MyBookings';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';

// Host Pages
import HostDashboard from './pages/HostDashboard';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import MyListings from './pages/MyListings';
import HostReservations from './pages/HostReservations';
import HostEarnings from './pages/HostEarnings';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProperties from './pages/AdminProperties';
import AdminBookings from './pages/AdminBookings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <BookingProvider>
            <div className="app-layout">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/properties/:id" element={<PropertyDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Guest Protected Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/booking-confirmation"
                    element={
                      <ProtectedRoute>
                        <BookingConfirmation />
                      </ProtectedRoute>
                    }
                  />

                  {/* Host Protected Routes */}
                  <Route
                    path="/host/dashboard"
                    element={
                      <HostRoute>
                        <HostDashboard />
                      </HostRoute>
                    }
                  />
                  <Route
                    path="/host/add-property"
                    element={
                      <HostRoute>
                        <AddProperty />
                      </HostRoute>
                    }
                  />
                  <Route
                    path="/host/edit-property/:id"
                    element={
                      <HostRoute>
                        <EditProperty />
                      </HostRoute>
                    }
                  />
                  <Route
                    path="/host/listings"
                    element={
                      <HostRoute>
                        <MyListings />
                      </HostRoute>
                    }
                  />
                  <Route
                    path="/host/reservations"
                    element={
                      <HostRoute>
                        <HostReservations />
                      </HostRoute>
                    }
                  />
                  <Route
                    path="/host/earnings"
                    element={
                      <HostRoute>
                        <HostEarnings />
                      </HostRoute>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <AdminUsers />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/properties"
                    element={
                      <AdminRoute>
                        <AdminProperties />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/bookings"
                    element={
                      <AdminRoute>
                        <AdminBookings />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </BookingProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

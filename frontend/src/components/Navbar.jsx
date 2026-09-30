import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Heart,
  User,
  Menu,
  LogOut,
  Building,
  Shield,
  Calendar,
  DollarSign,
  PlusCircle,
  Home,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, isAuthenticated, isHost, isAdmin, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-box">
            <Compass size={24} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <span className="logo-text">StayNest</span>
        </Link>

        {/* Center Navigation / Compact Search */}
        <div className="navbar-center">
          {!isHome ? (
            <SearchBar variant="compact" />
          ) : (
            <div className="nav-links-center">
              <Link to="/" className="nav-center-link active">
                Stays
              </Link>
              <Link to="/search" className="nav-center-link">
                Experiences
              </Link>
            </div>
          )}
        </div>

        {/* Right Menu & Profile */}
        <div className="navbar-right">
          {/* Host Mode Shortcut */}
          {isAuthenticated ? (
            isHost ? (
              <Link to="/host/dashboard" className="btn-ghost btn-sm host-cta">
                Host Dashboard
              </Link>
            ) : (
              <Link to="/profile" className="btn-ghost btn-sm host-cta">
                Switch to hosting
              </Link>
            )
          ) : (
            <Link to="/login" className="btn-ghost btn-sm host-cta">
              Become a host
            </Link>
          )}

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="navbar-icon-btn"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="wishlist-badge">{wishlistItems.length}</span>
            )}
          </Link>

          {/* User Dropdown Pill */}
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="user-menu-pill"
              aria-label="User menu"
            >
              <Menu size={18} />
              {isAuthenticated && user?.avatar ? (
                <img src={user.avatar} alt="User" className="user-pill-avatar" />
              ) : (
                <div className="user-pill-placeholder">
                  <User size={16} />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="dropdown-menu">
                {isAuthenticated ? (
                  <>
                    {/* User Profile Summary */}
                    <div className="dropdown-user-header">
                      <div className="user-header-name">{user?.full_name || user?.email}</div>
                      <div className="user-header-email">{user?.email}</div>
                      <span className={`badge badge-${user?.role || 'guest'}`}>
                        {user?.role}
                      </span>
                    </div>

                    <div className="dropdown-divider" />

                    {/* Guest Section */}
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserCircle size={16} /> Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Calendar size={16} /> My Bookings
                    </Link>
                    <Link
                      to="/wishlist"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Heart size={16} /> Wishlist
                    </Link>

                    {/* Host Section */}
                    {isHost && (
                      <>
                        <div className="dropdown-divider" />
                        <div className="dropdown-section-title">Host Controls</div>
                        <Link
                          to="/host/dashboard"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Building size={16} /> Host Dashboard
                        </Link>
                        <Link
                          to="/host/add-property"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <PlusCircle size={16} /> Create Listing
                        </Link>
                        <Link
                          to="/host/listings"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Home size={16} /> My Listings
                        </Link>
                        <Link
                          to="/host/reservations"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Calendar size={16} /> Host Reservations
                        </Link>
                        <Link
                          to="/host/earnings"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <DollarSign size={16} /> Earnings & Stats
                        </Link>
                      </>
                    )}

                    {/* Admin Section */}
                    {isAdmin && (
                      <>
                        <div className="dropdown-divider" />
                        <div className="dropdown-section-title">Admin Management</div>
                        <Link
                          to="/admin/dashboard"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Shield size={16} /> Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/users"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Users Management
                        </Link>
                        <Link
                          to="/admin/properties"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Properties Management
                        </Link>
                        <Link
                          to="/admin/bookings"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Bookings Management
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider" />

                    <button
                      onClick={handleLogout}
                      className="dropdown-item dropdown-logout-btn"
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="dropdown-item"
                      style={{ fontWeight: 600 }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign up
                    </Link>
                    <div className="dropdown-divider" />
                    <Link
                      to="/login"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Host your home
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          background: #FFFFFF;
          border-bottom: 1px solid var(--border-light);
          height: var(--nav-height);
          z-index: 100;
          display: flex;
          align-items: center;
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon-box {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(255, 56, 92, 0.3);
        }
        .logo-text {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .navbar-center {
          display: flex;
          align-items: center;
        }
        .nav-links-center {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .nav-center-link {
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .nav-center-link.active, .nav-center-link:hover {
          color: var(--text-main);
          font-weight: 600;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .host-cta {
          font-weight: 600;
        }
        .navbar-icon-btn {
          position: relative;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          transition: var(--transition);
        }
        .navbar-icon-btn:hover {
          background-color: var(--bg-secondary);
        }
        .wishlist-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: #FF385C;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dropdown-wrapper {
          position: relative;
        }
        .user-menu-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 8px 5px 12px;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-full);
          background: #FFFFFF;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        .user-menu-pill:hover {
          box-shadow: var(--shadow-md);
        }
        .user-pill-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-pill-placeholder {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #717171;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 250px;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-light);
          padding: 10px 0;
          z-index: 1000;
          animation: fadeIn 0.15s ease-out;
        }
        .dropdown-user-header {
          padding: 10px 18px;
        }
        .user-header-name {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .user-header-email {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 6px;
          word-break: break-all;
        }
        .dropdown-divider {
          height: 1px;
          background-color: var(--border-light);
          margin: 6px 0;
        }
        .dropdown-section-title {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          padding: 6px 18px 2px 18px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          font-size: 0.9rem;
          color: var(--text-main);
          width: 100%;
          text-align: left;
          transition: background-color 0.15s ease;
        }
        .dropdown-item:hover {
          background-color: var(--bg-secondary);
        }
        .dropdown-logout-btn {
          color: var(--danger);
        }
        @media (max-width: 768px) {
          .nav-links-center, .host-cta {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

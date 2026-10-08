import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Calendar, MapPin, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getMyBookings();
      setBookings(data.results || data || []);
    } catch (err) {
      console.error('Failed to load bookings', err);
      setError('Could not load your reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await bookingService.cancelBooking(bookingId);
      // Refresh local list
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      console.error('Failed to cancel booking', err);
      alert('Unable to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching your reservations..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBookings} />;

  return (
    <div className="container bookings-page animate-fade-in">
      <div className="bookings-header">
        <h1 className="bookings-title">Trips & Reservations</h1>
        <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
          Manage your upcoming trips and review your past adventures.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bookings-empty card">
          <Calendar size={48} color="var(--text-muted)" />
          <h3>No trips booked... yet!</h3>
          <p className="text-muted">
            Time to dust off your bags and start planning your next getaway.
          </p>
          <Link to="/" className="btn btn-primary btn-md">
            Start Searching
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const prop = booking.property || {};
            const isCancelled = booking.status === 'cancelled';
            const canCancel =
              !isCancelled &&
              booking.status !== 'completed' &&
              new Date(booking.check_in) > new Date();

            return (
              <div key={booking.id} className="booking-item-card card">
                <div className="booking-card-image-col">
                  <img
                    src={
                      prop.primary_image ||
                      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={prop.title || 'Property'}
                  />
                </div>

                <div className="booking-card-content">
                  <div className="booking-content-top">
                    <div>
                      <span className={`badge badge-status-${booking.status}`}>
                        {booking.status}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '8px' }}>
                        <Link to={`/properties/${prop.id}`}>
                          {prop.title || 'StayNest Property'}
                        </Link>
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                        <MapPin size={15} />
                        <span>{prop.city}, {prop.country}</span>
                      </div>
                    </div>

                    <div className="booking-price-badge">
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                        {formatCurrency(booking.total_price)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
                      </div>
                    </div>
                  </div>

                  <div className="booking-dates-row">
                    <div className="booking-date-block">
                      <span className="date-block-label">CHECK-IN</span>
                      <span className="date-block-val">{formatDate(booking.check_in)}</span>
                    </div>
                    <div className="booking-date-block">
                      <span className="date-block-label">CHECKOUT</span>
                      <span className="date-block-val">{formatDate(booking.check_out)}</span>
                    </div>
                    <div className="booking-date-block">
                      <span className="date-block-label">GUESTS</span>
                      <span className="date-block-val">{booking.guests} guests</span>
                    </div>
                    <div className="booking-date-block">
                      <span className="date-block-label">BOOKING ID</span>
                      <span className="date-block-val">#STAY-{booking.id}</span>
                    </div>
                  </div>

                  <div className="booking-actions-row">
                    <Link
                      to={`/properties/${prop.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      View Property
                    </Link>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)' }}
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Reservation'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .bookings-page {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .bookings-header {
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .bookings-title {
          font-size: 2rem;
          font-weight: 800;
        }
        .bookings-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 80px 20px;
          gap: 16px;
          max-width: 500px;
          margin: 0 auto;
        }
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .booking-item-card {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 24px;
          padding: 20px;
          align-items: stretch;
        }
        .booking-card-image-col {
          border-radius: var(--radius-md);
          overflow: hidden;
          height: 100%;
          min-height: 180px;
        }
        .booking-card-image-col img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .booking-card-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
        }
        .booking-content-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }
        .booking-price-badge {
          text-align: right;
        }
        .booking-dates-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          gap: 12px;
        }
        .date-block-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }
        .date-block-val {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .booking-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .booking-item-card {
            grid-template-columns: 1fr;
          }
          .booking-card-image-col {
            height: 180px;
          }
          .booking-dates-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;

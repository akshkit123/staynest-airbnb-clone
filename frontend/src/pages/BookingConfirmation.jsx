import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CheckCircle2, Calendar, MapPin, Users, ArrowRight, Home } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

const BookingConfirmation = () => {
  const { lastConfirmedBooking } = useBooking();

  if (!lastConfirmedBooking) {
    return <Navigate to="/my-bookings" replace />;
  }

  const booking = lastConfirmedBooking;
  const prop = booking.property || {};

  return (
    <div className="container confirmation-page animate-fade-in">
      <div className="confirmation-card card">
        <div className="confirmation-success-icon">
          <CheckCircle2 size={44} color="#008A05" />
        </div>

        <h1 className="confirmation-title">Booking Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your reservation is confirmed. We've sent the details and receipt to your email address.
        </p>

        <div className="confirmation-badge-id">
          <span>Booking Reference: </span>
          <strong>#STAY-{booking.id}</strong>
        </div>

        {/* Property & Stay Summary */}
        <div className="confirmed-prop-box">
          <img
            src={
              prop.primary_image ||
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
            }
            alt={prop.title}
            className="confirmed-prop-image"
          />
          <div className="confirmed-prop-info">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {prop.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              <MapPin size={16} />
              <span>{prop.location}, {prop.city}, {prop.country}</span>
            </div>

            <div className="confirmed-specs-grid">
              <div>
                <span className="spec-label">Check-in</span>
                <span className="spec-val">{formatDate(booking.check_in)}</span>
              </div>
              <div>
                <span className="spec-label">Checkout</span>
                <span className="spec-val">{formatDate(booking.check_out)}</span>
              </div>
              <div>
                <span className="spec-label">Guests</span>
                <span className="spec-val">{booking.guests} guests</span>
              </div>
              <div>
                <span className="spec-label">Total Paid</span>
                <span className="spec-val" style={{ color: 'var(--primary)' }}>
                  {formatCurrency(booking.total_price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="confirmation-actions">
          <Link to="/my-bookings" className="btn btn-primary btn-lg">
            View My Trips <ArrowRight size={18} />
          </Link>
          <Link to="/" className="btn btn-outline btn-lg">
            <Home size={18} /> Return Home
          </Link>
        </div>
      </div>

      <style>{`
        .confirmation-page {
          padding-top: 40px;
          padding-bottom: 80px;
          display: flex;
          justify-content: center;
        }
        .confirmation-card {
          width: 100%;
          max-width: 680px;
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .confirmation-success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--success-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .confirmation-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .confirmation-subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          margin-top: 8px;
          max-width: 480px;
        }
        .confirmation-badge-id {
          margin: 20px 0;
          padding: 8px 16px;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-full);
          font-size: 0.95rem;
          color: var(--text-main);
        }
        .confirmed-prop-box {
          width: 100%;
          display: flex;
          gap: 20px;
          text-align: left;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 20px;
          margin: 16px 0 32px 0;
        }
        .confirmed-prop-image {
          width: 140px;
          height: 140px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }
        .confirmed-prop-info {
          flex: 1;
        }
        .confirmed-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-light);
        }
        .spec-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .spec-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .confirmation-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          width: 100%;
        }
        @media (max-width: 640px) {
          .confirmed-prop-box {
            flex-direction: column;
          }
          .confirmed-prop-image {
            width: 100%;
            height: 180px;
          }
          .confirmation-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;

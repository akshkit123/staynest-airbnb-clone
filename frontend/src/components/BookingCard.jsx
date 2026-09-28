import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, AlertCircle } from 'lucide-react';
import { formatCurrency, calculateNights, calculatePriceBreakdown } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { propertyService } from '../services/propertyService';

const BookingCard = ({ property, bookedRanges = [] }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { saveDraft } = useBooking();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const nights = calculateNights(checkIn, checkOut);
  const breakdown = calculatePriceBreakdown(
    property.price_per_night,
    nights || 1,
    property.cleaning_fee,
    property.service_fee
  );

  // Validate dates against booked ranges
  useEffect(() => {
    setError('');
    if (checkIn && checkOut) {
      if (checkIn >= checkOut) {
        setError('Check-out must be after check-in date.');
        return;
      }

      const inTime = new Date(checkIn).getTime();
      const outTime = new Date(checkOut).getTime();

      const hasConflict = bookedRanges.some((range) => {
        const rStart = new Date(range.check_in).getTime();
        const rEnd = new Date(range.check_out).getTime();
        return inTime < rEnd && outTime > rStart;
      });

      if (hasConflict) {
        setError('Selected dates are unavailable. Please choose different dates.');
      }
    }
  }, [checkIn, checkOut, bookedRanges]);

  const handleReserve = async (e) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates.');
      return;
    }

    if (error) return;

    // Check with backend availability endpoint
    try {
      setCheckingAvailability(true);
      const res = await propertyService.getAvailability(property.id, checkIn, checkOut);
      if (!res.is_available) {
        setError('These dates have just been reserved. Please choose different dates.');
        setCheckingAvailability(false);
        return;
      }
    } catch (err) {
      console.error('Availability check failed', err);
    } finally {
      setCheckingAvailability(false);
    }

    // Save draft in context
    const draft = {
      property,
      property_id: property.id,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      nights,
      price_per_night: property.price_per_night,
      cleaning_fee: property.cleaning_fee,
      service_fee: property.service_fee,
      total_price: breakdown.total,
    };
    saveDraft(draft);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="booking-card">
      {/* Price Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {formatCurrency(property.price_per_night)}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / night</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
          <Star size={14} fill="#222222" color="#222222" />
          <span>{(Number(property.average_rating) || 4.85).toFixed(2)}</span>
          <span style={{ color: 'var(--text-muted)' }}>· {property.review_count || 12} reviews</span>
        </div>
      </div>

      {/* Date & Guest Inputs Box */}
      <div className="booking-inputs-box">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border-medium)' }}>
          <div style={{ padding: '10px 12px', borderRight: '1px solid var(--border-medium)' }}>
            <label className="input-box-label">CHECK-IN</label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              className="box-date-input"
            />
          </div>
          <div style={{ padding: '10px 12px' }}>
            <label className="input-box-label">CHECKOUT</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              className="box-date-input"
            />
          </div>
        </div>

        <div style={{ padding: '10px 12px' }}>
          <label className="input-box-label">GUESTS</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="box-select"
          >
            {[...Array(property.max_guests || 6)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFE4E6',
            color: '#B91C1C',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            margin: '12px 0',
          }}
        >
          <AlertCircle size={16} flexShrink={0} />
          <span>{error}</span>
        </div>
      )}

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        disabled={checkingAvailability || Boolean(error)}
        className="btn btn-primary btn-block btn-lg"
        style={{ marginTop: '16px' }}
      >
        {checkingAvailability ? 'Checking availability...' : 'Reserve'}
      </button>

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px' }}>
        You won't be charged yet
      </p>

      {/* Dynamic Breakdown when dates selected */}
      {nights > 0 && (
        <div className="pricing-breakdown">
          <div className="breakdown-row">
            <span style={{ textDecoration: 'underline' }}>
              {formatCurrency(property.price_per_night)} x {nights} {nights === 1 ? 'night' : 'nights'}
            </span>
            <span>{formatCurrency(breakdown.nightlySubtotal)}</span>
          </div>

          {Number(property.cleaning_fee) > 0 && (
            <div className="breakdown-row">
              <span style={{ textDecoration: 'underline' }}>Cleaning fee</span>
              <span>{formatCurrency(property.cleaning_fee)}</span>
            </div>
          )}

          {Number(property.service_fee) > 0 && (
            <div className="breakdown-row">
              <span style={{ textDecoration: 'underline' }}>StayNest service fee</span>
              <span>{formatCurrency(property.service_fee)}</span>
            </div>
          )}

          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--border-light)',
              margin: '16px 0',
            }}
          />

          <div className="breakdown-row" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
            <span>Total before taxes</span>
            <span>{formatCurrency(breakdown.total)}</span>
          </div>
        </div>
      )}

      <style>{`
        .booking-card {
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: 24px;
          background: #FFFFFF;
          box-shadow: var(--shadow-lg);
          position: sticky;
          top: 100px;
        }
        .booking-inputs-box {
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .input-box-label {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-main);
          display: block;
        }
        .box-date-input {
          border: none;
          background: transparent;
          font-size: 0.85rem;
          width: 100%;
          color: var(--text-main);
          padding-top: 2px;
        }
        .box-select {
          border: none;
          background: transparent;
          font-size: 0.9rem;
          width: 100%;
          color: var(--text-main);
          cursor: pointer;
        }
        .pricing-breakdown {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.92rem;
          color: #4B5563;
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default BookingCard;

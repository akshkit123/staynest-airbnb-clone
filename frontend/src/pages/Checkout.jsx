import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Lock,
  AlertCircle,
  Star,
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { draftBooking, saveConfirmed, clearBookingFlow } = useBooking();
  const { user } = useAuth();

  const [paymentData, setPaymentData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expiration: '12/28',
    cvv: '123',
    zipCode: '90210',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!draftBooking || !draftBooking.property) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>No booking in progress</h2>
        <p className="text-muted" style={{ margin: '12px 0 24px' }}>
          Please select a property and pick your dates first.
        </p>
        <Link to="/" className="btn btn-primary">
          Browse Stays
        </Link>
      </div>
    );
  }

  const {
    property,
    check_in,
    check_out,
    guests,
    nights,
    total_price,
    cleaning_fee,
    service_fee,
    price_per_night,
  } = draftBooking;

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        property_id: property.id,
        check_in,
        check_out,
        guests,
      };

      const confirmed = await bookingService.createBooking(payload);
      saveConfirmed(confirmed);
      clearBookingFlow();
      navigate('/booking-confirmation');
    } catch (err) {
      console.error('Booking submission failed', err);
      const detail =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.check_in?.[0] ||
        err.response?.data?.check_out?.[0] ||
        'Unable to complete reservation. Selected dates may no longer be available.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container checkout-page animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
        >
          <ChevronLeft size={18} /> Back
        </button>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px' }}>
          Confirm and pay
        </h1>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            fontWeight: 600,
          }}
        >
          <AlertCircle size={20} flexShrink={0} />
          <span>{error}</span>
        </div>
      )}

      <div className="checkout-layout">
        {/* Left Column: Form & Trip Details */}
        <div className="checkout-left">
          {/* Your Trip Section */}
          <div className="checkout-section">
            <h2 className="section-subtitle">Your trip</h2>

            <div className="trip-detail-row">
              <div>
                <div style={{ fontWeight: 700 }}>Dates</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  {formatDate(check_in)} – {formatDate(check_out)} ({nights} nights)
                </div>
              </div>
            </div>

            <div className="trip-detail-row">
              <div>
                <div style={{ fontWeight: 700 }}>Guests</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  {guests} {guests === 1 ? 'guest' : 'guests'}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="section-subtitle" style={{ margin: 0 }}>
                Pay with
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Lock size={14} /> Secure 256-bit SSL
              </div>
            </div>

            <div className="card" style={{ padding: '20px', backgroundColor: '#FAFAFA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <CreditCard size={20} color="var(--primary)" />
                <span style={{ fontWeight: 700 }}>Credit or debit card</span>
              </div>

              <div className="form-group">
                <label className="form-label">Card number</label>
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Expiration</label>
                  <input
                    type="text"
                    value={paymentData.expiration}
                    onChange={(e) => setPaymentData({ ...paymentData, expiration: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="checkout-section">
            <h2 className="section-subtitle">Ground rules & Cancellation</h2>
            <p style={{ color: '#4B5563', fontSize: '0.92rem', lineHeight: 1.6 }}>
              We ask every guest to remember a few simple things about what makes a great guest:
              Follow the house rules, treat the Host's home like your own, and leave it clean.
              Cancel before check-in for a full refund under StayCover policy.
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className="btn btn-primary btn-lg btn-block"
            style={{ marginTop: '16px' }}
          >
            {loading ? 'Confirming with host...' : `Confirm and pay · ${formatCurrency(total_price)}`}
          </button>
        </div>

        {/* Right Column: Floating Order Summary */}
        <div className="checkout-right">
          <div className="card summary-card">
            <div className="summary-prop-header">
              <img
                src={
                  property.primary_image ||
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
                }
                alt={property.title}
                className="summary-prop-thumb"
              />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {property.property_type} in {property.city}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '2px 0' }}>
                  {property.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Star size={13} fill="#222222" color="#222222" />
                  <span>{(Number(property.average_rating) || 4.85).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="summary-divider" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#008A05', fontSize: '0.88rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>StayCover Protection Included</span>
            </div>

            <div className="summary-divider" />

            {/* Price Details */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>
              Price details
            </h4>

            <div className="summary-row">
              <span>{formatCurrency(price_per_night)} x {nights} nights</span>
              <span>{formatCurrency(Number(price_per_night) * nights)}</span>
            </div>

            {Number(cleaning_fee) > 0 && (
              <div className="summary-row">
                <span>Cleaning fee</span>
                <span>{formatCurrency(cleaning_fee)}</span>
              </div>
            )}

            {Number(service_fee) > 0 && (
              <div className="summary-row">
                <span>StayNest service fee</span>
                <span>{formatCurrency(service_fee)}</span>
              </div>
            )}

            <div className="summary-divider" />

            <div className="summary-row total-row">
              <span>Total (INR)</span>
              <span>{formatCurrency(total_price)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page {
          padding-top: 32px;
          padding-bottom: 80px;
        }
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 64px;
          align-items: start;
        }
        .checkout-section {
          padding-bottom: 28px;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--border-light);
        }
        .section-subtitle {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .trip-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .summary-card {
          position: sticky;
          top: 100px;
          padding: 24px;
        }
        .summary-prop-header {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .summary-prop-thumb {
          width: 90px;
          height: 90px;
          border-radius: var(--radius-md);
          object-fit: cover;
        }
        .summary-divider {
          height: 1px;
          background-color: var(--border-light);
          margin: 20px 0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #4B5563;
          font-size: 0.95rem;
        }
        .total-row {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          margin-top: 10px;
        }
        @media (max-width: 960px) {
          .checkout-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .checkout-right {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;

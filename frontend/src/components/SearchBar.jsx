import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar as CalendarIcon, Users, Plus, Minus } from 'lucide-react';

const SearchBar = ({ variant = 'hero', initialValues = {} }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initialValues.location || '');
  const [checkIn, setCheckIn] = useState(initialValues.check_in || '');
  const [checkOut, setCheckOut] = useState(initialValues.check_out || '');
  const [guests, setGuests] = useState(Number(initialValues.guests) || 1);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (checkIn) params.set('check_in', checkIn);
    if (checkOut) params.set('check_out', checkOut);
    if (guests > 1) params.set('guests', guests.toString());

    navigate(`/search?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={() => navigate('/search')}
        className="search-pill-compact"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 10px 8px 18px',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer',
          backgroundColor: '#FFFFFF',
          transition: 'var(--transition)',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Anywhere</span>
        <span style={{ height: '14px', width: '1px', backgroundColor: 'var(--border-medium)' }} />
        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Any week</span>
        <span style={{ height: '14px', width: '1px', backgroundColor: 'var(--border-medium)' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Add guests</span>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        >
          <Search size={14} strokeWidth={2.5} />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSearch} className="search-bar-hero" style={{ position: 'relative' }}>
      <div className="search-bar-inner">
        {/* Where */}
        <div className="search-section">
          <label className="search-label">Where</label>
          <div className="search-input-wrapper">
            <MapPin size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search destinations (e.g. Mumbai, Paris)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-text-input"
            />
          </div>
        </div>

        <div className="search-divider" />

        {/* Check in */}
        <div className="search-section">
          <label className="search-label">Check in</label>
          <div className="search-input-wrapper">
            <CalendarIcon size={16} className="search-icon" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="search-date-input"
            />
          </div>
        </div>

        <div className="search-divider" />

        {/* Check out */}
        <div className="search-section">
          <label className="search-label">Check out</label>
          <div className="search-input-wrapper">
            <CalendarIcon size={16} className="search-icon" />
            <input
              type="date"
              value={checkOut}
              min={checkIn || undefined}
              onChange={(e) => setCheckOut(e.target.value)}
              className="search-date-input"
            />
          </div>
        </div>

        <div className="search-divider" />

        {/* Guests */}
        <div
          className="search-section"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowGuestPicker(!showGuestPicker)}
        >
          <label className="search-label">Who</label>
          <div className="search-input-wrapper">
            <Users size={16} className="search-icon" />
            <span style={{ fontSize: '0.9rem', color: guests > 1 ? 'var(--text-main)' : 'var(--text-muted)' }}>
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </span>
          </div>
        </div>

        {/* Search CTA Button */}
        <button type="submit" className="search-submit-btn">
          <Search size={18} strokeWidth={2.5} />
          <span className="search-btn-text">Search</span>
        </button>
      </div>

      {/* Guest Picker Popover */}
      {showGuestPicker && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '20px',
            width: '280px',
            zIndex: 50,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Guests</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ages 13 or above</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                disabled={guests <= 1}
                onClick={() => setGuests(Math.max(1, guests - 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: guests <= 1 ? 0.4 : 1,
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>{guests}</span>
              <button
                type="button"
                disabled={guests >= 16}
                onClick={() => setGuests(guests + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .search-bar-hero {
          background: #FFFFFF;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-lg);
          padding: 8px 12px 8px 24px;
          max-width: 880px;
          margin: 0 auto;
        }
        .search-bar-inner {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .search-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 4px 8px;
        }
        .search-label {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .search-text-input {
          border: none;
          background: transparent;
          font-size: 0.9rem;
          color: var(--text-main);
          width: 100%;
        }
        .search-date-input {
          border: none;
          background: transparent;
          font-size: 0.85rem;
          color: var(--text-main);
          width: 100%;
        }
        .search-divider {
          width: 1px;
          height: 32px;
          background-color: var(--border-light);
          flex-shrink: 0;
        }
        .search-submit-btn {
          background: var(--primary-gradient);
          color: #FFFFFF;
          border-radius: var(--radius-full);
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          flex-shrink: 0;
          transition: var(--transition);
        }
        .search-submit-btn:hover {
          filter: brightness(0.95);
          box-shadow: 0 4px 14px rgba(255, 56, 92, 0.4);
        }
        @media (max-width: 820px) {
          .search-bar-hero {
            border-radius: var(--radius-lg);
            padding: 16px;
          }
          .search-bar-inner {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          .search-divider {
            display: none;
          }
          .search-submit-btn {
            justify-content: center;
          }
        }
      `}</style>
    </form>
  );
};

export default SearchBar;

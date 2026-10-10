import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

const PROPERTY_TYPES = ['All', 'Apartment', 'Villa', 'House', 'Cabin', 'Penthouse', 'Loft'];

const AMENITIES_LIST = [
  { id: 1, name: 'Wifi' },
  { id: 2, name: 'Air conditioning' },
  { id: 3, name: 'Kitchen' },
  { id: 4, name: 'Free parking' },
  { id: 5, name: 'Swimming pool' },
  { id: 6, name: 'Hot tub' },
  { id: 7, name: 'Dedicated workspace' },
  { id: 8, name: 'TV' },
  { id: 11, name: 'Mountain view' },
  { id: 12, name: 'Beach access' },
  { id: 13, name: 'Gym' },
  { id: 17, name: 'Pet friendly' },
];

const FilterSidebar = ({ filters, onChange, onReset }) => {
  const handleTypeSelect = (type) => {
    onChange('property_type', type === 'All' ? '' : type);
  };

  const handleAmenityToggle = (amenityId) => {
    const current = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];
    const strId = amenityId.toString();
    const next = current.includes(strId)
      ? current.filter((id) => id !== strId)
      : [...current, strId];
    onChange('amenities', next.join(','));
  };

  const selectedAmenities = filters.amenities ? filters.amenities.split(',') : [];

  return (
    <aside className="filter-sidebar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.05rem' }}>
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h4 className="filter-heading">Price range (nightly)</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            placeholder="Min (₹)"
            value={filters.min_price || ''}
            onChange={(e) => onChange('min_price', e.target.value)}
            className="form-input"
            style={{ padding: '8px 10px' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>–</span>
          <input
            type="number"
            placeholder="Max (₹)"
            value={filters.max_price || ''}
            onChange={(e) => onChange('max_price', e.target.value)}
            className="form-input"
            style={{ padding: '8px 10px' }}
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="filter-group">
        <h4 className="filter-heading">Property type</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PROPERTY_TYPES.map((type) => {
            const isSelected =
              (type === 'All' && !filters.property_type) ||
              filters.property_type?.toLowerCase() === type.toLowerCase();
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeSelect(type)}
                className={`type-pill ${isSelected ? 'active' : ''}`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rooms and Beds */}
      <div className="filter-group">
        <h4 className="filter-heading">Bedrooms & Bathrooms</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Bedrooms (min)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Any', '1', '2', '3', '4+'].map((num) => {
                const val = num === 'Any' ? '' : num.replace('+', '');
                const isSelected = (filters.bedrooms || '') === val;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onChange('bedrooms', val)}
                    className={`num-btn ${isSelected ? 'active' : ''}`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Bathrooms (min)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Any', '1', '2', '3+'].map((num) => {
                const val = num === 'Any' ? '' : num.replace('+', '');
                const isSelected = (filters.bathrooms || '') === val;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onChange('bathrooms', val)}
                    className={`num-btn ${isSelected ? 'active' : ''}`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="filter-group">
        <h4 className="filter-heading">Amenities</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {AMENITIES_LIST.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity.id.toString());
            return (
              <label
                key={amenity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityToggle(amenity.id)}
                  style={{ width: '18px', height: '18px', accentColor: '#FF385C' }}
                />
                <span>{amenity.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <style>{`
        .filter-sidebar {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 24px;
          height: fit-content;
        }
        .filter-group {
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-light);
        }
        .filter-heading {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text-main);
        }
        .type-pill {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-medium);
          font-size: 0.85rem;
          font-weight: 500;
          background: #FFFFFF;
          color: var(--text-main);
          transition: var(--transition);
        }
        .type-pill.active {
          background: var(--text-main);
          color: #FFFFFF;
          border-color: var(--text-main);
        }
        .num-btn {
          flex: 1;
          padding: 6px 0;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-medium);
          font-size: 0.82rem;
          font-weight: 600;
          background: #FFFFFF;
          color: var(--text-main);
          transition: var(--transition);
        }
        .num-btn.active {
          background: var(--text-main);
          color: #FFFFFF;
          border-color: var(--text-main);
        }
      `}</style>
    </aside>
  );
};

export default FilterSidebar;

import React from 'react';
import PropertyCard from './PropertyCard';
import { Home, Compass } from 'lucide-react';

const PropertyGrid = ({ properties = [], loading = false, onClearFilters }) => {
  if (loading) {
    return (
      <div className="property-grid-container">
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              className="skeleton"
              style={{ width: '100%', aspectRatio: '20 / 19', borderRadius: 'var(--radius-lg)' }}
            />
            <div className="skeleton" style={{ height: '16px', width: '70%' }} />
            <div className="skeleton" style={{ height: '14px', width: '90%' }} />
            <div className="skeleton" style={{ height: '16px', width: '40%' }} />
          </div>
        ))}
        <style>{`
          .property-grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
            gap: 32px 24px;
            margin: 24px 0;
          }
        `}</style>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 24px',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <Compass size={32} />
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
          No properties found
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.95rem' }}>
          Try adjusting your search criteria, dates, or removing active filters to discover more amazing stays.
        </p>
        {onClearFilters && (
          <button onClick={onClearFilters} className="btn btn-outline btn-sm" style={{ marginTop: '8px' }}>
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="property-grid-container">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
      <style>{`
        .property-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 32px 24px;
          margin: 24px 0;
        }
        @media (max-width: 640px) {
          .property-grid-container {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyGrid;

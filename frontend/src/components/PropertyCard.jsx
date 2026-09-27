import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

const PropertyCard = ({ property }) => {
  const { isFavorited, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const favorited = isFavorited(property.id);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await toggleWishlist(property);
  };

  const imageSrc =
    property.primary_image ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
      }}
      className="property-card"
    >
      {/* Clickable Image Container */}
      <Link
        to={`/properties/${property.id}`}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '20 / 19',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: '#EBEBEB',
          marginBottom: '12px',
        }}
      >
        <img
          src={imageSrc}
          alt={property.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          className="card-image"
        />

        {/* Heart Wishlist Button */}
        <button
          onClick={handleHeartClick}
          aria-label={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            zIndex: 2,
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart
            size={24}
            color="#FFFFFF"
            fill={favorited ? '#FF385C' : 'rgba(0, 0, 0, 0.4)'}
            strokeWidth={2}
          />
        </button>

        {/* Category Pill Tag */}
        {property.category && (
          <span
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#222222',
            }}
          >
            {property.category}
          </span>
        )}
      </Link>

      {/* Property Details */}
      <Link to={`/properties/${property.id}`} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <h4
            style={{
              fontWeight: 700,
              fontSize: '0.98rem',
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {property.city}, {property.country}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
            <Star size={14} fill="#222222" color="#222222" />
            <span>{(Number(property.average_rating) || 4.85).toFixed(2)}</span>
          </div>
        </div>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {property.title}
        </p>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {property.property_type} · {property.max_guests} {property.max_guests === 1 ? 'guest' : 'guests'}
        </p>

        <div style={{ marginTop: '4px', fontSize: '0.96rem' }}>
          <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
            {formatCurrency(property.price_per_night)}
          </span>{' '}
          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>night</span>
        </div>
      </Link>

      <style>{`
        .property-card:hover .card-image {
          transform: scale(1.04);
        }
      `}</style>
    </div>
  );
};

export default PropertyCard;

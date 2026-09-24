import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import PropertyCard from '../components/PropertyCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart, Compass } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, loading } = useWishlist();

  if (loading) return <LoadingSpinner message="Loading your saved stays..." />;

  const properties = wishlistItems.map((item) => item.property).filter(Boolean);

  return (
    <div className="container wishlist-page animate-fade-in">
      <div className="wishlist-header">
        <div>
          <h1 className="wishlist-title">Wishlists</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
            {properties.length} {properties.length === 1 ? 'saved stay' : 'saved stays'}
          </p>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="wishlist-empty-state">
          <div className="empty-icon-circle">
            <Heart size={36} color="var(--primary)" />
          </div>
          <h3>Your wishlist is empty</h3>
          <p>
            As you search and explore on StayNest, tap the heart icon on any stay to save your favorite places here.
          </p>
          <Link to="/" className="btn btn-primary btn-md">
            <Compass size={18} /> Start Exploring
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}

      <style>{`
        .wishlist-page {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .wishlist-header {
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .wishlist-title {
          font-size: 2rem;
          font-weight: 800;
        }
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 32px 24px;
        }
        .wishlist-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px;
          max-width: 460px;
          margin: 0 auto;
          gap: 16px;
        }
        .empty-icon-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wishlist-empty-state h3 {
          font-size: 1.4rem;
          font-weight: 800;
        }
        .wishlist-empty-state p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;

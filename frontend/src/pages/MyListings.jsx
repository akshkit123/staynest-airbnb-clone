import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hostService } from '../services/hostService';
import { propertyService } from '../services/propertyService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../utils/formatters';
import { PlusCircle, Edit3, Trash2, Eye, Star, MapPin } from 'lucide-react';

const MyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostService.getHostProperties();
      setProperties(data.results || data || []);
    } catch (err) {
      console.error('Failed to load listings', err);
      setError('Could not load your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await propertyService.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete property', err);
      alert('Failed to delete property.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your listings..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchListings} />;

  return (
    <div className="container listings-page animate-fade-in">
      <div className="listings-header-row">
        <div>
          <h1 className="listings-title">My Properties</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
            {properties.length} {properties.length === 1 ? 'listing' : 'listings'} listed on StayNest
          </p>
        </div>

        <Link to="/host/add-property" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Listing
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="card empty-listings-box">
          <h3>No properties listed yet</h3>
          <p className="text-muted">
            Start earning with StayNest today by publishing your first vacation home or apartment.
          </p>
          <Link to="/host/add-property" className="btn btn-primary" style={{ marginTop: '12px' }}>
            <PlusCircle size={18} /> Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="listings-grid">
          {properties.map((prop) => (
            <div key={prop.id} className="card listing-card">
              <div className="listing-img-container">
                <img
                  src={
                    prop.primary_image ||
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={prop.title}
                />
                <span className="listing-type-badge">{prop.property_type}</span>
              </div>

              <div className="listing-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <h3 className="listing-card-title">{prop.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', fontWeight: 600 }}>
                    <Star size={14} fill="#222222" color="#222222" />
                    <span>{(Number(prop.average_rating) || 4.85).toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 12px 0' }}>
                  <MapPin size={14} />
                  <span>{prop.city}, {prop.country}</span>
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px' }}>
                  {formatCurrency(prop.price_per_night)}{' '}
                  <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                    / night
                  </span>
                </div>

                <div className="listing-actions-bar">
                  <Link
                    to={`/properties/${prop.id}`}
                    className="btn btn-outline btn-sm"
                    title="View Public Page"
                  >
                    <Eye size={15} /> View
                  </Link>
                  <Link
                    to={`/host/edit-property/${prop.id}`}
                    className="btn btn-secondary btn-sm"
                    title="Edit Listing"
                  >
                    <Edit3 size={15} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(prop.id, prop.title)}
                    disabled={deletingId === prop.id}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger)' }}
                    title="Delete Listing"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .listings-page {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .listings-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
          flex-wrap: wrap;
          gap: 16px;
        }
        .listings-title {
          font-size: 2rem;
          font-weight: 800;
        }
        .empty-listings-box {
          text-align: center;
          padding: 80px 20px;
          max-width: 500px;
          margin: 0 auto;
        }
        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
        }
        .listing-card {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .listing-img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
        }
        .listing-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .listing-type-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .listing-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .listing-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .listing-actions-bar {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default MyListings;

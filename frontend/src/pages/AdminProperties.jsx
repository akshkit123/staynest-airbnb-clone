import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../utils/formatters';
import { Search, Trash2, Eye, Star, MapPin, AlertTriangle } from 'lucide-react';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search.trim()) params.search = search.trim();
      const data = await adminService.getProperties(params);
      setProperties(data.results || data || []);
    } catch (err) {
      console.error('Failed to load admin properties', err);
      setError('Could not load properties catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleDeleteListing = async (propId, title) => {
    if (
      !window.confirm(
        `Admin Action: Are you sure you want to remove listing "${title}" from the platform?`
      )
    ) {
      return;
    }

    try {
      setDeletingId(propId);
      await adminService.deleteProperty(propId);
      setProperties((prev) => prev.filter((p) => p.id !== propId));
    } catch (err) {
      console.error('Failed to delete property', err);
      alert('Failed to remove listing.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container admin-props-page animate-fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Properties Management</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
            Moderate and manage all listings across StayNest. Remove inappropriate or violating stays.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
          <div className="search-input-box" style={{ flex: 1 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search listings by title, city, or host email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="filter-search-input"
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading listings..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProperties} />
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="responsive-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Listing Title</th>
                  <th>Host</th>
                  <th>Location</th>
                  <th>Nightly Price</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td style={{ width: '80px' }}>
                      <img
                        src={
                          p.primary_image ||
                          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={p.title}
                        style={{ width: '70px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/properties/${p.id}`}>{p.title}</Link>
                    </td>
                    <td>{p.host?.full_name || p.host?.email}</td>
                    <td>{p.city}, {p.country}</td>
                    <td style={{ fontWeight: 800 }}>{formatCurrency(p.price_per_night)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={13} fill="#222222" color="#222222" />
                        <span>{(Number(p.average_rating) || 4.85).toFixed(2)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          to={`/properties/${p.id}`}
                          className="btn btn-outline btn-sm"
                          title="View Stay"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(p.id, p.title)}
                          disabled={deletingId === p.id}
                          className="btn btn-danger btn-sm"
                          title="Delete Inappropriate Listing"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .admin-props-page {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .admin-page-header {
          margin-bottom: 24px;
        }
        .admin-page-title {
          font-size: 2rem;
          font-weight: 800;
        }
        .search-input-box {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
        }
        .filter-search-input {
          border: none;
          background: transparent;
          width: 100%;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default AdminProperties;

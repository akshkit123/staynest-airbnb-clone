import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Calendar, Shield } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getBookings();
      setBookings(data.results || data || []);
    } catch (err) {
      console.error('Failed to load admin bookings', err);
      setError('Could not load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <LoadingSpinner message="Loading all bookings..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchBookings} />;

  return (
    <div className="container admin-bookings-page animate-fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bookings Management</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
            System-wide overview of all reservations and transaction volumes.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="responsive-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Property</th>
                <th>Guest</th>
                <th>Dates</th>
                <th>Nights</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Booked On</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                    #STAY-{b.id}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    <Link to={`/properties/${b.property?.id}`}>
                      {b.property?.title}
                    </Link>
                  </td>
                  <td>{b.guest?.full_name || b.guest?.email}</td>
                  <td>{formatDate(b.check_in)} – {formatDate(b.check_out)}</td>
                  <td>{b.nights}</td>
                  <td style={{ fontWeight: 800 }}>{formatCurrency(b.total_price)}</td>
                  <td>
                    <span className={`badge badge-status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(b.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-bookings-page {
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
      `}</style>
    </div>
  );
};

export default AdminBookings;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hostService } from '../services/hostService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Calendar, User, Mail, MapPin } from 'lucide-react';

const HostReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostService.getHostBookings();
      setReservations(data.results || data || []);
    } catch (err) {
      console.error('Failed to load host reservations', err);
      setError('Could not load guest reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) return <LoadingSpinner message="Fetching guest reservations..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReservations} />;

  return (
    <div className="container reservations-page animate-fade-in">
      <div className="reservations-header">
        <h1 className="reservations-title">Guest Reservations</h1>
        <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
          All upcoming and past guest bookings across your properties.
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Calendar size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3>No reservations yet</h3>
          <p className="text-muted">
            Once guests book your properties, their details and arrival dates will appear here.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="responsive-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Property</th>
                  <th>Guest</th>
                  <th>Contact</th>
                  <th>Dates</th>
                  <th>Guests</th>
                  <th>Total Earned</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                      #STAY-{item.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/properties/${item.property?.id}`}>
                        {item.property?.title}
                      </Link>
                    </td>
                    <td>{item.guest?.full_name || 'Guest'}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {item.guest?.email}
                      </div>
                    </td>
                    <td>{formatDate(item.check_in)} – {formatDate(item.check_out)}</td>
                    <td>{item.guests}</td>
                    <td style={{ fontWeight: 800 }}>{formatCurrency(item.total_price)}</td>
                    <td>
                      <span className={`badge badge-status-${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .reservations-page {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .reservations-header {
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .reservations-title {
          font-size: 2rem;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
};

export default HostReservations;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Users,
  Home,
  Calendar,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Shield,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
      setError('Could not load administrative platform metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading StayNest Admin Console..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAdminStats} />;

  const {
    total_users = 0,
    total_hosts = 0,
    total_properties = 0,
    total_bookings = 0,
    total_volume = 0,
    recent_users = [],
    recent_bookings = [],
  } = stats || {};

  return (
    <div className="container admin-dashboard-page animate-fade-in">
      <div className="admin-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={24} color="#7E22CE" />
            <span className="badge badge-admin">Master Control</span>
          </div>
          <h1 className="admin-title">Platform Administration</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
            System-wide overview of users, listings, reservations, and platform health.
          </p>
        </div>

        <div className="admin-quick-links">
          <Link to="/admin/users" className="btn btn-outline btn-sm">
            Manage Users
          </Link>
          <Link to="/admin/properties" className="btn btn-outline btn-sm">
            Manage Properties
          </Link>
          <Link to="/admin/bookings" className="btn btn-outline btn-sm">
            Manage Bookings
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        <div className="card admin-metric-card">
          <div className="admin-metric-icon" style={{ backgroundColor: '#F3E8FF', color: '#7E22CE' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="admin-metric-label">Total Users</div>
            <div className="admin-metric-val">{total_users}</div>
            <div className="admin-metric-sub">{total_hosts} registered hosts</div>
          </div>
        </div>

        <div className="card admin-metric-card">
          <div className="admin-metric-icon" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <Home size={22} />
          </div>
          <div>
            <div className="admin-metric-label">Properties</div>
            <div className="admin-metric-val">{total_properties}</div>
            <div className="admin-metric-sub">Across 10+ global cities</div>
          </div>
        </div>

        <div className="card admin-metric-card">
          <div className="admin-metric-icon" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="admin-metric-label">Total Bookings</div>
            <div className="admin-metric-val">{total_bookings}</div>
            <div className="admin-metric-sub">Platform reservations</div>
          </div>
        </div>

        <div className="card admin-metric-card">
          <div className="admin-metric-icon" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div className="admin-metric-label">Gross Volume</div>
            <div className="admin-metric-val">{formatCurrency(total_volume)}</div>
            <div className="admin-metric-sub">Processed volume</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Users & Recent Bookings */}
      <div className="admin-tables-grid">
        {/* Recent Users Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Newest Users</h3>
            <Link to="/admin/users" className="btn-ghost btn-sm" style={{ fontWeight: 600 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="responsive-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recent_users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>
                      {u.first_name} {u.last_name}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td>{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Platform Bookings</h3>
            <Link to="/admin/bookings" className="btn-ghost btn-sm" style={{ fontWeight: 600 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="responsive-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Stay</th>
                  <th>Guest</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent_bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.property?.title}
                    </td>
                    <td>{b.guest?.full_name || b.guest?.email}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(b.total_price)}</td>
                    <td>
                      <span className={`badge badge-status-${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard-page {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .admin-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .admin-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-top: 6px;
        }
        .admin-quick-links {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .admin-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 36px;
        }
        .admin-metric-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }
        .admin-metric-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-metric-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .admin-metric-val {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 2px 0;
        }
        .admin-metric-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .admin-tables-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        @media (max-width: 1024px) {
          .admin-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .admin-tables-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .admin-metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

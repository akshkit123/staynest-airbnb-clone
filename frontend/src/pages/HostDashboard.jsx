import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hostService } from '../services/hostService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  DollarSign,
  Calendar,
  Home,
  PlusCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  MapPin,
} from 'lucide-react';

const HostDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHostStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const earningsData = await hostService.getHostEarnings();
      setData(earningsData);
    } catch (err) {
      console.error('Failed to load host stats', err);
      setError('Could not load host dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your host dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHostStats} />;

  const {
    total_earnings = 0,
    total_bookings = 0,
    total_properties = 0,
    monthly_stats = [],
    recent_reservations = [],
  } = data || {};

  return (
    <div className="container host-dashboard-page animate-fade-in">
      {/* Top Header */}
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-title">Host Dashboard</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
            Welcome back! Here's an overview of your hosting performance.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Link to="/host/add-property" className="btn btn-primary">
            <PlusCircle size={18} /> Create New Listing
          </Link>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card card">
          <div className="metric-icon-box" style={{ background: '#DCFCE7', color: '#15803D' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="metric-label">Total Earnings</div>
            <div className="metric-value">{formatCurrency(total_earnings)}</div>
            <div className="metric-sub">Confirmed & completed stays</div>
          </div>
        </div>

        <div className="metric-card card">
          <div className="metric-icon-box" style={{ background: '#E0F2FE', color: '#0369A1' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="metric-label">Total Bookings</div>
            <div className="metric-value">{total_bookings}</div>
            <div className="metric-sub">Guest reservations</div>
          </div>
        </div>

        <div className="metric-card card">
          <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <Home size={24} />
          </div>
          <div>
            <div className="metric-label">Active Listings</div>
            <div className="metric-value">{total_properties}</div>
            <div className="metric-sub">Published properties</div>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart / Trend Bar */}
      <div className="dashboard-section card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Monthly Performance</h3>
          </div>
          <Link to="/host/earnings" className="btn-ghost btn-sm" style={{ fontWeight: 600 }}>
            Full Earnings Report <ArrowRight size={14} />
          </Link>
        </div>

        <div className="chart-bar-container">
          {monthly_stats.map((stat, idx) => {
            const maxVal = Math.max(...monthly_stats.map((s) => s.earnings), 1);
            const heightPct = Math.max(15, (stat.earnings / maxVal) * 100);

            return (
              <div key={idx} className="chart-bar-column">
                <div className="chart-bar-tooltip">
                  {formatCurrency(stat.earnings)}
                </div>
                <div
                  className="chart-bar-fill"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="chart-bar-month">{stat.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="host-quick-nav-grid">
        <Link to="/host/listings" className="quick-nav-card card">
          <Home size={28} color="var(--primary)" />
          <div>
            <h4>Manage Listings</h4>
            <p>Edit pricing, update photos, or add amenities to your spaces.</p>
          </div>
        </Link>

        <Link to="/host/reservations" className="quick-nav-card card">
          <Calendar size={28} color="var(--primary)" />
          <div>
            <h4>Guest Reservations</h4>
            <p>Review check-in dates, guest counts, and booking details.</p>
          </div>
        </Link>
      </div>

      {/* Recent Reservations Table */}
      <div className="dashboard-section card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent Reservations</h3>
          </div>
          <Link to="/host/reservations" className="btn-ghost btn-sm" style={{ fontWeight: 600 }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {recent_reservations.length === 0 ? (
          <p className="text-muted" style={{ padding: '24px 0', textAlign: 'center' }}>
            No reservations received yet. Ensure your property pricing and dates are up to date!
          </p>
        ) : (
          <div className="responsive-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Guest</th>
                  <th>Dates</th>
                  <th>Nights</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent_reservations.map((res) => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/properties/${res.property?.id}`}>
                        {res.property?.title}
                      </Link>
                    </td>
                    <td>{res.guest?.full_name || res.guest?.email}</td>
                    <td>{formatDate(res.check_in)} – {formatDate(res.check_out)}</td>
                    <td>{res.nights}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(res.total_price)}</td>
                    <td>
                      <span className={`badge badge-status-${res.status}`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .host-dashboard-page {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .dashboard-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .dashboard-title {
          font-size: 2.2rem;
          font-weight: 800;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }
        .metric-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }
        .metric-icon-box {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .metric-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 2px 0;
        }
        .metric-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .dashboard-section {
          margin-bottom: 32px;
          padding: 28px;
        }
        .chart-bar-container {
          display: flex;
          align-items: flex-end;
          gap: 24px;
          height: 180px;
          padding: 20px 10px 0 10px;
        }
        .chart-bar-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
          position: relative;
        }
        .chart-bar-fill {
          width: 100%;
          max-width: 44px;
          background: var(--primary-gradient);
          border-radius: 6px 6px 0 0;
          transition: height 0.4s ease;
        }
        .chart-bar-month {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-top: 10px;
        }
        .chart-bar-tooltip {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 6px;
        }
        .host-quick-nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .quick-nav-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          transition: var(--transition);
        }
        .quick-nav-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .quick-nav-card h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .quick-nav-card p {
          color: var(--text-muted);
          font-size: 0.88rem;
        }
        .responsive-table-wrapper {
          overflow-x: auto;
        }
        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.92rem;
        }
        .dashboard-table th {
          padding: 12px 16px;
          border-bottom: 2px solid var(--border-light);
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .dashboard-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        @media (max-width: 820px) {
          .metrics-grid, .host-quick-nav-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HostDashboard;

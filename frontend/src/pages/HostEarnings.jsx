import React, { useState, useEffect } from 'react';
import { hostService } from '../services/hostService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../utils/formatters';
import { DollarSign, TrendingUp, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

const HostEarnings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await hostService.getHostEarnings();
      setData(res);
    } catch (err) {
      console.error('Failed to load host earnings', err);
      setError('Could not load earnings metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating host earnings..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEarnings} />;

  const {
    total_earnings = 0,
    total_bookings = 0,
    monthly_stats = [],
  } = data || {};

  const avgPerBooking = total_bookings > 0 ? total_earnings / total_bookings : 0;

  return (
    <div className="container earnings-page animate-fade-in">
      <div className="earnings-header">
        <h1 className="earnings-title">Earnings & Financials</h1>
        <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
          Detailed revenue breakdowns and payout performance.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="earnings-stats-grid">
        <div className="card stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-label">Net Lifetime Earnings</div>
            <div className="stat-val">{formatCurrency(total_earnings)}</div>
          </div>
        </div>

        <div className="card stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#E0F2FE', color: '#0369A1' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-label">Avg. Revenue / Booking</div>
            <div className="stat-val">{formatCurrency(avgPerBooking)}</div>
          </div>
        </div>

        <div className="card stat-box">
          <div className="stat-icon" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div className="stat-label">Payout Status</div>
            <div className="stat-val" style={{ color: '#008A05', fontSize: '1.25rem' }}>
              Direct Deposit Active
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Chart Box */}
      <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>
          Monthly Earnings Breakdown
        </h3>

        <div className="earnings-chart-container">
          {monthly_stats.map((item, idx) => {
            const max = Math.max(...monthly_stats.map((s) => s.earnings), 1);
            const height = Math.max(12, (item.earnings / max) * 100);

            return (
              <div key={idx} className="earnings-chart-col">
                <span className="chart-col-amount">{formatCurrency(item.earnings)}</span>
                <div className="chart-col-bar" style={{ height: `${height}%` }} />
                <span className="chart-col-label">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guarantee Banner */}
      <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        <ShieldCheck size={32} color="#008A05" />
        <div>
          <h4 style={{ fontWeight: 700, color: '#166534' }}>StayCover Host Guarantee</h4>
          <p style={{ color: '#15803D', fontSize: '0.9rem', marginTop: '2px' }}>
            Every reservation is protected up to ₹1 Crore in property damage protection and host liability insurance.
          </p>
        </div>
      </div>

      <style>{`
        .earnings-page {
          padding-top: 36px;
          padding-bottom: 80px;
        }
        .earnings-header {
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .earnings-title {
          font-size: 2rem;
          font-weight: 800;
        }
        .earnings-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }
        .stat-box {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }
        .stat-icon {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .stat-val {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
          margin-top: 4px;
        }
        .earnings-chart-container {
          display: flex;
          align-items: flex-end;
          gap: 28px;
          height: 220px;
          padding-top: 20px;
        }
        .earnings-chart-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
        }
        .chart-col-amount {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }
        .chart-col-bar {
          width: 100%;
          max-width: 52px;
          background: var(--primary-gradient);
          border-radius: 6px 6px 0 0;
          transition: height 0.4s ease;
        }
        .chart-col-label {
          margin-top: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        @media (max-width: 820px) {
          .earnings-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HostEarnings;

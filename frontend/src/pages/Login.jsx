import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'host') {
        navigate('/host/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="login-page-container animate-fade-in">
      <div className="login-card card">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <div className="logo-icon-box">
              <Compass size={22} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <span className="logo-text">StayNest</span>
          </Link>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">
            Log in to manage bookings, wishlists, and properties.
          </p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '12px' }}
          >
            {loading ? 'Logging in...' : 'Continue'}
          </button>
        </form>

        {/* Quick Demo Credentials Helpers */}
        <div className="demo-accounts-box">
          <div className="demo-accounts-title">Quick Demo Login</div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              onClick={() => fillDemoAccount('guest@staynest.com', 'guest123')}
              className="btn btn-secondary btn-sm"
            >
              Demo Guest
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('host@staynest.com', 'host123')}
              className="btn btn-secondary btn-sm"
            >
              Demo Host
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@staynest.com', 'admin123')}
              className="btn btn-secondary btn-sm"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="login-footer">
          <span>Don't have an account? </span>
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign up
          </Link>
        </div>
      </div>

      <style>{`
        .login-page-container {
          min-height: calc(100vh - var(--nav-height) - 100px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background-color: var(--bg-subtle);
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 36px 32px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .login-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .login-title {
          font-size: 1.6rem;
          font-weight: 800;
        }
        .login-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 4px;
        }
        .auth-error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: var(--danger-bg);
          color: var(--danger);
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          margin-bottom: 18px;
        }
        .demo-accounts-box {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border-light);
          text-align: center;
        }
        .demo-accounts-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .demo-buttons-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .login-footer {
          text-align: center;
          font-size: 0.9rem;
          margin-top: 24px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Login;

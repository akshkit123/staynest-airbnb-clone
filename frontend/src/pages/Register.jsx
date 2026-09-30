import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
    role: 'guest',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register(formData);
      if (newUser.role === 'host') {
        navigate('/host/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container animate-fade-in">
      <div className="register-card card">
        <div className="register-header">
          <Link to="/" className="login-logo">
            <div className="logo-icon-box">
              <Compass size={22} color="#FFFFFF" strokeWidth={2.4} />
            </div>
            <span className="logo-text">StayNest</span>
          </Link>
          <h2 className="register-title">Create an account</h2>
          <p className="register-subtitle">
            Join the community to book memorable stays or host your property.
          </p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={18} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Picker */}
          <div className="form-group">
            <label className="form-label">I want to:</label>
            <div className="role-selector-grid">
              <button
                type="button"
                className={`role-option-btn ${formData.role === 'guest' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'guest' })}
              >
                <div style={{ fontWeight: 700 }}>Book stays</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Travel as a Guest</div>
              </button>
              <button
                type="button"
                className={`role-option-btn ${formData.role === 'host' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'host' })}
              >
                <div style={{ fontWeight: 700 }}>Host places</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Earn as a Host</div>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">First name</label>
              <input
                type="text"
                name="first_name"
                required
                placeholder="Aarav"
                value={formData.first_name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input
                type="text"
                name="last_name"
                required
                placeholder="Sharma"
                value={formData.last_name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 555-0199"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <input
                type="password"
                name="password_confirm"
                required
                placeholder="••••••••"
                value={formData.password_confirm}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '12px' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Log in
          </Link>
        </div>
      </div>

      <style>{`
        .register-page-container {
          min-height: calc(100vh - var(--nav-height) - 100px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background-color: var(--bg-subtle);
        }
        .register-card {
          width: 100%;
          max-width: 500px;
          padding: 36px 32px;
        }
        .register-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .register-title {
          font-size: 1.6rem;
          font-weight: 800;
        }
        .register-subtitle {
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
        .role-selector-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .role-option-btn {
          border: 1.5px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 12px;
          text-align: left;
          background: #FFFFFF;
          transition: var(--transition);
        }
        .role-option-btn.active {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }
        .register-footer {
          text-align: center;
          font-size: 0.9rem;
          margin-top: 24px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Register;

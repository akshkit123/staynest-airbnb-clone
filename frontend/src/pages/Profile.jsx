import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, Check, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    role: user?.role || 'guest',
    profile_image_url: user?.profile_image_url || '',
  });

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  if (loading) return <LoadingSpinner fullScreen />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setStatusMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container profile-page animate-fade-in">
      <div className="profile-layout">
        {/* Left Card: Profile Avatar Badge */}
        <div className="profile-badge-card card">
          <div className="avatar-wrapper">
            <img
              src={user?.avatar}
              alt={user?.full_name}
              className="profile-avatar-large"
            />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '16px' }}>
            {user?.full_name}
          </h2>
          <span className={`badge badge-${user?.role || 'guest'}`} style={{ marginTop: '8px' }}>
            {user?.role}
          </span>

          <div className="badge-meta-divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#374151' }}>
              <ShieldCheck size={18} color="#008A05" />
              <span>Identity Verified</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#374151' }}>
              <Mail size={18} color="var(--text-muted)" />
              <span style={{ wordBreak: 'break-all' }}>{user?.email}</span>
            </div>
            {user?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#374151' }}>
                <Phone size={18} color="var(--text-muted)" />
                <span>{user?.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Edit Form */}
        <div className="profile-edit-card card">
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '8px' }}>
            Personal Information
          </h1>
          <p className="text-muted" style={{ marginBottom: '24px', fontSize: '0.92rem' }}>
            Update your account details and manage your account role on StayNest.
          </p>

          {statusMessage.text && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '20px',
                fontSize: '0.9rem',
                backgroundColor: statusMessage.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: statusMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                fontWeight: 600,
              }}
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">First name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+1 555-0199"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar image URL</label>
              <input
                type="url"
                name="profile_image_url"
                value={formData.profile_image_url}
                onChange={handleChange}
                className="form-input"
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
                disabled={user?.role === 'admin'}
              >
                <option value="guest">Guest (Book & Explore)</option>
                <option value="host">Host (List Properties & Earn)</option>
                {user?.role === 'admin' && <option value="admin">Admin</option>}
              </select>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>
                Upgrading to Host unlocks listing creation, reservation tracking, and earnings dashboards.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-lg"
              style={{ marginTop: '12px' }}
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-page {
          padding-top: 40px;
          padding-bottom: 80px;
        }
        .profile-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
          align-items: start;
        }
        .profile-badge-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .profile-avatar-large {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: var(--shadow-md);
        }
        .badge-meta-divider {
          width: 100%;
          height: 1px;
          background-color: var(--border-light);
          margin: 20px 0;
        }
        @media (max-width: 820px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate } from '../utils/formatters';
import { Search, Trash2, Shield, User, Filter } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;
      const data = await adminService.getUsers(params);
      setUsers(data.results || data || []);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Could not load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setProcessingId(userId);
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error('Failed to update role', err);
      alert('Could not update role.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) {
      return;
    }

    try {
      setProcessingId(userId);
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error('Failed to delete user', err);
      alert(err.response?.data?.error || 'Failed to delete user.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="container admin-users-page animate-fade-in">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users Management</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '4px' }}>
            Inspect platform members, promote accounts to hosts, or manage access.
          </p>
        </div>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="admin-filter-bar card">
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, gap: '10px' }}>
          <div className="search-input-box">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="filter-search-input"
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="guest">Guests</option>
            <option value="host">Hosts</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Searching users..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchUsers} />
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="responsive-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Current Role</th>
                  <th>Joined Date</th>
                  <th>Change Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={u.avatar}
                          alt={u.full_name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{u.full_name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>
                      <select
                        value={u.role}
                        disabled={processingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="guest">Guest</option>
                        <option value="host">Host</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        disabled={processingId === u.id}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .admin-users-page {
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
        .admin-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .search-input-box {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          flex: 1;
          max-width: 400px;
        }
        .filter-search-input {
          border: none;
          background: transparent;
          width: 100%;
          font-size: 0.9rem;
        }
        .filter-select {
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          font-size: 0.88rem;
          cursor: pointer;
        }
        .role-select {
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 4px 8px;
          font-size: 0.82rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Users, Trash2, Calendar, UserCheck, Shield, Award } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AdminUsers = () => {
  const { token, user: currentUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleRoleChange = async (userId, targetRole) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: targetRole }),
      });

      if (response.ok) {
        toast.success(`User role adjusted to '${targetRole}' successfully.`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: targetRole } : u))
        );
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error modifying user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser._id) {
      return toast.warning('You cannot delete your own administrative account.');
    }

    if (!window.confirm('Are you sure you want to delete this user and all prompts they created? This action is permanent.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('User and associated data purged successfully.');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        const data = await response.json();
        toast.error(data.message || 'Purge action failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error removing user');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>User Role & Accounts Management</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Review accounts, modify role scopes, and delete users.</p>
      </div>

      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Profile details</th>
              <th>Email Address</th>
              <th>Subscription</th>
              <th>Role Level</th>
              <th>Registered Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {u.photoURL ? (
                      <img src={u.photoURL} alt={u.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: '#131930',
                        color: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: '#94a3b8' }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.subscriptionStatus === 'premium' ? 'badge-green' : 'badge-yellow'}`}>
                    {u.subscriptionStatus}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '0.82rem', width: '130px', height: '32px' }}
                    disabled={u._id === currentUser._id}
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                    <Calendar size={12} />
                    {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="btn btn-danger btn-sm"
                      title="Delete User"
                      style={{ padding: '8px' }}
                      disabled={u._id === currentUser._id}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

// User modification columns layout notes

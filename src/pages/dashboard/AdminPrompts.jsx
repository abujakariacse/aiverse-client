import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  CheckCircle, XCircle, Trash2, Star, Eye, MessageSquare, X, Send 
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiverse-server-two.vercel.app/api';

const AdminPrompts = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal state
  const [rejectionPrompt, setRejectionPrompt] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const fetchAllPrompts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/prompts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllPrompts();
    }
  }, [token]);

  const handleStatusChange = async (promptId, targetStatus, rejectFeedback = '') => {
    try {
      const payload = { status: targetStatus };
      if (targetStatus === 'rejected') {
        payload.rejectionFeedback = rejectFeedback;
      }

      const response = await fetch(`${API_URL}/admin/prompts/${promptId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Prompt status adjusted to '${targetStatus}' successfully.`);
        setPrompts((prev) =>
          prev.map((p) => (p._id === promptId ? { ...p, status: targetStatus, rejectionFeedback: rejectFeedback } : p))
        );
        setRejectionPrompt(null);
        setFeedback('');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update prompt status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating status');
    }
  };

  const handleToggleFeature = async (promptId) => {
    try {
      const response = await fetch(`${API_URL}/admin/prompts/${promptId}/feature`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.featured ? 'Prompt featured successfully!' : 'Prompt removed from featured listing.');
        setPrompts((prev) =>
          prev.map((p) => (p._id === promptId ? { ...p, featured: data.featured } : p))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Error toggling featured status');
    }
  };

  const handleDelete = async (promptId) => {
    if (!window.confirm('Purge this prompt template from the database? This is permanent.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/prompts/${promptId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Prompt template purged.');
        setPrompts((prev) => prev.filter((p) => p._id !== promptId));
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting prompt');
    }
  };

  const openRejectionDialog = (prompt) => {
    setRejectionPrompt(prompt);
    setFeedback('');
  };

  const submitRejection = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      return toast.warning('Feedback content is required for rejections.');
    }
    handleStatusChange(rejectionPrompt._id, 'rejected', feedback);
  };

  const getStatusLabel = (status) => {
    if (status === 'approved') return <span className="badge badge-green">Approved</span>;
    if (status === 'rejected') return <span className="badge badge-red">Rejected</span>;
    return <span className="badge badge-yellow">Pending</span>;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Prompt Template Submissions Moderation</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Approve templates, reject with feedback, or tag featured highlights.</p>
      </div>

      <div className="table-container glass-panel">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Template Title</th>
              <th>Creator</th>
              <th>AI Engine</th>
              <th>Visibility</th>
              <th>Featured</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((p) => (
              <tr key={p._id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Category: {p.category}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{p.creatorName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.creatorEmail}</div>
                </td>
                <td>
                  <span className="badge badge-purple">{p.aiTool}</span>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{p.visibility}</td>
                <td>
                  <button
                    onClick={() => handleToggleFeature(p._id)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      borderColor: p.featured ? '#f59e0b' : 'transparent',
                      color: p.featured ? '#f59e0b' : '#64748b',
                      padding: '4px 8px',
                    }}
                  >
                    <Star size={12} fill={p.featured ? '#f59e0b' : 'none'} />
                    <span>{p.featured ? 'Featured' : 'Feature'}</span>
                  </button>
                </td>
                <td>{getStatusLabel(p.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => navigate(`/prompts/${p._id}`)}
                      className="btn btn-secondary btn-sm"
                      title="Inspect Details"
                      style={{ padding: '8px' }}
                    >
                      <Eye size={14} />
                    </button>
                    {p.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(p._id, 'approved')}
                        className="btn btn-secondary btn-sm text-success"
                        title="Approve"
                        style={{ padding: '8px' }}
                      >
                        <CheckCircle size={14} style={{ color: '#10b981' }} />
                      </button>
                    )}
                    {p.status !== 'rejected' && (
                      <button
                        onClick={() => openRejectionDialog(p)}
                        className="btn btn-secondary btn-sm"
                        title="Reject with Feedback"
                        style={{ padding: '8px' }}
                      >
                        <XCircle size={14} style={{ color: '#f43f5e' }} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="btn btn-danger btn-sm"
                      title="Purge template"
                      style={{ padding: '8px' }}
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

      {/* REJECTION FEEDBACK MODAL */}
      {rejectionPrompt && (
        <div className="modal-overlay">
          <div className="modal-box glass-panel" style={{ maxWidth: '440px' }}>
            <div className="modal-header" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.25rem' }}><XCircle className="text-danger" /> Rejection Feedback</h3>
              <button onClick={() => setRejectionPrompt(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitRejection} className="modal-form" style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Providing actionable feedback for <strong>{rejectionPrompt.title}</strong> helps creators refine prompt templates.
              </p>
              
              <div className="form-group">
                <label className="form-label" htmlFor="reject-feedback">Feedback description *</label>
                <textarea
                  id="reject-feedback"
                  className="form-textarea"
                  placeholder="Explain why this prompt was rejected (e.g. Broken links, poor grammar, duplicate topic)..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  style={{ minHeight: '120px' }}
                />
              </div>

              <div className="modal-action-row">
                <button
                  type="button"
                  onClick={() => setRejectionPrompt(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger"
                >
                  <Send size={14} />
                  <span>Submit Rejection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrompts;

// Admin approval statuses options details

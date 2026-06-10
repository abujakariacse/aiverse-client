import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Edit, Trash2, BarChart2, Eye, Calendar, Lock, CheckCircle, 
  XCircle, AlertCircle, Save, X, PlusCircle 
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiverse-server-two.vercel.app/api';

const MyPrompts = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal states
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editAiTool, setEditAiTool] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('Beginner');
  const [editVisibility, setEditVisibility] = useState('public');
  const [editSubmitLoading, setEditSubmitLoading] = useState(false);

  // Analytics modal states
  const [analyticsPrompt, setAnalyticsPrompt] = useState(null);

  const categories = ['Coding', 'Writing', 'Marketing', 'Graphics & Image', 'Idea Generation', 'System Assistant', 'Other'];
  const aiTools = ['ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'Stable Diffusion', 'Other'];

  const fetchMyPrompts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/prompts/my-prompts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load your prompts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyPrompts();
    }
  }, [token]);

  const handleDelete = async (promptId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this prompt template? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/prompts/${promptId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Prompt deleted successfully!');
        setPrompts((prev) => prev.filter((p) => p._id !== promptId));
        if (analyticsPrompt?._id === promptId) setAnalyticsPrompt(null);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete prompt');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting prompt');
    }
  };

  // Open Edit Modal
  const openEditModal = (prompt) => {
    setEditingPrompt(prompt);
    setEditTitle(prompt.title);
    setEditDesc(prompt.description);
    setEditContent(prompt.content);
    setEditCategory(prompt.category);
    setEditAiTool(prompt.aiTool);
    setEditTags(prompt.tags.join(', '));
    setEditDifficulty(prompt.difficulty);
    setEditVisibility(prompt.visibility);
  };

  // Submit Edit Handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle || !editDesc || !editContent || !editCategory || !editAiTool) {
      return toast.warning('Please fill in all required fields');
    }

    try {
      setEditSubmitLoading(true);
      const tagsArray = editTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '');

      const response = await fetch(`${API_URL}/prompts/${editingPrompt._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDesc,
          content: editContent,
          category: editCategory,
          aiTool: editAiTool,
          tags: tagsArray,
          difficulty: editDifficulty,
          visibility: editVisibility,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Prompt updated successfully! Submitted for admin re-approval.');
        setEditingPrompt(null);
        fetchMyPrompts(); // Reload list to show status changes
      } else {
        toast.error(data.message || 'Failed to update prompt');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating prompt');
    } finally {
      setEditSubmitLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return (
        <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle size={12} /> Approved
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <XCircle size={12} /> Rejected
        </span>
      );
    }
    return (
      <span className="badge badge-yellow" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <AlertCircle size={12} /> Pending
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Prompt Templates</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Review approval statuses, change details, and check analytics.</p>
        </div>
        
        {user?.role === 'creator' && (
          <button
            onClick={() => navigate('/dashboard/add-prompt')}
            className="btn btn-primary"
          >
            <PlusCircle size={16} />
            <span>Create New Prompt</span>
          </button>
        )}
      </div>

      {prompts.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <AlertCircle size={48} style={{ color: '#64748b' }} />
          <h3>No Prompts Found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '380px' }}>
            {user?.role === 'creator'
              ? 'You have not added any prompts yet. Start publishing to reach users!'
              : 'You have not published any prompts. Upgraded Creators can build and monetize prompts.'}
          </p>
          {user?.role === 'creator' && (
            <button onClick={() => navigate('/dashboard/add-prompt')} className="btn btn-primary btn-sm">
              Publish First Prompt
            </button>
          )}
        </div>
      ) : (
        <div className="table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>AI Engine</th>
                <th>Visibility</th>
                <th>Status</th>
                <th>Copies</th>
                <th>Rating</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((prompt) => (
                <tr key={prompt._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{prompt.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      Category: {prompt.category}
                    </div>
                    {prompt.status === 'rejected' && prompt.rejectionFeedback && (
                      <div style={{
                        marginTop: '6px',
                        padding: '6px 10px',
                        background: 'rgba(244, 63, 94, 0.08)',
                        border: '1px solid rgba(244, 63, 94, 0.15)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        color: '#f87171',
                        maxWidth: '300px',
                        whiteSpace: 'normal',
                      }}>
                        <strong>Feedback:</strong> {prompt.rejectionFeedback}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-purple">{prompt.aiTool}</span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize', fontSize: '0.85rem' }}>
                      {prompt.visibility === 'private' && <Lock size={12} className="text-accent" />}
                      {prompt.visibility}
                    </span>
                  </td>
                  <td>{getStatusBadge(prompt.status)}</td>
                  <td style={{ fontWeight: 700 }}>{prompt.copyCount}</td>
                  <td>★ {prompt.averageRating || '0.0'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/prompts/${prompt._id}`)}
                        className="btn btn-secondary btn-sm"
                        title="Preview Details"
                        style={{ padding: '8px' }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => openEditModal(prompt)}
                        className="btn btn-secondary btn-sm"
                        title="Update Prompt"
                        style={{ padding: '8px' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setAnalyticsPrompt(prompt)}
                        className="btn btn-secondary btn-sm"
                        title="Analytics"
                        style={{ padding: '8px' }}
                      >
                        <BarChart2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(prompt._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete Prompt"
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
      )}

      {/* UPDATE PROMPT MODAL */}
      {editingPrompt && (
        <div className="modal-overlay">
          <div className="modal-box glass-panel" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Update Prompt Template</h3>
              <button onClick={() => setEditingPrompt(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="modal-form" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-title">Prompt Title *</label>
                <input
                  type="text"
                  id="edit-title"
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-desc">Prompt Description *</label>
                <input
                  type="text"
                  id="edit-desc"
                  className="form-input"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-content">Prompt Content Template *</label>
                <textarea
                  id="edit-content"
                  className="form-textarea"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  required
                  style={{ minHeight: '140px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-category">Category *</label>
                  <select
                    id="edit-category"
                    className="form-select"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-tool">AI Engine *</label>
                  <select
                    id="edit-tool"
                    className="form-select"
                    value={editAiTool}
                    onChange={(e) => setEditAiTool(e.target.value)}
                  >
                    {aiTools.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-difficulty">Difficulty *</label>
                  <select
                    id="edit-difficulty"
                    className="form-select"
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Pro">Pro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Visibility *</label>
                  <div style={{ display: 'flex', gap: '16px', height: '42px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="edit-visibility"
                        value="public"
                        checked={editVisibility === 'public'}
                        onChange={() => setEditVisibility('public')}
                      />
                      Public
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="edit-visibility"
                        value="private"
                        checked={editVisibility === 'private'}
                        onChange={() => setEditVisibility('private')}
                      />
                      Private (Premium)
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-tags">Tags (Comma-separated)</label>
                <input
                  type="text"
                  id="edit-tags"
                  className="form-input"
                  placeholder="react, code, optimize"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                />
              </div>

              <div className="modal-action-row">
                <button
                  type="button"
                  onClick={() => setEditingPrompt(null)}
                  className="btn btn-secondary"
                  disabled={editSubmitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={editSubmitLoading}
                >
                  <Save size={16} />
                  <span>{editSubmitLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ANALYTICS DIALOG */}
      {analyticsPrompt && (
        <div className="modal-overlay">
          <div className="modal-box glass-panel" style={{ maxWidth: '440px' }}>
            <div className="modal-header" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.25rem' }}><BarChart2 className="text-secondary" /> Prompt Analytics</h3>
              <button onClick={() => setAnalyticsPrompt(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <h4 style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{analyticsPrompt.title}</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Performance metrics compiled dynamically.</p>

              <div className="meta-list" style={{ marginTop: '10px' }}>
                <div className="meta-item">
                  <span className="meta-label">Total Copies</span>
                  <span className="meta-value font-bold" style={{ fontSize: '1.2rem', color: '#06b6d4' }}>{analyticsPrompt.copyCount}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Bookmarks Saved</span>
                  <span className="meta-value font-bold" style={{ fontSize: '1.2rem', color: '#7c3aed' }}>{analyticsPrompt.bookmarkCount}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Average Review Rating</span>
                  <span className="meta-value font-bold" style={{ fontSize: '1.2rem', color: '#f59e0b' }}>★ {analyticsPrompt.averageRating || '0.0'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Review Feedbacks</span>
                  <span className="meta-value font-bold">{analyticsPrompt.reviewCount} reviews</span>
                </div>
                <div className="meta-item" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                  <span className="meta-label">Created Date</span>
                  <span className="meta-value" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    <Calendar size={12} style={{ marginRight: '4px', display: 'inline' }} />
                    {new Date(analyticsPrompt.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="modal-action-row" style={{ marginTop: '16px' }}>
                <button
                  onClick={() => setAnalyticsPrompt(null)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Close Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPrompts;

// Prompts modification modal form properties

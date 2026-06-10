import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Bookmark, Eye, Trash2, Layers } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiverse-server-two.vercel.app/api';

const SavedPrompts = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const response = await fetch(`${API_URL}/prompts/saved-prompts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setSavedPrompts(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load saved prompts');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSaved();
    }
  }, [token]);

  const handleRemoveBookmark = async (promptId) => {
    try {
      const response = await fetch(`${API_URL}/prompts/${promptId}/bookmark`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Bookmark removed successfully!');
        setSavedPrompts((prev) => prev.filter((p) => p._id !== promptId));
      }
    } catch (error) {
      console.error(error);
      toast.error('Error removing bookmark');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Saved Prompt Templates</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Browse your bookmarked templates and parameters.</p>
      </div>

      {savedPrompts.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <Layers size={48} style={{ color: '#64748b' }} />
          <h3>No bookmarked prompts</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '380px' }}>
            Browse the marketplace and bookmark items to build your private collection.
          </p>
          <Link to="/prompts" className="btn btn-primary btn-sm">Browse Prompts</Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {savedPrompts.map((prompt) => (
            <div key={prompt._id} className="glass-panel" style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '220px',
            }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{prompt.aiTool}</span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{prompt.category}</span>
                </div>
                <h3 style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}>{prompt.title}</h3>
                <p style={{
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>{prompt.description}</p>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '14px',
                marginTop: '12px',
              }}>
                <button
                  onClick={() => navigate(`/prompts/${prompt._id}`)}
                  className="btn btn-primary btn-sm"
                  style={{ flexGrow: 1 }}
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleRemoveBookmark(prompt._id)}
                  className="btn btn-danger btn-sm"
                  title="Remove Bookmark"
                  style={{ padding: '8px 12px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPrompts;

// Bookmarked cards mapping specifications

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Star, Eye, Calendar, MessageSquare } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const MyReviews = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/prompts/my-reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReviews();
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Product Reviews</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Feedback and ratings you've posted on the marketplace.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <MessageSquare size={48} style={{ color: '#64748b' }} />
          <h3>No reviews submitted yet</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '380px' }}>
            Try templates from our catalog and share your experiences to assist other users!
          </p>
          <Link to="/prompts" className="btn btn-primary btn-sm">Browse Prompts</Link>
        </div>
      ) : (
        <div className="table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Prompt Title</th>
                <th>AI Tool</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Submitted Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev._id}>
                  <td style={{ fontWeight: 600 }}>
                    {rev.promptId?.title || 'Deleted Prompt'}
                  </td>
                  <td>
                    <span className="badge badge-purple">{rev.promptId?.aiTool || 'N/A'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                      <span>{rev.rating}.0</span>
                    </div>
                  </td>
                  <td style={{ color: '#94a3b8', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    "{rev.comment}"
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                      <Calendar size={12} />
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    {rev.promptId ? (
                      <button
                        onClick={() => navigate(`/prompts/${rev.promptId._id}`)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Unavailable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyReviews;

// Submitted ratings list logs details

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Copy, Star, Bookmark, Flag, User, Lock, ArrowLeft, 
  Calendar, Check, Send, AlertTriangle, MessageSquare, ShieldAlert 
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import './PromptDetails.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const PromptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, updateProfileState } = useAuth();

  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);

  // Report modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportDescription, setReportDescription] = useState('');
  const [submitReportLoading, setSubmitReportLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Get prompt details
        const resPrompt = await fetch(`${API_URL}/prompts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resPrompt.ok) {
          if (resPrompt.status === 404) {
            navigate('/404');
            return;
          }
          throw new Error('Failed to load prompt details');
        }

        const promptData = await resPrompt.json();
        setPrompt(promptData);

        // Get reviews
        const resReviews = await fetch(`${API_URL}/prompts/${id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resReviews.ok) {
          const reviewsData = await resReviews.json();
          setReviews(reviewsData);
        }

        // Get bookmark state
        const resBookmark = await fetch(`${API_URL}/prompts/${id}/bookmarked`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resBookmark.ok) {
          const bookmarkData = await resBookmark.json();
          setIsBookmarked(bookmarkData.bookmarked);
        }

      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Error fetching details');
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchDetails();
    }
  }, [id, token, navigate]);

  // Copy Prompt handler
  const handleCopy = async () => {
    if (!prompt || prompt.isLocked) return;

    try {
      await navigator.clipboard.writeText(prompt.content);
      setIsCopied(true);
      toast.success('Prompt copied to clipboard!');

      // Send update copy count request
      const response = await fetch(`${API_URL}/prompts/${id}/copy`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPrompt((prev) => prev ? { ...prev, copyCount: data.copyCount } : null);
      }

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy text');
    }
  };

  // Toggle Bookmark handler
  const handleBookmarkToggle = async () => {
    try {
      const response = await fetch(`${API_URL}/prompts/${id}/bookmark`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
        setPrompt((prev) => prev ? { ...prev, bookmarkCount: data.bookmarkCount } : null);
        
        if (data.bookmarked) {
          toast.success('Prompt bookmarked');
        } else {
          toast.success('Bookmark removed');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating bookmark');
    }
  };

  // Review submission handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return toast.warning('Please enter a comment');
    }

    try {
      setSubmitReviewLoading(true);
      const response = await fetch(`${API_URL}/prompts/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      toast.success('Review submitted successfully!');
      setReviews((prev) => [data, ...prev]);
      setComment('');
      
      // Fetch latest prompt ratings
      const resPrompt = await fetch(`${API_URL}/prompts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resPrompt.ok) {
        const updatedPrompt = await resPrompt.json();
        setPrompt(updatedPrompt);
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting review');
    } finally {
      setSubmitReviewLoading(false);
    }
  };

  // Report submission handler
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitReportLoading(true);
      const response = await fetch(`${API_URL}/prompts/${id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: reportReason, description: reportDescription }),
      });

      if (response.ok) {
        toast.success('Report submitted successfully. Admins will review it.');
        setShowReportModal(false);
        setReportDescription('');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to submit report');
      }
    } catch (err) {
      toast.error('Error submitting report');
    } finally {
      setSubmitReportLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!prompt) {
    return (
      <div className="error-fallback-container">
        <h3>Unable to load prompt information.</h3>
        <Link to="/prompts" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const alreadyReviewed = reviews.some((r) => r.userId === user?._id);

  return (
    <div className="details-container">
      {/* Back Link */}
      <div className="back-link-wrapper">
        <button onClick={() => navigate(-1)} className="back-link-btn">
          <ArrowLeft size={16} />
          <span>Back to previous page</span>
        </button>
      </div>

      <div className="details-grid">
        {/* LEFT COLUMN: Content, description & instructions */}
        <div className="details-main-col">
          <div className="details-card glass-panel">
            <div className="details-header-row">
              <h1 className="details-title">{prompt.title}</h1>
              <div className="action-buttons-list">
                <button
                  onClick={handleBookmarkToggle}
                  className={`btn btn-secondary action-btn-icon ${isBookmarked ? 'bookmarked' : ''}`}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Prompt'}
                >
                  <Bookmark size={18} fill={isBookmarked ? '#7c3aed' : 'none'} />
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="btn btn-secondary action-btn-icon report-btn-icon"
                  title="Report Prompt"
                >
                  <Flag size={18} />
                </button>
              </div>
            </div>

            <p className="details-desc">{prompt.description}</p>

            {/* AI Prompt Content Box */}
            <div className="prompt-content-section">
              <div className="prompt-box-header">
                <h3>Prompt Template</h3>
                {!prompt.isLocked && (
                  <button onClick={handleCopy} className="btn btn-secondary btn-sm copy-top-btn">
                    {isCopied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div className={`prompt-textarea-box ${prompt.isLocked ? 'blurred-lock' : ''}`}>
                <pre className="prompt-pre"><code>{prompt.content}</code></pre>

                {prompt.isLocked && (
                  <div className="lock-overlay">
                    <Lock size={36} className="lock-overlay-icon animate-bounce" />
                    <h3>Premium Prompt Content Locked</h3>
                    <p>Unlock access to this prompt, review options, and duplicate copies for a one-time upgrade.</p>
                    <Link to="/payment" className="btn btn-accent btn-lg pulse-glow">
                      Subscribe to Premium ($5)
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Instructions */}
            <div className="instructions-section">
              <h3>Usage Instructions</h3>
              <p className="instructions-text">
                For best results, configure your parameters on {prompt.aiTool} with low temperature (0.3 - 0.5) to avoid hallucinations. Replace bracketed tags in the template with your target topic details.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Stats & Meta */}
        <div className="details-sidebar-col">
          <div className="sidebar-card glass-panel">
            <h3 className="sidebar-card-title">Prompt Details</h3>
            
            <div className="meta-list">
              <div className="meta-item">
                <span className="meta-label">AI Engine</span>
                <span className="meta-value badge badge-purple">{prompt.aiTool}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value badge badge-cyan">{prompt.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Difficulty</span>
                <span className="meta-value badge badge-difficulty">{prompt.difficulty}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Visibility</span>
                <span className="meta-value uppercase">{prompt.visibility}</span>
              </div>
              <div className="meta-item border-top">
                <span className="meta-label">Copies Made</span>
                <span className="meta-value font-bold">{prompt.copyCount}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Bookmarks</span>
                <span className="meta-value font-bold">{prompt.bookmarkCount}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Community Rating</span>
                <span className="meta-value rating-display">
                  <Star size={14} className="star-filled" />
                  <strong>{prompt.averageRating || '0.0'}</strong>
                  <span className="text-muted">({prompt.reviewCount})</span>
                </span>
              </div>
            </div>

            {/* Creator profile card */}
            <div className="creator-profile-summary">
              <h4>Creator Information</h4>
              <div className="creator-row-flex">
                <div className="creator-avatar-box">
                  <User size={18} />
                </div>
                <div className="creator-meta-box">
                  <h5>{prompt.creatorName}</h5>
                  <span>{prompt.creatorEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS & RATINGS WORKSPACE */}
      <section className="reviews-section-details">
        <div className="reviews-header-details">
          <h2>Community Reviews ({reviews.length})</h2>
        </div>

        <div className="reviews-grid-details">
          {/* Review form (left side) */}
          <div className="review-form-card glass-panel">
            <h3>Submit a Review</h3>
            {prompt.isLocked ? (
              <p className="form-lock-message">
                <Lock size={14} /> Reviews are disabled for premium locked prompts. Subscribe to premium to contribute feedback.
              </p>
            ) : alreadyReviewed ? (
              <p className="form-lock-message text-success">
                <Check size={14} /> You have already reviewed this prompt template. Thank you for your feedback!
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="rating-select-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`star-select-btn ${star <= rating ? 'active' : ''}`}
                      >
                        <Star size={24} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="review-comment">Comment</label>
                  <textarea
                    id="review-comment"
                    className="form-textarea"
                    placeholder="Write your review here. What worked? How did you test it?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    disabled={submitReviewLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitReviewLoading}
                >
                  <Send size={16} />
                  <span>{submitReviewLoading ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Reviews list (right side) */}
          <div className="reviews-list-card">
            {reviews.length === 0 ? (
              <div className="empty-reviews-state glass-panel">
                <MessageSquare size={32} className="text-muted" />
                <p>No reviews submitted yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="reviews-list-scroll">
                {reviews.map((rev) => (
                  <div key={rev._id} className="detail-review-card glass-panel">
                    <div className="rev-card-header">
                      <div className="rev-user-profile">
                        <div className="rev-avatar">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4>{rev.userName}</h4>
                          <span className="rev-date">
                            <Calendar size={12} />
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="rev-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rev.rating ? 'star-filled' : 'star-empty'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="rev-comment">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* REPORT PROMPT MODAL */}
      <AnimatePresence>
        {showReportModal && (
          <div className="modal-overlay">
            <motion.div
              className="modal-box glass-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="modal-header">
                <h3><ShieldAlert className="text-danger" /> Report Prompt Template</h3>
              </div>

              <form onSubmit={handleReportSubmit} className="modal-form">
                <p className="modal-intro-text">
                  Help us maintain community standards. If this prompt contains malicious instructions, plagiarized files, or spam content, report it below.
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="report-reason">Reason</label>
                  <select
                    id="report-reason"
                    className="form-select"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  >
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Spam">Spam</option>
                    <option value="Copyright Violation">Copyright Violation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="report-desc">Additional Description (Optional)</label>
                  <textarea
                    id="report-desc"
                    className="form-textarea"
                    placeholder="Provide details about the infraction..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    disabled={submitReportLoading}
                  />
                </div>

                <div className="modal-action-row">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="btn btn-secondary"
                    disabled={submitReportLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={submitReportLoading}
                  >
                    {submitReportLoading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptDetails;

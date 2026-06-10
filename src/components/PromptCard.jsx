import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Star, Lock, User, Sparkles, Eye } from 'lucide-react';
import './PromptCard.css';

const PromptCard = ({ prompt }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/prompts/${prompt._id}`);
  };

  const getToolBadgeClass = (tool) => {
    const t = tool.toLowerCase();
    if (t.includes('chatgpt')) return 'badge-purple';
    if (t.includes('gemini')) return 'badge-cyan';
    if (t.includes('claude')) return 'badge-yellow';
    if (t.includes('midjourney')) return 'badge-green';
    return 'badge-secondary';
  };

  return (
    <motion.div
      className="prompt-card glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6, borderColor: 'rgba(124, 58, 237, 0.4)' }}
    >
      {/* Card Header Info */}
      <div className="card-header">
        <span className={`badge ${getToolBadgeClass(prompt.aiTool)}`}>
          {prompt.aiTool}
        </span>
        <span className="badge badge-difficulty">
          {prompt.difficulty}
        </span>
        
        {prompt.visibility === 'private' && (
          <span className="premium-card-badge" title="Premium Prompt">
            <Lock size={12} />
            <span>Premium</span>
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="card-body">
        <h3 className="prompt-card-title">{prompt.title}</h3>
        <p className="prompt-card-desc">{prompt.description}</p>
        <div className="prompt-card-category-row">
          <Sparkles size={12} className="category-icon" />
          <span className="category-text">{prompt.category}</span>
        </div>
      </div>

      {/* Card Footer Info */}
      <div className="card-footer">
        <div className="creator-info">
          <User size={12} className="footer-icon" />
          <span className="creator-name" title={prompt.creatorName}>{prompt.creatorName}</span>
        </div>
        <div className="stats-row">
          <div className="stat-item" title="Copy count">
            <Copy size={12} className="footer-icon" />
            <span>{prompt.copyCount}</span>
          </div>
          <div className="stat-item" title="Rating">
            <Star size={12} className="footer-icon star-filled" />
            <span>{prompt.averageRating || '0.0'}</span>
          </div>
        </div>
      </div>

      <button onClick={handleViewDetails} className="btn btn-primary card-action-btn">
        <Eye size={16} />
        <span>View Details</span>
      </button>
    </motion.div>
  );
};

export default PromptCard;

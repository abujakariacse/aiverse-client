import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Zap, ShieldCheck, Heart, Award, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PromptCard from '../components/PromptCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPrompts, setFeaturedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock static/dynamic reviews
  const reviews = [
    { name: 'Sarah Connor', role: 'Content Strategist', comment: 'Aiverse completely changed how I interact with Claude. The prompts are highly refined and save me hours every day.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
    { name: 'Alex Rivera', role: 'Software Engineer', comment: 'I found an incredible prompt that debugs React code and writes unit tests in seconds. Simply amazing!', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    { name: 'Elena Rostova', role: 'Digital Artist', comment: 'The Midjourney prompts here are pure gold. The parameters and keywords are so detailed. Highly recommend!', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' }
  ];

  // Mock Top Creators
  const creators = [
    { name: 'PromptMaster', role: 'Senior Engineer', prompts: 42, copies: 1240, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
    { name: 'CreativeAI', role: 'Art Director', prompts: 28, copies: 980, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
    { name: 'GeminiWiz', role: 'Writer & Marketer', prompts: 35, copies: 850, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80' }
  ];

  // Random Trending Tags
  const trendingTags = ['SEO Optimize', 'React Component', 'Copywriter', 'Midjourney V6', 'Gemini Code Helper', 'Claude Architect'];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${API_URL}/prompts/featured`);
        if (response.ok) {
          const data = await response.json();
          setFeaturedPrompts(data);
        }
      } catch (error) {
        console.error('Error fetching featured prompts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/prompts?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/prompts?search=${encodeURIComponent(tag)}`);
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="home-container">
      {/* 1. HERO BANNER SECTION */}
      <section className="hero-banner">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            <Sparkles size={16} className="hero-badge-icon" />
            <span>The Ultimate Prompt Hub</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
          >
            Unlock the True Potential of <br />
            <span className="gradient-text">Generative AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-desc"
          >
            Discover, bookmark, and run engineering-grade prompts for ChatGPT, Gemini, Claude, and Midjourney. Boost your productivity today.
          </p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            className="hero-search-form glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, tag, or AI tool (e.g. 'React', 'Gemini')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary search-btn">
              Explore
            </button>
          </motion.form>

          {/* Random Trending Tags */}
          <motion.div
            className="hero-tags"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="tags-label">Trending:</span>
            <div className="tags-list">
              {trendingTags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handleTagClick(tag)}
                  className="tag-btn glass-panel"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Call-to-action button */}
          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/prompts" className="btn btn-primary btn-lg pulse-glow">
              <span>Explore All Prompts</span>
              <ArrowRight size={18} />
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Become a Creator
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED PROMPTS SECTION */}
      <section className="featured-section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="section-subtitle">Handpicked</span>
            <h2>Featured Prompts</h2>
          </div>
          <Link to="/prompts" className="view-all-link">
            <span>View all prompts</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : featuredPrompts.length === 0 ? (
          <div className="no-prompts-card glass-panel">
            <Layers size={40} className="no-prompts-icon" />
            <p>No featured prompts available. Explore prompts directory or create one!</p>
          </div>
        ) : (
          <motion.div
            className="prompts-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </motion.div>
        )}
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="why-choose-us">
        <div className="section-header text-center">
          <span className="section-subtitle">Our Benefits</span>
          <h2>Why Choose Aiverse?</h2>
          <p className="section-desc-center">We build the bridge between simple AI queries and high-yield prompt engineering.</p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card glass-panel">
            <div className="benefit-icon-wrapper purple">
              <Zap size={24} />
            </div>
            <h3>Production Ready</h3>
            <p>Every prompt is thoroughly checked, curated, and optimized to run flawlessly on target engines without tweaking.</p>
          </div>

          <div className="benefit-card glass-panel">
            <div className="benefit-icon-wrapper cyan">
              <ShieldCheck size={24} />
            </div>
            <h3>Admin Moderation</h3>
            <p>No spam or garbage templates. Our administrators approve prompts manually to guarantee highest community quality.</p>
          </div>

          <div className="benefit-card glass-panel">
            <div className="benefit-icon-wrapper rose">
              <Heart size={24} />
            </div>
            <h3>Premium Marketplace</h3>
            <p>Support prompt engineers directly. Access private expert prompts with a single-click lifetime subscription upgrade.</p>
          </div>
        </div>
      </section>

      {/* 4. EXTRA SECTION 1: PROMPT ENGINEERING GUIDE */}
      <motion.section
        className="prompt-guide-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="guide-content-wrapper">
          <motion.div className="guide-text-col" variants={itemVariants}>
            <span className="section-subtitle">Learn & Grow</span>
            <h2>Prompt Engineering Essentials</h2>
            <p className="guide-desc">
              Writing high-performing prompts is a science. AI tools require structures that define context, role constraints, output formats, and temperature.
            </p>

            <ul className="guide-steps-list">
              <li>
                <CheckCircle2 className="step-check-icon" />
                <div>
                  <strong>Define the Persona:</strong> Start by assigning a specific role e.g., "Act as a Senior UX Engineer".
                </div>
              </li>
              <li>
                <CheckCircle2 className="step-check-icon" />
                <div>
                  <strong>Provide Clear Context:</strong> Supply background constraints, input schemas, and targeted output formats.
                </div>
              </li>
              <li>
                <CheckCircle2 className="step-check-icon" />
                <div>
                  <strong>Iterative Refining:</strong> Toggle instructions for formatting (e.g. Markdown, JSON) to guide responses.
                </div>
              </li>
            </ul>

            <Link to="/prompts" className="btn btn-primary">
              <BookOpen size={16} />
              <span>Explore Guide Prompts</span>
            </Link>
          </motion.div>

          <motion.div className="guide-visual-col glass-panel" variants={itemVariants}>
            <div className="mock-code-box">
              <div className="mock-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
                <span className="mock-title">structured_prompt.json</span>
              </div>
              <pre>
                <code>{`{
  "role": "Senior React Architect",
  "context": "Optimizing a landing page",
  "instructions": [
    "Use HSL variable colors",
    "Apply Glassmorphism cards",
    "Verify mobile responsiveness"
  ],
  "format": "Vanilla CSS + HTML",
  "temperature": 0.2
}`}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 5. TOP CREATORS SECTION */}
      <section className="top-creators">
        <div className="section-header text-center">
          <span className="section-subtitle">Showcase</span>
          <h2>Top Prompt Creators</h2>
          <p className="section-desc-center">Engage with community leaders pioneering advanced prompt structures.</p>
        </div>

        <div className="creators-grid">
          {creators.map((creator, index) => (
            <div key={index} className="creator-showcase-card glass-panel">
              <div className="creator-avatar-wrapper">
                <img src={creator.avatar} alt={creator.name} className="creator-avatar" />
                <div className="creator-badge-overlay"><Award size={14} /></div>
              </div>
              <h3>{creator.name}</h3>
              <p className="creator-role">{creator.role}</p>
              <div className="creator-stats">
                <div className="c-stat">
                  <strong>{creator.prompts}</strong>
                  <span>Prompts</span>
                </div>
                <div className="c-stat">
                  <strong>{creator.copies}</strong>
                  <span>Copies</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EXTRA SECTION 2: AI COMPATIBILITY SHOWCASE */}
      <motion.section
        className="compatibility-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div className="section-header text-center" variants={itemVariants}>
          <span className="section-subtitle">Multi-Platform</span>
          <h2>Engine Compatibility</h2>
          <p className="section-desc-center">Prompts on Aiverse are tailored for individual models to exploit distinct strengths.</p>
        </motion.div>

        <motion.div className="compatibility-grid" variants={containerVariants}>
          <div className="comp-item glass-panel">
            <span className="comp-logo chatgpt">ChatGPT</span>
            <h4>GPT-4o / GPT-4</h4>
            <p>Complex reasoning, detailed programming architectures, logic refinement.</p>
          </div>
          <div className="comp-item glass-panel">
            <span className="comp-logo gemini">Gemini</span>
            <h4>Gemini 1.5 Pro</h4>
            <p>Ultra-long context windows, deep code analysis, Google Workspace syncing.</p>
          </div>
          <div className="comp-item glass-panel">
            <span className="comp-logo claude">Claude</span>
            <h4>Claude 3.5 Sonnet</h4>
            <p>Premium programmatic output, highly natural copywriting, markdown structuring.</p>
          </div>
          <div className="comp-item glass-panel">
            <span className="comp-logo midjourney">Midjourney</span>
            <h4>Midjourney v6</h4>
            <p>Highly artistic rendering, aspect-ratio configuration, photo-realism parameters.</p>
          </div>
        </motion.div>
      </motion.section>

      {/* 7. CUSTOMER REVIEWS SECTION */}
      <section className="reviews-section">
        <div className="section-header text-center">
          <span className="section-subtitle">Testimonials</span>
          <h2>What Users Say</h2>
        </div>

        <motion.div
          className="reviews-slider-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {reviews.map((rev, index) => (
            <motion.div key={index} className="review-card glass-panel" variants={itemVariants}>
              <div className="rating-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <Heart key={i} size={14} className="star-filled animate-pulse" />
                ))}
              </div>
              <p className="review-text">"{rev.comment}"</p>
              <div className="review-user-info">
                <img src={rev.avatar} alt={rev.name} className="review-avatar" />
                <div className="review-user-meta">
                  <h4>{rev.name}</h4>
                  <span>{rev.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

// Landing page section layouts

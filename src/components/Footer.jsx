import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Linkedin, Globe } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <Sparkles className="logo-icon" />
              <span>AI<span className="text-gradient">verse</span></span>
            </Link>
            <p className="footer-description">
              Discover, copy, and create production-ready AI prompts for Gemini, ChatGPT, Claude, and Midjourney. Build better apps, write better code, and automate your productivity.
            </p>
          </div>

          {/* Platform links */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/prompts">All Prompts</Link></li>
              <li><Link to="/prompts?sortBy=popular">Trending Prompts</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          {/* Resources links */}
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://uiverse.io" target="_blank" rel="noopener noreferrer">UI Elements</a></li>
              <li><a href="https://devmeetsdevs.com" target="_blank" rel="noopener noreferrer">Dev Meets Devs</a></li>
              <li><a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe Payment</a></li>
              <li><a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Auth</a></li>
            </ul>
          </div>

          {/* Social / Connect */}
          <div className="footer-col social-col">
            <h4>Connect</h4>
            <div className="social-links">
              {/* Custom X Logo SVG */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="X (formerly Twitter)">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Website">
                <Globe size={18} />
              </a>
            </div>
            <p className="footer-email-text">
              Questions? Support at: <strong>support@aiverse.com</strong>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Aiverse. All rights reserved. Created with ❤️ for AI engineering.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Footer links collection details

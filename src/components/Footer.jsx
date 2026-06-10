import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe } from 'lucide-react';
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
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
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

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { LogIn, Sparkles, AlertCircle } from 'lucide-react';
import './AuthPages.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to home or path before redirect
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all fields');
    }

    try {
      setError('');
      setBtnLoading(true);
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Check your credentials.');
      toast.error(err.message || 'Login failed');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setBtnLoading(true);
      await googleLogin();
      toast.success('Google Login successful!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to authenticate via Google');
      toast.error(err.message || 'Google authentication failed');
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <motion.div
        className="auth-box glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sparkles className="logo-icon animate-pulse" />
          </div>
          <h2>Welcome Back</h2>
          <p>Login to search, copy, and manage premium prompts</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={btnLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={btnLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={btnLoading}
          >
            {btnLoading ? 'Logging in...' : (
              <>
                <LogIn size={18} />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="btn btn-secondary google-auth-btn"
          disabled={btnLoading}
        >
          {/* Custom Google Logo SVG */}
          <svg className="google-icon-svg" viewBox="0 0 24 24" width="18" height="18">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.1.3-.84 2.51l-3.32-2.3c2.05-1.89 3.23-4.68 3.23-8.06z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3c-1.08.72-2.46 1.16-4.09 1.16-3.15 0-5.82-2.13-6.78-5.01L1.29 17.29c1.97 3.92 6.03 6.71 10.71 6.71z"
            />
            <path
              fill="#FBBC05"
              d="M5.22 14.24A7.17 7.17 0 0 1 4.8 12c0-.79.13-1.57.38-2.3l-3.72-2.9a11.95 11.95 0 0 0 0 10.34l3.76-2.9z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.32 0 3.26 2.79 1.29 6.71l3.72 2.9c.96-2.88 3.63-4.86 6.99-4.86z"
            />
          </svg>
          <span>Sign In with Google</span>
        </button>

        <div className="auth-footer-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

// Login form actions documentation

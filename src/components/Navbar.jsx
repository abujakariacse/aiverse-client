import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogIn, LogOut, LayoutDashboard, User, Menu, X, Gem } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin-analytics';
    if (user.role === 'creator') return '/dashboard/creator-analytics';
    return '/dashboard/profile';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <Sparkles className="logo-icon animate-pulse" />
          <span className="logo-text">AI<span className="text-gradient">verse</span></span>
        </Link>

        {/* Mobile toggle */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>

        {/* Nav Links */}
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/prompts"
            className={`nav-item ${isActive('/prompts') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            All Prompts
          </Link>
          <Link
            to="/prompts?sortBy=popular"
            className={`nav-item ${location.search.includes('sortBy=popular') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Trending Prompts
          </Link>

          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                className={`nav-item dashboard-btn-link ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              
              <div className="user-profile-menu">
                <Link to="/dashboard/profile" className="avatar-link" onClick={() => setIsOpen(false)}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="nav-avatar" />
                  ) : (
                    <div className="nav-avatar-fallback">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="nav-user-info">
                    <span className="nav-user-name">{user.name}</span>
                    {user.subscriptionStatus === 'premium' && (
                      <span className="premium-badge-nav"><Gem size={10} /> Pro</span>
                    )}
                  </div>
                </Link>

                <button onClick={handleLogout} className="btn btn-secondary btn-sm logout-btn">
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setIsOpen(false)}>
                <LogIn size={14} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setIsOpen(false)}>
                <User size={14} />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// Navigation menu bar responsive display rules documentation

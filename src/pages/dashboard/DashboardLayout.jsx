import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, LayoutDashboard, PlusCircle, BookOpen, Bookmark, 
  MessageSquare, Users, CreditCard, ShieldAlert, BarChart3, 
  LogOut, Menu, X, Sparkles, Gem 
} from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getMenuLinks = () => {
    if (!user) return [];

    const links = [];

    // All logged in users see Profile
    links.push({
      path: '/dashboard/profile',
      label: 'My Profile',
      icon: <User size={18} />,
    });

    if (user.role === 'admin') {
      links.push(
        {
          path: '/dashboard/admin-analytics',
          label: 'Admin Analytics',
          icon: <BarChart3 size={18} />,
        },
        {
          path: '/dashboard/admin-users',
          label: 'All Users',
          icon: <Users size={18} />,
        },
        {
          path: '/dashboard/admin-prompts',
          label: 'All Prompts',
          icon: <BookOpen size={18} />,
        },
        {
          path: '/dashboard/admin-payments',
          label: 'All Payments',
          icon: <CreditCard size={18} />,
        },
        {
          path: '/dashboard/admin-reports',
          label: 'Reported Prompts',
          icon: <ShieldAlert size={18} />,
        }
      );
    }

    if (user.role === 'creator') {
      links.push(
        {
          path: '/dashboard/creator-analytics',
          label: 'Creator Home',
          icon: <LayoutDashboard size={18} />,
        },
        {
          path: '/dashboard/add-prompt',
          label: 'Add Prompt',
          icon: <PlusCircle size={18} />,
        },
        {
          path: '/dashboard/my-prompts',
          label: 'My Prompts',
          icon: <BookOpen size={18} />,
        }
      );
    }

    if (user.role === 'user') {
      links.push(
        {
          path: '/dashboard/my-prompts',
          label: 'My Prompts',
          icon: <BookOpen size={18} />,
        },
        {
          path: '/dashboard/saved-prompts',
          label: 'Saved Prompts',
          icon: <Bookmark size={18} />,
        },
        {
          path: '/dashboard/my-reviews',
          label: 'My Reviews',
          icon: <MessageSquare size={18} />,
        }
      );
    }

    return links;
  };

  const menuLinks = getMenuLinks();

  return (
    <div className="dashboard-wrapper">
      {/* Mobile dashboard header */}
      <div className="dashboard-mobile-header glass-panel">
        <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link to="/" className="mobile-header-logo">
          <Sparkles className="logo-icon" />
          <span>AI<span className="text-gradient">verse</span></span>
        </Link>
        <div className="profile-indicator">
          {user?.subscriptionStatus === 'premium' && <Gem size={14} className="text-secondary" />}
        </div>
      </div>

      <div className="dashboard-container">
        {/* SIDEBAR */}
        <aside className={`dashboard-sidebar glass-panel ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-brand-section">
            <Link to="/" className="sidebar-logo">
              <Sparkles className="logo-icon" />
              <span>AI<span className="text-gradient">verse</span></span>
            </Link>
            {user?.subscriptionStatus === 'premium' && (
              <span className="premium-sidebar-badge"><Gem size={12} /> PRO</span>
            )}
          </div>

          <div className="sidebar-user-card">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="sidebar-avatar" />
            ) : (
              <div className="sidebar-avatar-fallback">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="sidebar-user-details">
              <h4>{user?.name}</h4>
              <span className="user-role-badge">{user?.role}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {menuLinks.map((link, i) => (
              <NavLink
                key={i}
                to={link.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <button onClick={handleLogout} className="btn btn-secondary sidebar-logout-btn">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div className="sidebar-overlay-mobile" onClick={() => setSidebarOpen(false)} />
        )}

        {/* MAIN CONTENT WORKSPACE */}
        <main className="dashboard-content-area">
          <div className="dashboard-content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

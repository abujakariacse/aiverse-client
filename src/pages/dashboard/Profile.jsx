import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Gem, Mail, ShieldAlert, Award, FileText, BadgeCheck } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [promptCount, setPromptCount] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/prompts/my-prompts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPromptCount(data.length);
        }
      } catch (error) {
        console.error('Error fetching profile stats:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (profileLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="profile-page-workspace">
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>User Account Profile</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Manage your plan, credentials, and published prompt details.</p>
      </div>

      <div className="glass-panel" style={{
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
      }}>
        {/* Profile Card Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '30px',
        }}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #7c3aed',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
              }}
            />
          ) : (
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              backgroundColor: '#131930',
              border: '3px solid #7c3aed',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#f8fafc',
            }}>
              {user?.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.8rem' }}>{user?.name}</h2>
              {user?.subscriptionStatus === 'premium' && (
                <span className="badge badge-cyan" style={{ display: 'inline-flex', gap: '4px' }}>
                  <Gem size={12} /> PRO
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.92rem' }}>
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-purple" style={{ textTransform: 'uppercase' }}>
                Role: {user?.role}
              </span>
              <span className={`badge ${user?.subscriptionStatus === 'premium' ? 'badge-green' : 'badge-yellow'}`}>
                Plan: {user?.subscriptionStatus === 'premium' ? 'PRO Lifetime' : 'FREE'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Statistics Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(0,0,0,0.15)' }}>
            <FileText size={24} style={{ color: '#7c3aed', marginBottom: '8px' }} />
            <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>Prompts Published</h4>
            <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{promptCount}</span>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(0,0,0,0.15)' }}>
            <BadgeCheck size={24} style={{ color: '#06b6d4', marginBottom: '8px' }} />
            <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px' }}>Account Status</h4>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', display: 'block', marginTop: '8px' }}>
              Verified Member
            </span>
          </div>
        </div>

        {/* Upgrade Area */}
        {user?.subscriptionStatus !== 'premium' ? (
          <div className="glass-panel" style={{
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px dashed rgba(124, 58, 237, 0.3)',
            padding: '30px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div style={{ maxWidth: '500px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gem size={20} className="text-secondary" /> Upgrade to Pro Lifetime
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>
                Unlock access to all private prompt templates, parameter sets, and community reviews for a single one-time contribution of $5.
              </p>
            </div>
            
            <Link to="/payment" className="btn btn-accent btn-lg pulse-glow" style={{ textDecoration: 'none' }}>
              Upgrade Now ($5)
            </Link>
          </div>
        ) : (
          <div className="glass-panel" style={{
            background: 'rgba(16, 185, 129, 0.03)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            padding: '24px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#34d399',
          }}>
            <BadgeCheck size={20} />
            <span>Lifetime Premium Active - Enjoy complete access to all Prompt Marketplace items!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

// User info dashboard card details

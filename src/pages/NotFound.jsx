import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: 'calc(100vh - 140px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 24px',
    backgroundColor: '#070a13',
    color: '#f8fafc',
    textAlign: 'center',
  };

  const boxStyle = {
    maxWidth: '500px',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'rgba(15, 22, 42, 0.5)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  };

  return (
    <div style={containerStyle}>
      <motion.div
        style={boxStyle}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#06b6d4'
        }}>
          <HelpCircle size={36} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#06b6d4', lineHeight: 1 }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Page Not Found</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            The prompt or page you are looking for has been moved, deleted, or does not exist in our system.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '10px 20px' }}>
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <Home size={16} />
            <span>Go Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

// 404 page route routing documentation

import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    backgroundColor: '#070a13',
    color: '#f8fafc',
    textAlign: 'center',
  };

  const boxStyle = {
    maxWidth: '500px',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    background: 'rgba(15, 22, 42, 0.6)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  };

  const iconStyle = {
    color: '#f43f5e',
    width: '64px',
    height: '64px',
    marginBottom: '8px',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <AlertOctagon style={iconStyle} className="animate-bounce" />
        <h1 style={{ fontSize: '2rem', fontFamily: "'Outfit', sans-serif" }}>System Error Occurred</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>
          We apologize for the inconvenience. An unexpected error occurred while loading this page.
        </p>
        
        {error && (
          <code style={{
            background: '#0c1020',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            width: '100%',
            overflowX: 'auto',
            color: '#a78bfa',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            textAlign: 'left'
          }}>
            {error.statusText || error.message || 'Unknown application error'}
          </code>
        )}

        <div style={actionsStyle}>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ padding: '10px 20px' }}
          >
            <RefreshCw size={16} />
            <span>Reload Page</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ padding: '10px 20px' }}
          >
            <Home size={16} />
            <span>Go Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  const containerStyle = fullPage
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#070a13',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        gap: '16px',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        gap: '12px',
      };

  const spinnerStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '4px solid rgba(124, 58, 237, 0.15)',
    borderTopColor: '#7c3aed',
    animation: 'spin 1s linear infinite',
  };

  const textStyle = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.95rem',
    color: '#94a3b8',
    fontWeight: 500,
    letterSpacing: '0.05em',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      <span style={textStyle}>Loading aiverse...</span>
      
      {/* Dynamic Keyframes Injection */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

// Page loader spinner UI guidelines

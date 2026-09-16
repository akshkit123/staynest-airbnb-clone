import React from 'react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading StayNest...' }) => {
  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        border: '3.5px solid rgba(255, 56, 92, 0.15)',
        borderTopColor: '#FF385C',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      {message && (
        <p style={{
          color: '#717171',
          fontSize: '0.95rem',
          fontWeight: 500,
        }}>{message}</p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

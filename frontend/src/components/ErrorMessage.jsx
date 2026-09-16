import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const ErrorMessage = ({
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 24px',
      margin: '24px auto',
      maxWidth: '540px',
      backgroundColor: '#FFF5F5',
      border: '1px solid #FED7D7',
      borderRadius: 'var(--radius-md)',
      gap: '12px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#FFE4E6',
        color: '#E11D48',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AlertCircle size={26} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#9B1C1C' }}>
        Something went wrong
      </h3>
      <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.5 }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary btn-sm"
          style={{ marginTop: '8px' }}
        >
          <RotateCcw size={16} /> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="card fade-in" style={containerStyles}>
      <div style={iconWrapperStyles}>
        <AlertCircle size={28} color="var(--color-danger)" />
      </div>

      <div style={textWrapperStyles}>
        <h3 style={titleStyles}>Forecasting Error</h3>
        <p style={descStyles}>{message}</p>
        <p style={subDescStyles}>
          Verify that the Databricks server configuration is active, or review your parameters.
        </p>
      </div>

      <button onClick={onRetry} className="btn-primary" style={retryBtnStyles}>
        <RefreshCw size={16} />
        Retry Request
      </button>
    </div>
  );
};

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2.5rem 2rem',
  border: '1px solid rgba(239, 68, 68, 0.25)',
  backgroundColor: 'rgba(239, 68, 68, 0.03)',
  textAlign: 'center',
  gap: '1.25rem',
};

const iconWrapperStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '14px',
  backgroundColor: 'var(--color-danger-bg)',
};

const textWrapperStyles: React.CSSProperties = {
  maxWidth: '460px',
};

const titleStyles: React.CSSProperties = {
  fontSize: '1.15rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '0.5rem',
};

const descStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-primary)',
  lineHeight: 1.5,
  fontWeight: 500,
};

const subDescStyles: React.CSSProperties = {
  fontSize: '0.775rem',
  color: 'var(--text-secondary)',
  marginTop: '0.5rem',
  lineHeight: 1.4,
};

const retryBtnStyles: React.CSSProperties = {
  maxWidth: '200px',
  marginTop: '0.5rem',
};

export default ErrorState;

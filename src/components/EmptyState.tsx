import React from 'react';
import { BarChart3 } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="card fade-in" style={containerStyles}>
      
      {/* Centered Soft Blue Rounded Icon Box with slow floating animation */}
      <div className="empty-icon-wrapper" style={iconWrapperStyles}>
        <BarChart3 size={24} color="var(--accent-primary)" />
      </div>

      {/* Main Headers */}
      <div style={textWrapperStyles}>
        <h3 style={titleStyles}>Your demand forecast will appear here.</h3>
        <p style={descStyles}>
          Enter parameters, discounts, and select promotional active statuses above, then click <strong>Generate Demand Forecast</strong> to query the Databricks-served model.
        </p>
      </div>

      {/* How to Proceed Nested Box (Light color filled in background) */}
      <div style={howToProceedBoxStyles}>
        <span style={howToProceedHeaderStyles}>HOW TO PROCEED:</span>
        <ol style={listStyles}>
          <li style={listItemStyles}>
            <span style={listNumberStyles}>1.</span>
            <span style={listTextStyles}>Choose single or multi-day configuration modes.</span>
          </li>
          <li style={listItemStyles}>
            <span style={listNumberStyles}>2.</span>
            <span style={listTextStyles}>Specify custom parameters and discounts. Weekend cycles will be computed automatically.</span>
          </li>
          <li style={listItemStyles}>
            <span style={listNumberStyles}>3.</span>
            <span style={listTextStyles}>Execute the pipeline to query the SARIMAX model.</span>
          </li>
        </ol>
      </div>

    </div>
  );
};

// Styling definitions
const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2.5rem',
  textAlign: 'center',
  height: '100%',
  minHeight: '450px',
  gap: '1.5rem',
  backgroundColor: 'var(--bg-card)',
  borderRadius: '20px',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-card)',
  backdropFilter: 'blur(16px)',
};

const iconWrapperStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '54px',
  height: '54px',
  borderRadius: '14px',
  backgroundColor: 'rgba(83, 109, 254, 0.07)',
  border: '1px solid rgba(83, 109, 254, 0.12)',
  boxShadow: '0 4px 10px rgba(83, 109, 254, 0.05)',
  animation: 'empty-float 3s ease-in-out infinite',
};

const textWrapperStyles: React.CSSProperties = {
  maxWidth: '460px',
};

const titleStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  marginBottom: '0.625rem',
  letterSpacing: '-0.02em',
};

const descStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  margin: 0,
};

const howToProceedBoxStyles: React.CSSProperties = {
  width: '100%',
  maxWidth: '440px',
  padding: '1.25rem 1.5rem',
  backgroundColor: 'rgba(100, 112, 132, 0.035)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const howToProceedHeaderStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 800,
  color: 'var(--text-secondary)',
  letterSpacing: '0.08em',
};

const listStyles: React.CSSProperties = {
  listStyleType: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
};

const listItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem',
};

const listNumberStyles: React.CSSProperties = {
  fontSize: '0.825rem',
  fontWeight: 800,
  color: 'var(--accent-primary)',
  minWidth: '15px',
};

const listTextStyles: React.CSSProperties = {
  fontSize: '0.825rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  lineHeight: 1.4,
};

// Inject float animation for empty icon in head
const emptyStyleTag = document.createElement('style');
emptyStyleTag.textContent = `
  @keyframes empty-float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0px); }
  }
`;
document.head.appendChild(emptyStyleTag);

export default EmptyState;

import React from 'react';
import { Sun, Moon, TrendingUp } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="sticky-header" style={headerStyles}>
      <div className="header-container" style={containerStyles}>
        {/* Left Branding */}
        <div className="header-brand" style={brandStyles}>
          <div className="brand-logo" style={logoWrapperStyles}>
            <TrendingUp size={20} color="var(--accent-primary)" strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title" style={titleStyles}>Demand Forecasting AI</h1>
            <span className="brand-subtitle" style={subtitleStyles}>
              Intelligent multi-day demand predictions
            </span>
          </div>
        </div>

        {/* Right Toggle */}
        <button
          onClick={onToggleTheme}
          className="theme-toggle-btn"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          style={toggleBtnStyles}
        >
          {theme === 'light' ? (
            <Moon size={18} color="var(--text-secondary)" />
          ) : (
            <Sun size={18} color="var(--text-secondary)" />
          )}
        </button>
      </div>
    </header>
  );
};

// Clean styling overrides
const headerStyles: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  width: '100%',
  background: 'var(--bg-card)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border-color)',
  transition: 'background var(--transition-normal), border var(--transition-normal)',
};

const containerStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0.875rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const brandStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const logoWrapperStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: 'rgba(83, 109, 254, 0.08)',
  border: '1px solid rgba(83, 109, 254, 0.15)',
};

const titleStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  margin: 0,
  letterSpacing: '-0.01em',
  color: 'var(--text-primary)',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  display: 'block',
  marginTop: '-2px',
};

const toggleBtnStyles: React.CSSProperties = {
  cursor: 'pointer',
  background: 'transparent',
  border: '1px solid var(--border-color)',
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all var(--transition-fast)',
  outline: 'none',
};
export default Header;

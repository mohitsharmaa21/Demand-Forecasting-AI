import React from 'react';
import { ExternalLink, User } from 'lucide-react';

const PORTFOLIO_URL = "https://mohitsharma21.netlify.app/";
const GITHUB_URL = "https://github.com/mohitsharmaa21/Demand-Forecasting-AI";
const LINKEDIN_URL = "https://www.linkedin.com/in/mohitsharma21";
const NOTEBOOK_URL = "https://www.kaggle.com/code/mohitsharma7231/demand-forecasting-sarimax-model";

export const Footer: React.FC = () => {
  return (
    <div style={footerWrapperStyles}>
      
      {/* 1. Explore Model Implementation Section (Frosted glass container with glow) */}
      <div className="explore-section fade-slide-up">
        <div style={exploreTextColStyles}>
          <h4 className="explore-title">Explore Model Implementation</h4>
          <p className="explore-desc">
            Review the full model training notebook, SARIMAX fitting parameters, and dataset evaluation pipeline on Kaggle or GitHub.
          </p>
        </div>
        
        {/* Right side: main buttons and sub social row */}
        <div className="explore-right-col" style={rightColumnWrapperStyles}>
          <div className="explore-btn-row">
            <a
              href={NOTEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="explore-btn-preview"
              style={{ textDecoration: 'none' }}
            >
              <span>Model Preview</span>
              <ExternalLink size={14} color="var(--accent-primary)" />
            </a>
            
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="explore-btn-dev"
              style={{ textDecoration: 'none' }}
            >
              <span>Know About Developer</span>
              <User size={14} color="#FFFFFF" />
            </a>
          </div>

          {/* Social buttons below know about developer */}
          <div style={socialRowStyles}>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="small-social-btn"
              title="LinkedIn Profile"
              style={{ textDecoration: 'none' }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="small-social-btn"
              title="GitHub Profile"
              style={{ textDecoration: 'none' }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Dark Footer Area */}
      <footer className="app-footer-dark" style={footerStyles}>
        <div style={containerStyles}>
          {/* Logo Branding (Relatable Forecasting Icon) */}
          <div style={logoWrapperStyles}>
            <div style={logoIconStyles}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <path d="M3 20h18" />
                <path d="M3 16l5-5 6 4 7-10" />
                <circle cx="21" cy="5" r="2.5" fill="#FFD700" stroke="#FFD700" strokeWidth="0.5" />
              </svg>
            </div>
            <span style={logoTextStyles}>Demand Forecasting AI</span>
          </div>

          {/* Copyright & Dev Name Badge */}
          <div style={copyStyles}>
            <div>
              <span>© 2026 Demand Forecasting by </span>
              <span className="dev-gradient-name">Mohit Sharma</span>
              <span>. Deployed on Databricks Model Serving. All rights reserved.</span>
            </div>
            <div style={emailWrapperStyles}>
              <a href="mailto:Mohitsharam44@gmail.com" style={emailStyles} className="footer-email-link">
                Mohitsharam44@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

// Layout and wrapper styles
const footerWrapperStyles: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '3.5rem',
};

const exploreTextColStyles: React.CSSProperties = {
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const rightColumnWrapperStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  alignItems: 'center',
};

const socialRowStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.625rem',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const footerStyles: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#131822',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  padding: '2.25rem 2rem',
};

const containerStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.25rem',
};

const logoWrapperStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const logoIconStyles: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
};

const logoTextStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 850,
  letterSpacing: '-0.02em',
  color: '#FFFFFF',
};

const copyStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#90A0B7',
  textAlign: 'center',
  lineHeight: 1.6,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
};

const emailWrapperStyles: React.CSSProperties = {
  marginTop: '0.25rem',
};

const emailStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--accent-primary)',
  textDecoration: 'none',
  transition: 'color var(--transition-fast)',
};

// Inject self-contained premium CSS styles inside head
const footerStylesTag = document.createElement('style');
footerStylesTag.textContent = `
  /* Explore Section Styling */
  .explore-section {
    width: 100%;
    max-width: 1200px;
    margin: 2.5rem auto 2.5rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .explore-section::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.04) 0%, rgba(255, 45, 85, 0.04) 100%);
    filter: blur(50px);
    pointer-events: none;
    z-index: -1;
  }

  @media (min-width: 768px) {
    .explore-section {
      flex-direction: row !important;
      text-align: left;
      padding: 2.5rem 3rem;
    }
    .explore-section div {
      text-align: left;
    }
    .explore-right-col {
      align-items: flex-end !important;
    }
    .explore-section .explore-btn-row {
      justify-content: flex-end;
    }
    .app-footer-dark > div {
      flex-direction: row !important;
      text-align: left;
    }
  }

  /* Explore Typography */
  .explore-title {
    font-size: 1.35rem;
    font-weight: 850;
    color: var(--text-primary);
    margin-bottom: 0.375rem;
    letter-spacing: -0.02em;
  }

  .explore-desc {
    font-size: 0.85rem;
    color: var(--text-secondary);
    max-width: 540px;
    line-height: 1.6;
    margin: 0;
  }

  .explore-btn-row {
    display: flex;
    gap: 0.875rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* Premium Gold/Red gradient outline button */
  .explore-btn-preview {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.375rem;
    font-size: 0.825rem;
    font-weight: 800;
    border-radius: 8px;
    color: var(--text-primary);
    border: 1.5px solid transparent;
    background-image: linear-gradient(var(--bg-card), var(--bg-card)), linear-gradient(135deg, #FFD700 0%, #FF2D55 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
    transition: all var(--transition-fast);
    box-shadow: 0 4px 12px rgba(255, 45, 85, 0.04);
  }

  .explore-btn-preview:hover {
    transform: translateY(-2.5px);
    box-shadow: 0 8px 24px rgba(255, 45, 85, 0.16);
    background-image: linear-gradient(var(--bg-card), var(--bg-card)), linear-gradient(135deg, #FF2D55 0%, #FFD700 100%);
  }

  /* Premium Dark Developer Button */
  .explore-btn-dev {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.375rem;
    font-size: 0.825rem;
    font-weight: 800;
    border-radius: 8px;
    background: #171E2E;
    color: #FFFFFF !important;
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    transition: all var(--transition-fast);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .explore-btn-dev:hover {
    transform: translateY(-2.5px);
    background: #20293A;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25);
  }

  /* Small Social Buttons Styling */
  .small-social-btn {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.85rem;
    font-size: 0.725rem;
    font-weight: 700;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.03);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
    transition: all var(--transition-fast);
  }

  .small-social-btn:hover {
    background: rgba(83, 109, 254, 0.05);
    border-color: var(--accent-primary);
    color: var(--text-primary);
    transform: translateY(-1px);
  }

  /* Gold-to-red text gradient for Mohit Sharma in Footer */
  .dev-gradient-name {
    background: linear-gradient(135deg, #FFD700 0%, #FF2D55 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    font-family: var(--font-sans) !important;
    font-weight: 900 !important;
    display: inline-block;
    letter-spacing: -0.01em;
    filter: drop-shadow(0 1px 2px rgba(255, 45, 85, 0.12));
    margin: 0 2px;
  }

  /* Clickable email hover style */
  .footer-email-link:hover {
    color: var(--text-primary) !important;
    text-decoration: underline !important;
  }
`;
document.head.appendChild(footerStylesTag);

export default Footer;

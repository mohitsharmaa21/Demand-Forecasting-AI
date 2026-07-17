import React from 'react';
import { Database, Sparkles } from 'lucide-react';

interface HeroProps {
  isConfigured: boolean;
  isConnected: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isConfigured, isConnected }) => {
  return (
    <section className="hero-section fade-slide-up" style={heroStyles}>
      <div className="hero-content" style={contentStyles}>
        {/* Connection Status Badge */}
        <div style={badgeWrapperStyles}>
          {isConnected ? (
            <div className="badge badge-connected" title="Endpoint contacted successfully">
              <span className="pulse-dot" style={pulseStyles}></span>
              Databricks Model Connected
            </div>
          ) : isConfigured ? (
            <div className="badge badge-ready" title="Server environment has URL and Token">
              <Database size={12} />
              Model Endpoint Ready
            </div>
          ) : (
            <div className="badge" style={badgeNeutralStyles}>
              <Sparkles size={12} />
              Model Setup Needed
            </div>
          )}
        </div>

        {/* Premium metallic title with black-red gradient + shimmer sweep */}
        <h2 style={titleStyles}>
          <span className="hero-title-text">
            Forecast Future Demand with Confidence
          </span>
        </h2>
        <p style={descStyles}>
          Generate reliable multi-day demand predictions using a deployed Databricks forecasting model. 
          Provide store conditions to simulate how variables like promotions and discounts affect volume.
        </p>
      </div>

      {/* Premium Animated SVG Wave Time Series Illustration */}
      <div className="hero-illustration" style={illustrationStyles}>
        <svg viewBox="0 0 200 120" style={svgStyles} width="100%" height="100%">
          <defs>
            {/* Soft gradient fill under wave */}
            <linearGradient id="wave-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
            </linearGradient>
            
            {/* Glowing line path gradient */}
            <linearGradient id="wave-line-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="50%" stopColor="var(--accent-secondary)" />
              <stop offset="100%" stopColor="var(--accent-primary)" />
            </linearGradient>

            {/* Glowing dot radial filter */}
            <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Subtle grid lines */}
          <line x1="10" y1="20" x2="190" y2="20" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4,4" />
          <line x1="10" y1="50" x2="190" y2="50" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4,4" />
          <line x1="10" y1="80" x2="190" y2="80" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4,4" />
          <line x1="10" y1="110" x2="190" y2="110" stroke="var(--border-color)" strokeWidth="0.75" />

          {/* Area fill under wave */}
          <path
            d="M 10 95 C 40 75, 50 85, 80 50 C 110 15, 140 60, 160 45 C 175 35, 182 32, 190 30 L 190 110 L 10 110 Z"
            fill="url(#wave-area)"
          />

          {/* Wave line */}
          <path
            d="M 10 95 C 40 75, 50 85, 80 50 C 110 15, 140 60, 160 45 C 175 35, 182 32, 190 30"
            fill="none"
            stroke="url(#wave-line-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: '200',
              strokeDashoffset: '0',
              animation: 'wave-flow 8s linear infinite',
            }}
          />

          {/* Floating tiny data points/nodes */}
          <g style={{ animation: 'float-pt 3s ease-in-out infinite' }}>
            <circle cx="80" cy="50" r="3.5" fill="var(--bg-card)" stroke="var(--accent-primary)" strokeWidth="2" filter="url(#glow-effect)" />
            <circle cx="160" cy="45" r="3.5" fill="var(--bg-card)" stroke="var(--accent-primary)" strokeWidth="2" />
          </g>

          <g style={{ animation: 'float-pt-delayed 4s ease-in-out infinite' }}>
            <circle cx="120" cy="38" r="1.5" fill="var(--accent-secondary)" opacity="0.7" />
            <circle cx="60" cy="72" r="1.5" fill="var(--accent-primary)" opacity="0.6" />
            <circle cx="180" cy="34" r="3.5" fill="var(--bg-card)" stroke="var(--accent-secondary)" strokeWidth="2" filter="url(#glow-effect)" />
          </g>
        </svg>
      </div>
    </section>
  );
};

// Styling Object
const heroStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2.5rem',
  padding: '2.25rem 2.5rem',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '22px',
  boxShadow: 'var(--shadow-card)',
  backdropFilter: 'blur(16px)',
  overflow: 'hidden',
  position: 'relative',
  /* Faint inner radial glow at top-left corner */
  backgroundImage: 'radial-gradient(ellipse at 0% 0%, rgba(99,102,241,0.06) 0%, transparent 60%)',
};

const contentStyles: React.CSSProperties = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
};

const badgeWrapperStyles: React.CSSProperties = {
  marginBottom: '1rem',
};

const pulseStyles: React.CSSProperties = {
  display: 'inline-block',
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-success)',
  marginRight: '6px',
  animation: 'pulse 1.8s infinite',
};

const badgeNeutralStyles: React.CSSProperties = {
  backgroundColor: 'rgba(100, 112, 132, 0.08)',
  color: 'var(--text-secondary)',
  border: '1px solid rgba(100, 112, 132, 0.15)',
};

const titleStyles: React.CSSProperties = {
  fontSize: '1.85rem',
  fontWeight: 900,
  letterSpacing: '-0.03em',
  lineHeight: 1.15,
  marginBottom: '0.75rem',
  position: 'relative',
  display: 'block',
};

const descStyles: React.CSSProperties = {
  fontSize: '0.925rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  maxWidth: '620px',
};

const illustrationStyles: React.CSSProperties = {
  width: '200px',
  height: '120px',
  display: 'none',
};

const svgStyles: React.CSSProperties = {
  overflow: 'visible',
};

const styleTag = document.createElement('style');
styleTag.textContent = `
  @media (min-width: 768px) {
    .hero-illustration {
      display: block !important;
    }
  }
  @keyframes pulse {
    0% { transform: scale(0.9); opacity: 0.8; }
    50% { transform: scale(1.25); opacity: 1; }
    100% { transform: scale(0.9); opacity: 0.8; }
  }
  @keyframes wave-flow {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -40; }
  }
  @keyframes float-pt {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0px); }
  }
  @keyframes float-pt-delayed {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
    100% { transform: translateY(0px); }
  }

  /* ── Hero Title Premium Styling ── */
  .hero-title-text {
    display: block;
    position: relative;

    /* Sharp black-to-red metallic gradient text */
    background: linear-gradient(
      120deg,
      #0D0D0D  0%,
      #1A0505  18%,
      #B91C1C  38%,
      #111111  52%,
      #991B1B  68%,
      #0A0A0A  82%,
      #3B0000  100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    /* Crisp rendering */
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-variant-ligatures: common-ligatures;
  }

  /* Shimmer sweep using a pseudo-element on the parent h2 */
  .hero-title-text::after {
    content: 'Forecast Future Demand with Confidence';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      transparent     30%,
      rgba(255,255,255,0.28) 48%,
      rgba(255,220,220,0.18) 52%,
      transparent     68%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: title-shimmer 5s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes title-shimmer {
    0%   { background-position: -200% center; }
    60%  { background-position:  200% center; }
    100% { background-position:  200% center; }
  }

  /* Dark mode: keep rich black-red but lighten slightly */
  [data-theme="dark"] .hero-title-text {
    background: linear-gradient(
      120deg,
      #F5F5F5  0%,
      #FECACA  22%,
      #EF4444  40%,
      #FFFFFF  55%,
      #F87171  70%,
      #E5E5E5  85%,
      #FCA5A5  100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;
document.head.appendChild(styleTag);

export default Hero;

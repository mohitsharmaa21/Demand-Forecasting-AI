import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const loadingSteps = [
  'Preparing future dates...',
  'Sending conditions to the model...',
  'Generating demand forecast...',
  'Preparing visualization...',
];

export const LoadingState: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Rotate messages every 1.8 seconds to give a dynamic feel
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-state fade-in" style={containerStyles}>
      {/* Upper Status Indicator */}
      <div className="card" style={statusBarStyles}>
        <Loader2 className="animate-spin" size={20} color="var(--accent-primary)" />
        <span style={textStyles}>{loadingSteps[stepIndex]}</span>
      </div>

      {/* Grid of Skeleton Cards (Summary Replacements) */}
      <div style={skeletonSummaryGridStyles}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ padding: '1.25rem' }}>
            <div className="skeleton skeleton-title" style={{ width: '45%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '80%', height: '24px' }}></div>
          </div>
        ))}
      </div>

      {/* Large Skeleton Card (Chart Replacement) */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton skeleton-title" style={{ width: '25%' }}></div>
        <div className="skeleton skeleton-chart"></div>
      </div>
    </div>
  );
};

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
};

const statusBarStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.875rem',
  padding: '1.25rem 1.5rem',
  borderLeft: '4px solid var(--accent-primary)',
};

const textStyles: React.CSSProperties = {
  fontSize: '0.925rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  transition: 'all 0.3s ease',
};

const skeletonSummaryGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
};

export default LoadingState;

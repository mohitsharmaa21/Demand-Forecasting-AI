import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Layers, BarChart3 } from 'lucide-react';
import type { ForecastResult } from '../types/forecast';
import { formatDemand } from '../utils/formatDemand';

interface ForecastSummaryProps {
  results: ForecastResult[];
}

// 1. Dynamic Count-Up Hook Component for premium number animations
interface CountUpProps {
  value: number;
  duration?: number;
}
const CountUp: React.FC<CountUpProps> = ({ value, duration = 450 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const startTime = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quadratic progression
      const easeOutQuad = progress * (2 - progress);
      const current = start + (end - start) * easeOutQuad;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{formatDemand(count)}</>;
};

export const ForecastSummary: React.FC<ForecastSummaryProps> = ({ results }) => {
  if (results.length === 0) return null;

  // Calculate sum metrics
  const total = results.reduce((sum, item) => sum + item.predictedDemand, 0);
  const average = total / results.length;

  const totalLower = results.reduce((sum, item) => sum + item.lower95, 0);
  const totalUpper = results.reduce((sum, item) => sum + item.upper95, 0);

  const averageLower = totalLower / results.length;
  const averageUpper = totalUpper / results.length;

  // Identify Peak and Trough records
  let peakRecord = results[0];
  let troughRecord = results[0];

  results.forEach((record) => {
    if (record.predictedDemand > peakRecord.predictedDemand) {
      peakRecord = record;
    }
    if (record.predictedDemand < troughRecord.predictedDemand) {
      troughRecord = record;
    }
  });

  const formatReadableDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statCards = [
    {
      title: 'Average Demand',
      rawVal: average,
      subtitle: 'Mean forecast per day',
      icon: <BarChart3 size={20} color="var(--accent-primary)" />,
      badge: null,
      ciRange: `CI: ${formatDemand(averageLower)} – ${formatDemand(averageUpper)}`,
      trend: <span style={trendUpStyles}>+0.4% baseline</span>,
      gradient: 'linear-gradient(135deg, rgba(83, 109, 254, 0.02) 0%, rgba(83, 109, 254, 0.05) 100%)',
    },
    {
      title: 'Peak Demand',
      rawVal: peakRecord.predictedDemand,
      subtitle: `Peak on ${formatReadableDate(peakRecord.date)}`,
      icon: <TrendingUp size={20} color="var(--color-warning)" />,
      badge: <span className="badge badge-peak" style={{ padding: '1px 6px', fontSize: '9px' }}>Peak</span>,
      ciRange: `CI: ${formatDemand(peakRecord.lower95)} – ${formatDemand(peakRecord.upper95)}`,
      trend: <span style={trendPeakStyles}>Volume Spike</span>,
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.02) 0%, rgba(245, 158, 11, 0.05) 100%)',
    },
    {
      title: 'Lowest Demand',
      rawVal: troughRecord.predictedDemand,
      subtitle: `Trough on ${formatReadableDate(troughRecord.date)}`,
      icon: <TrendingDown size={20} color="var(--color-info)" />,
      badge: <span className="badge badge-lowest" style={{ padding: '1px 6px', fontSize: '9px' }}>Lowest</span>,
      ciRange: `CI: ${formatDemand(troughRecord.lower95)} – ${formatDemand(troughRecord.upper95)}`,
      trend: <span style={trendTroughStyles}>Baseline Trough</span>,
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(59, 130, 246, 0.05) 100%)',
    },
    {
      title: 'Total Demand',
      rawVal: total,
      subtitle: `Cumulative volume`,
      icon: <Layers size={20} color="var(--accent-secondary)" />,
      badge: null,
      ciRange: `CI: ${formatDemand(totalLower)} – ${formatDemand(totalUpper)}`,
      trend: <span style={trendTotalStyles}>Aggregate Sum</span>,
      gradient: 'linear-gradient(135deg, rgba(108, 140, 191, 0.02) 0%, rgba(108, 140, 191, 0.05) 100%)',
    },
  ];

  return (
    <div style={summaryGridStyles} className="fade-slide-up">
      {statCards.map((card, index) => (
        <div key={index} className="card summary-glass-card" style={{ ...cardStyles, backgroundImage: card.gradient }}>
          <div style={cardHeaderStyles}>
            <div style={iconWrapperStyles}>{card.icon}</div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {card.badge}
              {card.trend}
            </div>
          </div>
          <div style={bodyStyles}>
            <p style={labelStyles}>{card.title}</p>
            <h4 style={valueStyles}>
              <CountUp value={card.rawVal} />
            </h4>
            <p style={ciStyles}>{card.ciRange}</p>
            <p style={subStyles}>{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Layout grid and elevations styles
const summaryGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: '1rem',
  width: '100%',
};

const cardStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '1.5rem',
  gap: '1rem',
  textAlign: 'left',
  borderRadius: '20px',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-card)',
  transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
};

const cardHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
};

const iconWrapperStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  backgroundColor: 'var(--bg-secondary)',
  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)',
};

const bodyStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  marginTop: '0.5rem',
};

const labelStyles: React.CSSProperties = {
  fontSize: '0.775rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const valueStyles: React.CSSProperties = {
  fontSize: '1.65rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  letterSpacing: '-0.02em',
};

const ciStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--accent-primary)',
  marginTop: '2px',
};

const subStyles: React.CSSProperties = {
  fontSize: '0.725rem',
  color: 'var(--text-secondary)',
  marginTop: '4px',
};

/* Trend Indicators Styles */
const trendBaseStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  padding: '2px 6px',
  borderRadius: '4px',
};

const trendUpStyles: React.CSSProperties = {
  ...trendBaseStyles,
  backgroundColor: 'rgba(16, 185, 129, 0.08)',
  color: '#10B981',
};

const trendPeakStyles: React.CSSProperties = {
  ...trendBaseStyles,
  backgroundColor: 'rgba(245, 158, 11, 0.08)',
  color: 'var(--color-warning)',
};

const trendTroughStyles: React.CSSProperties = {
  ...trendBaseStyles,
  backgroundColor: 'rgba(59, 130, 246, 0.08)',
  color: 'var(--color-info)',
};

const trendTotalStyles: React.CSSProperties = {
  ...trendBaseStyles,
  backgroundColor: 'rgba(108, 140, 191, 0.08)',
  color: 'var(--accent-secondary)',
};

// Add card animations inside document head
const cardHoverStyles = document.createElement('style');
cardHoverStyles.textContent = `
  .summary-glass-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover) !important;
    border-color: rgba(83, 109, 254, 0.25) !important;
  }
`;
document.head.appendChild(cardHoverStyles);

export default ForecastSummary;

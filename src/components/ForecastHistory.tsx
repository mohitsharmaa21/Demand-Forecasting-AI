import React from 'react';
import { History, Trash2, Calendar, TrendingUp } from 'lucide-react';
import type { ForecastHistoryItem } from '../types/forecast';
import { formatDemand } from '../utils/formatDemand';

interface ForecastHistoryProps {
  history: ForecastHistoryItem[];
  onSelect: (item: ForecastHistoryItem) => void;
  onClear: () => void;
  activeId: string | null;
}

export const ForecastHistory: React.FC<ForecastHistoryProps> = ({
  history,
  onSelect,
  onClear,
  activeId,
}) => {
  if (history.length === 0) {
    return (
      <div className="card" style={emptyCardStyles}>
        <History size={16} color="var(--text-secondary)" />
        <span style={emptyTextStyles}>History Book is empty</span>
      </div>
    );
  }

  // Helper to format date strings for visual compactness (e.g. Jan 31)
  const formatDateRangeLabel = (start: string, end: string) => {
    const format = (dateStr: string) => {
      const parts = dateStr.split('-');
      const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    return `${format(start)} – ${format(end)}`;
  };

  // Calculate average predicted value to show as a quick metric indicator
  const calculateAverage = (item: ForecastHistoryItem) => {
    const total = item.results.reduce((sum, res) => sum + res.predictedDemand, 0);
    return total / item.results.length;
  };

  return (
    <div className="card fade-in" style={containerStyles}>
      <div style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} color="var(--accent-primary)" />
          <h3 className="card-title" style={{ margin: 0, fontSize: '1rem' }}>
            Forecast History Book
          </h3>
        </div>
        <button
          onClick={onClear}
          style={clearBtnStyles}
          title="Clear all saved history"
          aria-label="Clear history book"
        >
          <Trash2 size={14} />
          <span>Clear</span>
        </button>
      </div>

      <div style={listStyles}>
        {history.map((item) => {
          const isActive = item.id === activeId;
          const avgDemand = calculateAverage(item);

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              style={isActive ? activeItemStyles : itemStyles}
              className="history-item"
            >
              <div style={rowHeaderStyles}>
                <span style={timeStyles}>{item.timestamp}</span>
                <span style={daysBadgeStyles}>{item.days} Day{item.days > 1 ? 's' : ''}</span>
              </div>

              <div style={dateRangeStyles}>
                <Calendar size={11} color="var(--text-secondary)" />
                <span>{formatDateRangeLabel(item.startDate, item.endDate)}</span>
              </div>

              <div style={metricStyles}>
                <TrendingUp size={11} color="var(--accent-secondary)" />
                <span>Avg: <strong>{formatDemand(avgDemand)}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Styles
const containerStyles: React.CSSProperties = {
  padding: '1.25rem',
  marginTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const clearBtnStyles: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  color: 'var(--color-danger)',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '6px',
  transition: 'background var(--transition-fast)',
};

const listStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  maxHeight: '280px',
  overflowY: 'auto',
  paddingRight: '2px',
};

const itemStyles: React.CSSProperties = {
  cursor: 'pointer',
  padding: '0.75rem',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
  transition: 'all var(--transition-fast)',
  textAlign: 'left',
};

const activeItemStyles: React.CSSProperties = {
  ...itemStyles,
  borderColor: 'var(--accent-primary)',
  backgroundColor: 'rgba(83, 109, 254, 0.04)',
  boxShadow: '0 2px 8px rgba(83, 109, 254, 0.08)',
};

const rowHeaderStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const timeStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
};

const daysBadgeStyles: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 700,
  backgroundColor: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  padding: '1px 5px',
  borderRadius: '4px',
};

const dateRangeStyles: React.CSSProperties = {
  fontSize: '0.775rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
};

const metricStyles: React.CSSProperties = {
  fontSize: '0.725rem',
  color: 'var(--text-secondary)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
};

const emptyCardStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '1.25rem',
  marginTop: '1rem',
  color: 'var(--text-secondary)',
  fontSize: '0.8rem',
  fontWeight: 500,
};

const emptyTextStyles: React.CSSProperties = {
  color: 'var(--text-secondary)',
};

// Add hover effect style tag
const hoverStyle = document.createElement('style');
hoverStyle.textContent = `
  .history-item:hover {
    border-color: var(--accent-primary) !important;
    background-color: rgba(83, 109, 254, 0.02) !important;
    transform: translateY(-1px);
  }
`;
document.head.appendChild(hoverStyle);

export default ForecastHistory;

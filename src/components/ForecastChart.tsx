import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from 'recharts';
import { Download } from 'lucide-react';
import type { ForecastResult } from '../types/forecast';
import { formatDemand } from '../utils/formatDemand';

interface ForecastChartProps {
  results: ForecastResult[];
  theme: 'light' | 'dark';
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ results, theme }) => {
  if (results.length === 0) return null;

  // Format date strings, day names and flag weekends
  const chartData = results.map((item) => {
    const parts = item.date.split('-');
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Saturday (6) and Sunday (0)
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

    return {
      ...item,
      label,
      dayName,
      isWeekend,
    };
  });

  const totalDays = results.length;
  const xAxisInterval = totalDays > 15 ? 4 : totalDays > 7 ? 2 : 0;

  // Theme configuration
  const gridStroke = theme === 'dark' ? '#2A3543' : '#E2E8F0';
  const labelColor = theme === 'dark' ? '#AAB4C3' : '#647084';
  const accentColor = theme === 'dark' ? '#7D91FF' : '#536DFE';
  const ciColor = theme === 'dark' ? 'rgba(125, 145, 255, 0.25)' : 'rgba(83, 109, 254, 0.25)';
  const weekendAreaColor = theme === 'dark' ? 'rgba(125, 145, 255, 0.04)' : 'rgba(59, 130, 246, 0.035)';

  const handleExportPNG = () => {
    alert(
      'PNG Export Hook triggered. In a production environment, this hook captures the SVG canvas using library tools (like html2canvas or svg-to-image-api) and downloads it to the user device.'
    );
  };

  // Custom tooltips showing predicted value and CI bounds with Weekend Highlight
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={tooltipContainerStyles}>
          <div style={tooltipHeaderStyles}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
              <span style={tooltipTitleStyles}>{data.label}</span>
              {data.isWeekend && (
                <span className="badge-weekend" style={weekendBadgeStyles}>Weekend</span>
              )}
            </div>
            <span style={tooltipSubtitleStyles}>{data.dayName}</span>
          </div>
          <div style={tooltipBodyStyles}>
            <div style={tooltipRowStyles}>
              <span style={tooltipLabelStyles}>Predicted Demand:</span>
              <span style={{ ...tooltipValStyles, color: 'var(--accent-primary)', fontWeight: 800 }}>
                {formatDemand(data.predictedDemand)}
              </span>
            </div>
            <div style={tooltipRowStyles}>
              <span style={tooltipLabelStyles}>95% CI Lower:</span>
              <span style={tooltipValStyles}>{formatDemand(data.lower95)}</span>
            </div>
            <div style={tooltipRowStyles}>
              <span style={tooltipLabelStyles}>95% CI Upper:</span>
              <span style={tooltipValStyles}>{formatDemand(data.upper95)}</span>
            </div>
            <div style={tooltipDividerStyles}></div>
            <div style={tooltipRowStyles}>
              <span style={tooltipLabelStyles}>Discount Applied:</span>
              <span style={tooltipValStyles}>{data.discount}%</span>
            </div>
            <div style={tooltipRowStyles}>
              <span style={tooltipLabelStyles}>Promotion Active:</span>
              <span style={tooltipValStyles}>{data.promotion === 1 ? 'Yes' : 'No'}</span>
            </div>
            <div style={tooltipRowStyles}>
              <span style={tooltipLabelStyles}>Epidemic containment:</span>
              <span style={tooltipValStyles}>{data.epidemic === 1 ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card fade-slide-up" style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <div>
          <h3 className="card-title" style={{ margin: 0 }}>Forecasted Demand Trend</h3>
          <p className="card-subtitle" style={{ margin: 0, marginTop: '2px' }}>
            Volume timeline showing predictions, 95% confidence intervals, and weekend shading.
          </p>
        </div>
        <button
          onClick={handleExportPNG}
          className="btn-secondary"
          style={exportBtnStyles}
          title="Export chart as PNG"
          aria-label="Export Chart as PNG"
        >
          <Download size={14} />
          <span>Export PNG</span>
        </button>
      </div>

      {/* Chart */}
      <div style={chartWrapperStyles}>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="chart-area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: labelColor, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={xAxisInterval}
            />
            <YAxis
              tick={{ fill: labelColor, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'var(--accent-primary)', strokeWidth: 1, strokeDasharray: '3 3' }} 
            />
            <Legend verticalAlign="top" height={36} iconType="plainline" iconSize={12} wrapperStyle={{ fontSize: 11 }} />
            
            {/* Weekend Reference Areas - dynamically shade weekend dates in background */}
            {chartData.map((item) => {
              if (item.isWeekend) {
                return (
                  <ReferenceArea
                    key={item.date}
                    x1={item.label}
                    x2={item.label}
                    fill={weekendAreaColor}
                    stroke="none"
                    ifOverflow="extendDomain"
                  />
                );
              }
              return null;
            })}

            {/* Shaded Area under predicted line */}
            <Area
              type="monotone"
              dataKey="predictedDemand"
              fill="url(#chart-area-fill)"
              stroke="none"
              legendType="none"
              tooltipType="none"
            />

            {/* Upper CI Line */}
            <Line
              type="monotone"
              dataKey="upper95"
              name="Upper CI (95%)"
              stroke={ciColor}
              strokeWidth={1.25}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
            />

            {/* Mean Predicted Demand Line */}
            <Line
              type="monotone"
              dataKey="predictedDemand"
              name="Forecasted Mean"
              stroke={accentColor}
              strokeWidth={3.2}
              dot={{ r: 4, strokeWidth: 1.5, fill: 'var(--bg-card)' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: accentColor }}
              animationDuration={500}
            />

            {/* Lower CI Line */}
            <Line
              type="monotone"
              dataKey="lower95"
              name="Lower CI (95%)"
              stroke={ciColor}
              strokeWidth={1.25}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Styles
const containerStyles: React.CSSProperties = {
  width: '100%',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
  gap: '1rem',
};

const exportBtnStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.4rem 0.75rem',
  fontSize: '0.775rem',
};

const chartWrapperStyles: React.CSSProperties = {
  width: '100%',
  overflow: 'visible',
};

const tooltipContainerStyles: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-hover)',
  padding: '0.75rem 1rem',
  minWidth: '240px',
  textAlign: 'left',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
};

const tooltipHeaderStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '0.5rem',
};

const tooltipTitleStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const tooltipSubtitleStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
};

const tooltipBodyStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const tooltipRowStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.775rem',
};

const tooltipLabelStyles: React.CSSProperties = {
  color: 'var(--text-secondary)',
  marginRight: '1rem',
};

const tooltipValStyles: React.CSSProperties = {
  fontWeight: 600,
  color: 'var(--text-primary)',
};

const tooltipDividerStyles: React.CSSProperties = {
  height: '1px',
  background: 'var(--border-color)',
  margin: '0.25rem 0',
};

const weekendBadgeStyles: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 700,
  backgroundColor: '#EAF4FF',
  color: '#3B82F6',
  border: '1px solid #CDE3FF',
  padding: '1px 5px',
  borderRadius: '4px',
  display: 'inline-block',
};

export default ForecastChart;

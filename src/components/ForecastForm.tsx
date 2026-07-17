import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Play, 
  RotateCcw, 
  Plus, 
  Minus, 
  AlertCircle, 
  Copy, 
  RefreshCw 
} from 'lucide-react';
import type { ForecastFormValues, ForecastRecord } from '../types/forecast';
import { buildForecastDates } from '../utils/buildForecastDates';

interface ForecastFormProps {
  onSubmit: (values: ForecastFormValues, customRecords: ForecastRecord[]) => void;
  isLoading: boolean;
  initialValues: ForecastFormValues;
}

export const ForecastForm: React.FC<ForecastFormProps> = ({ onSubmit, isLoading, initialValues }) => {
  // 1. Core State
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const dateInputRef = useRef<HTMLInputElement>(null);
  
  // Forecast days: 1 for single, or 7/15/28/-1 for multi
  const [forecastDays, setForecastDays] = useState<number>(7); 
  const [customDays, setCustomDays] = useState<string>('30');
  
  const [discount, setDiscount] = useState<number>(10.0);
  const [discountInput, setDiscountInput] = useState<string>('10');
  const [promotion, setPromotion] = useState<0 | 1>(initialValues.promotion);
  const [epidemic, setEpidemic] = useState<0 | 1>(initialValues.epidemic);

  // Per-Day Override records list
  const [records, setRecords] = useState<ForecastRecord[]>([]);

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const MIN_DATE = '2024-01-31';

  // Calculate actual forecast horizon days based on mode
  const resolvedDays = mode === 'single' 
    ? 1 
    : (forecastDays === -1 ? Number(customDays || 30) : Number(forecastDays));

  // Sync records list whenever start date, mode, or baseline parameters change
  useEffect(() => {
    if (startDate && resolvedDays > 0) {
      const dates = buildForecastDates(startDate, resolvedDays);
      setRecords(
        dates.map((date) => ({
          Date: date,
          Discount: Number(discount),
          Promotion: promotion,
          Epidemic: epidemic,
        }))
      );
    }
  }, [startDate, mode, forecastDays, customDays, discount, promotion, epidemic]);

  // Sync baseline discount input text state when discount value changes
  useEffect(() => {
    setDiscountInput(String(discount));
  }, [discount]);

  // Copy baseline values to all days
  const handleCopyBaselineToAll = () => {
    setRecords((prev) =>
      prev.map((rec) => ({
        ...rec,
        Discount: Number(discount),
        Promotion: promotion,
        Epidemic: epidemic,
      }))
    );
  };

  // Reset a specific day row back to baseline
  const handleResetDay = (index: number) => {
    setRecords((prev) =>
      prev.map((rec, i) =>
        i === index
          ? {
              ...rec,
              Discount: Number(discount),
              Promotion: promotion,
              Epidemic: epidemic,
            }
          : rec
      )
    );
  };

  // Copy a specific day row's parameters to the next day
  const handleCopyDayToNext = (index: number) => {
    if (index < records.length - 1) {
      const source = records[index];
      setRecords((prev) =>
        prev.map((rec, i) =>
          i === index + 1
            ? {
                ...rec,
                Discount: source.Discount,
                Promotion: source.Promotion,
                Epidemic: source.Epidemic,
              }
            : rec
        )
      );
    }
  };

  // Handle updates to specific day values
  const handleUpdateRecord = (index: number, key: keyof ForecastRecord, value: any) => {
    setRecords((prev) =>
      prev.map((rec, i) => (i === index ? { ...rec, [key]: value } : rec))
    );
  };

  // Stepper handlers for Apple-style custom day counter
  const handleIncrement = () => {
    setCustomDays((prev) => {
      const current = Number(prev) || 1;
      return String(Math.min(90, current + 1));
    });
  };

  const handleDecrement = () => {
    setCustomDays((prev) => {
      const current = Number(prev) || 1;
      return String(Math.max(1, current - 1));
    });
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 1. Date check
    if (!startDate) {
      newErrors.startDate = 'Please select a date.';
    } else if (startDate < MIN_DATE) {
      newErrors.startDate = 'Start date cannot be earlier than January 31, 2024.';
    }

    // 2. Horizon checks in multi mode
    if (mode === 'multi' && forecastDays === -1) {
      const daysNum = Number(customDays);
      if (!customDays || isNaN(daysNum)) {
        newErrors.customDays = 'Please enter a valid number of days.';
      } else if (daysNum <= 0 || !Number.isInteger(daysNum)) {
        newErrors.customDays = 'Horizon must be a positive whole number.';
      } else if (daysNum > 90) {
        newErrors.customDays = 'Maximum forecast horizon is 90 days.';
      }
    }

    // 3. Discount check
    if (isNaN(discount) || discount < 0 || discount > 25) {
      newErrors.discount = 'Discount must be between 0% and 25%.';
    }

    // 4. Overrides check
    records.forEach((rec, idx) => {
      if (isNaN(rec.Discount) || rec.Discount < 0 || rec.Discount > 25) {
        newErrors[`discount_${idx}`] = `Day ${idx + 1} discount must be 0-25%.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(
        {
          startDate,
          forecastDays: mode === 'single' ? 1 : forecastDays,
          customDays: mode === 'multi' && forecastDays === -1 ? Number(customDays) : undefined,
          discount: Number(discount),
          promotion,
          epidemic,
        },
        records
      );
    }
  };

  // Reset form
  const handleReset = () => {
    setStartDate(initialValues.startDate);
    setForecastDays(7);
    setCustomDays('30');
    setDiscount(initialValues.discount);
    setPromotion(initialValues.promotion);
    setEpidemic(initialValues.epidemic);
    setErrors({});
  };



  // Helper for sub-tags (Wednesday / January)
  const getDayAndMonthTags = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
    return { dayName, monthName };
  };

  const getDayDetails = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return { label: dateStr, isWeekend: false, dayName: '' };
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return { label: dateStr, isWeekend, dayName };
  };

  const tags = getDayAndMonthTags(startDate);

  return (
    <form onSubmit={handleSubmit} style={formContainerStyles} noValidate>
      
      {/* 1. Pill-shaped Mode Selector */}
      <div style={modeWrapperStyles}>
        <div style={modeControlStyles}>
          <button
            type="button"
            className={`mode-btn ${mode === 'single' ? 'active' : ''}`}
            onClick={() => {
              setMode('single');
              setErrors({});
            }}
          >
            <Calendar size={14} />
            <span>Single-Day Forecast</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === 'multi' ? 'active' : ''}`}
            onClick={() => {
              setMode('multi');
              setErrors({});
            }}
          >
            <Calendar size={14} />
            <span>Multi-Day Forecast</span>
          </button>
        </div>
      </div>

      {/* 2. Date Constraint Warning Banner */}
      <div style={bannerStyles} className="fade-in">
        <AlertCircle size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={bannerTitleStyles}>SARIMAX Model Date Constraint</strong>
          <p style={bannerTextStyles}>
            The Databricks model served endpoint was trained on historical data up to <strong>2024-01-30</strong>. Due to auto-regressive time-series constraints, the first forecast date must be exactly <strong>2024-01-31</strong>.
          </p>
        </div>
      </div>

      {/* 3. Spacious Horizontal Baseline Parameters Card */}
      <div className="card fade-in" style={horizontalCardStyles}>
        <div style={horizontalGridStyles}>
          
          {/* Col 1: Start Date */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label" style={{ gap: '0.25rem' }}>
              <Calendar size={14} color="var(--accent-primary)" />
              <span>{mode === 'single' ? 'Forecast Date' : 'Forecast Start Date'}</span>
            </label>
            <div 
              style={overlayCardStyles}
              onClick={() => {
                if (!isLoading) {
                  dateInputRef.current?.showPicker();
                }
              }}
            >
              <span style={overlayTextStyles}>{startDate ? startDate.split('-').reverse().join('-') : 'Select Date'}</span>
              <button
                type="button"
                className="btn-secondary"
                style={smallDateBtnStyles}
                tabIndex={-1}
                disabled={isLoading}
              >
                Choose Date
              </button>
              <input
                ref={dateInputRef}
                type="date"
                min={MIN_DATE}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isLoading}
                style={invisibleInputStyles}
                aria-invalid={!!errors.startDate}
              />
            </div>
            {tags && (
              <div style={tagRowStyles}>
                <span style={dayTagStyles}>{tags.dayName}</span>
                <span style={monthTagStyles}>{tags.monthName}</span>
              </div>
            )}
            {errors.startDate && <span style={errorTextStyles}>{errors.startDate}</span>}
          </div>

          {/* Col 2: Duration Selector (only in Multi mode) */}
          {mode === 'multi' && (
            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <div style={durationGridStyles}>
                <button
                  type="button"
                  style={forecastDays === 7 ? durationActiveBtnStyles : durationBtnStyles}
                  onClick={() => setForecastDays(7)}
                  disabled={isLoading}
                >
                  7
                </button>
                <button
                  type="button"
                  style={forecastDays === 15 ? durationActiveBtnStyles : durationBtnStyles}
                  onClick={() => setForecastDays(15)}
                  disabled={isLoading}
                >
                  15
                </button>
                <button
                  type="button"
                  style={forecastDays === 28 ? durationActiveBtnStyles : durationBtnStyles}
                  onClick={() => setForecastDays(28)}
                  disabled={isLoading}
                >
                  28
                </button>
                <button
                  type="button"
                  style={forecastDays === -1 ? durationActiveBtnStyles : durationBtnStyles}
                  onClick={() => setForecastDays(-1)}
                  disabled={isLoading}
                  title="Custom Duration"
                >
                  Custom
                </button>
              </div>

              {forecastDays === -1 && (
                <div style={stepperWrapperStyles} className="fade-in">
                  <button type="button" onClick={handleDecrement} style={stepperBtnStyles} disabled={isLoading || Number(customDays) <= 1}>
                    <Minus size={12} />
                  </button>
                  <input
                    type="number"
                    value={customDays}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '') setCustomDays('');
                      else setCustomDays(String(Math.max(1, Math.min(90, Number(v)))));
                    }}
                    style={stepperInputStyles}
                    disabled={isLoading}
                  />
                  <button type="button" onClick={handleIncrement} style={stepperBtnStyles} disabled={isLoading || Number(customDays) >= 90}>
                    <Plus size={12} />
                  </button>
                </div>
              )}
              {errors.customDays && <span style={errorTextStyles}>{errors.customDays}</span>}
            </div>
          )}

          {/* Col 3: Base Discount Slider */}
          <div className="form-group">
            <label className="form-label">
              <span>{mode === 'single' ? 'Discount' : 'Base Discount'}</span>
              <span style={discountPercentLabelStyles}>{discount}%</span>
            </label>
            <div style={sliderRowStyles}>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                disabled={isLoading}
                style={{ flex: 1 }}
              />
              <input
                type="text"
                value={discountInput}
                onChange={(e) => {
                  const raw = e.target.value;
                  // Strip anything except numbers and dots
                  let cleaned = raw.replace(/[^0-9.]/g, '');
                  const dotIndex = cleaned.indexOf('.');
                  if (dotIndex !== -1) {
                    cleaned = cleaned.substring(0, dotIndex + 1) + cleaned.substring(dotIndex + 1).replace(/\./g, '');
                  }

                  // Auto insert decimal point after 2 integer values if no dot is present
                  if (cleaned.length === 3 && !cleaned.includes('.')) {
                    cleaned = cleaned.substring(0, 2) + '.' + cleaned.substring(2);
                  }

                  // Force maximum of 2 decimal places
                  const finalDotIndex = cleaned.indexOf('.');
                  if (finalDotIndex !== -1) {
                    const integerPart = cleaned.substring(0, finalDotIndex);
                    let decimalPart = cleaned.substring(finalDotIndex + 1);
                    if (decimalPart.length > 2) {
                      decimalPart = decimalPart.substring(0, 2);
                    }
                    cleaned = integerPart + '.' + decimalPart;
                  }

                  // Cap at 25.0 max
                  let num = Number(cleaned);
                  if (!isNaN(num) && num > 25) {
                    cleaned = '25';
                    num = 25;
                  }

                  setDiscountInput(cleaned);
                  if (!isNaN(num)) {
                    setDiscount(num);
                  }
                }}
                style={discountInputStyles}
                disabled={isLoading}
              />
            </div>
            {errors.discount && <span style={errorTextStyles}>{errors.discount}</span>}
          </div>

          {/* Col 4: Base Promotion Campaign */}
          <div className="form-group">
            <label className="form-label">{mode === 'single' ? 'Promotion' : 'Base Promo'}</label>
            <div className="segment-control" style={{ width: '100%' }}>
              <button
                type="button"
                className={`segment-btn ${promotion === 0 ? 'active' : ''}`}
                onClick={() => setPromotion(0)}
                disabled={isLoading}
              >
                No Promo
              </button>
              <button
                type="button"
                className={`segment-btn ${promotion === 1 ? 'segment-btn-promo-active' : ''}`}
                onClick={() => setPromotion(1)}
                disabled={isLoading}
              >
                Promo Active
              </button>
            </div>
          </div>

          {/* Col 5: Base Epidemic Containment */}
          <div className="form-group">
            <label className="form-label">{mode === 'single' ? 'Epidemic Condition' : 'Base Epidemic'}</label>
            <div className="segment-control" style={{ width: '100%' }}>
              <button
                type="button"
                className={`segment-btn ${epidemic === 0 ? 'active' : ''}`}
                onClick={() => setEpidemic(0)}
                disabled={isLoading}
              >
                No Epidemic
              </button>
              <button
                type="button"
                className={`segment-btn ${epidemic === 1 ? 'segment-btn-epidemic-active' : ''}`}
                onClick={() => setEpidemic(1)}
                disabled={isLoading}
              >
                Epid. Active
              </button>
            </div>
          </div>

        </div>

        {/* Generate Trigger */}
        <div style={triggerWrapperStyles}>
          <button type="submit" className="btn-primary" style={submitBtnStyles} disabled={isLoading}>
            <Play size={14} fill="currentColor" />
            {isLoading ? 'Generating Forecast...' : 'Generate Demand Forecast'}
          </button>
          {!isLoading && (
            <button type="button" onClick={handleReset} className="btn-secondary" style={resetBtnStyles} title="Reset Configuration">
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 4. Forecasting Days Config Overrides Table (Only in Multi mode) */}
      {mode === 'multi' && (
        <div className="card fade-in" style={tableCardStyles}>
          <div style={tableHeaderStyles}>
            <div>
              <h4 style={tableTitleStyles}>Forecasting Days Config</h4>
              <p className="form-desc" style={{ margin: 0, marginTop: '2px' }}>
                Configure parameters for each consecutive calendar day.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyBaselineToAll}
              style={copyBaselineBtnStyles}
              className="btn-secondary"
              disabled={isLoading}
            >
              Copy Baseline to All
            </button>
          </div>

          <div style={tableContainerStyles}>
            <table style={recordsTableStyles}>
              <thead>
                <tr>
                  <th style={thStyles}>Day</th>
                  <th style={thStyles}>Date</th>
                  <th style={thStyles}>Discount (%)</th>
                  <th style={thStyles}>Promotion</th>
                  <th style={thStyles}>Epidemic Condition</th>
                  <th style={{ ...thStyles, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, idx) => {
                  const dayDetails = getDayDetails(rec.Date);
                  return (
                    <tr key={rec.Date} style={trStyles}>
                      <td style={tdStyles}>
                        <span style={dayBadgeStyles}>#{idx + 1}</span>
                      </td>
                      <td style={tdStyles}>
                        <div style={dateColStyles}>
                          <span style={dateTextStyles}>{rec.Date.split('-').reverse().join('-')}</span>
                          {dayDetails.isWeekend ? (
                            <span className="badge-weekend" style={weekendBadgeStyles}>
                              {dayDetails.dayName.split(' ')[0]} (Weekend)
                            </span>
                          ) : (
                            <span style={weekdayStyles}>{dayDetails.dayName}</span>
                          )}
                        </div>
                      </td>
                      <td style={tdStyles}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '80px', position: 'relative' }}>
                          <input
                            type="text"
                            value={rec.Discount}
                            onChange={(e) => {
                              const raw = e.target.value;
                              let cleaned = raw.replace(/[^0-9.]/g, '');
                              const dotIndex = cleaned.indexOf('.');
                              if (dotIndex !== -1) {
                                cleaned = cleaned.substring(0, dotIndex + 1) + cleaned.substring(dotIndex + 1).replace(/\./g, '');
                              }

                              if (cleaned.length === 3 && !cleaned.includes('.')) {
                                cleaned = cleaned.substring(0, 2) + '.' + cleaned.substring(2);
                              }

                              // Force maximum of 2 decimal places
                              const finalDotIndex = cleaned.indexOf('.');
                              if (finalDotIndex !== -1) {
                                const integerPart = cleaned.substring(0, finalDotIndex);
                                let decimalPart = cleaned.substring(finalDotIndex + 1);
                                if (decimalPart.length > 2) {
                                  decimalPart = decimalPart.substring(0, 2);
                                }
                                cleaned = integerPart + '.' + decimalPart;
                              }

                              let num = Number(cleaned);
                              if (isNaN(num)) num = 0;
                              if (num > 25) num = 25;
                              if (num < 0) num = 0;

                              handleUpdateRecord(idx, 'Discount', num);
                            }}
                            style={tableDiscountInputStyles}
                            className="input-control"
                            disabled={isLoading}
                          />
                          <span style={tablePercentStyles}>%</span>
                        </div>
                      </td>
                      <td style={tdStyles}>
                        <div className="segment-control" style={{ maxWidth: '220px' }}>
                          <button
                            type="button"
                            className={`segment-btn ${rec.Promotion === 0 ? 'active' : ''}`}
                            style={smallSegmentStyles}
                            onClick={() => handleUpdateRecord(idx, 'Promotion', 0)}
                            disabled={isLoading}
                          >
                            No Promo
                          </button>
                          <button
                            type="button"
                            className={`segment-btn ${rec.Promotion === 1 ? 'segment-btn-promo-active' : ''}`}
                            style={smallSegmentStyles}
                            onClick={() => handleUpdateRecord(idx, 'Promotion', 1)}
                            disabled={isLoading}
                          >
                            Promo Active
                          </button>
                        </div>
                      </td>
                      <td style={tdStyles}>
                        <div className="segment-control" style={{ maxWidth: '220px' }}>
                          <button
                            type="button"
                            className={`segment-btn ${rec.Epidemic === 0 ? 'active' : ''}`}
                            style={smallSegmentStyles}
                            onClick={() => handleUpdateRecord(idx, 'Epidemic', 0)}
                            disabled={isLoading}
                          >
                            No Epidemic
                          </button>
                          <button
                            type="button"
                            className={`segment-btn ${rec.Epidemic === 1 ? 'segment-btn-epidemic-active' : ''}`}
                            style={smallSegmentStyles}
                            onClick={() => handleUpdateRecord(idx, 'Epidemic', 1)}
                            disabled={isLoading}
                          >
                            Epid. Active
                          </button>
                        </div>
                      </td>
                      <td style={{ ...tdStyles, textAlign: 'right' }}>
                        <div style={actionsGroupStyles}>
                          <button
                            type="button"
                            onClick={() => handleCopyDayToNext(idx)}
                            style={actionIconBtnStyles}
                            className="btn-secondary"
                            title="Copy settings to next day"
                            disabled={isLoading || idx === records.length - 1}
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetDay(idx)}
                            style={actionIconBtnStyles}
                            className="btn-secondary"
                            title="Reset day settings to baseline"
                            disabled={isLoading}
                          >
                            <RefreshCw size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </form>
  );
};

// Styling definitions
const formContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
};

const modeWrapperStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const modeControlStyles: React.CSSProperties = {
  display: 'flex',
  backgroundColor: 'var(--bg-secondary)',
  padding: '0.375rem',
  borderRadius: '9999px',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--shadow-card)',
  gap: '0.25rem',
};



const bannerStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  padding: '1rem 1.25rem',
  backgroundColor: 'rgba(83, 109, 254, 0.035)',
  border: '1px solid rgba(83, 109, 254, 0.12)',
  borderRadius: '16px',
  textAlign: 'left',
  lineHeight: 1.4,
};

const bannerTitleStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
};

const bannerTextStyles: React.CSSProperties = {
  fontSize: '0.775rem',
  color: 'var(--text-secondary)',
  margin: 0,
  marginTop: '2px',
};

const horizontalCardStyles: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const horizontalGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.25rem',
  width: '100%',
};

const overlayCardStyles: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 0.875rem',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  background: 'rgba(100, 110, 130, 0.02)',
  height: '42px',
};

const smallDateBtnStyles: React.CSSProperties = {
  position: 'absolute',
  right: '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  padding: '0.25rem 0.625rem',
  fontSize: '0.75rem',
  pointerEvents: 'none',
};

const overlayTextStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const invisibleInputStyles: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
  zIndex: 3,
};

const tagRowStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.375rem',
  marginTop: '0.375rem',
};

const tagBaseStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: '4px',
};

const dayTagStyles: React.CSSProperties = {
  ...tagBaseStyles,
  backgroundColor: 'rgba(125, 145, 255, 0.08)',
  color: 'var(--accent-primary)',
};

const monthTagStyles: React.CSSProperties = {
  ...tagBaseStyles,
  backgroundColor: 'rgba(6, 182, 212, 0.08)',
  color: '#06B6D4',
};

const durationGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '0.375rem',
  height: '42px',
};

const durationBtnStyles: React.CSSProperties = {
  cursor: 'pointer',
  border: '1px solid var(--border-color)',
  background: 'rgba(100, 112, 132, 0.02)',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem',
  fontWeight: 700,
  borderRadius: 'var(--radius-md)',
  transition: 'all var(--transition-fast)',
};

const durationActiveBtnStyles: React.CSSProperties = {
  ...durationBtnStyles,
  background: 'var(--accent-primary)',
  borderColor: 'var(--accent-primary)',
  color: 'white',
  boxShadow: '0 4px 10px rgba(83, 109, 254, 0.15)',
};

const stepperWrapperStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.25rem',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-secondary)',
  marginTop: '0.5rem',
  maxWidth: '120px',
};

const stepperBtnStyles: React.CSSProperties = {
  cursor: 'pointer',
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const stepperInputStyles: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  width: '40px',
  textAlign: 'center',
  fontSize: '0.875rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  outline: 'none',
};

const sliderRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  height: '42px',
};

const discountPercentLabelStyles: React.CSSProperties = {
  fontSize: '0.775rem',
  fontWeight: 700,
  color: 'var(--accent-primary)',
};

const discountInputStyles: React.CSSProperties = {
  width: '58px',
  height: '34px',
  fontSize: '0.85rem',
  fontWeight: 700,
  textAlign: 'right',
  padding: '0.25rem 0.5rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'rgba(100, 110, 130, 0.03)',
  color: 'var(--text-primary)',
};

const triggerWrapperStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  borderTop: '1px solid var(--border-color)',
  paddingTop: '1.25rem',
  marginTop: '0.25rem',
};

const submitBtnStyles: React.CSSProperties = {
  flex: '1',
  maxWidth: '320px',
};

const resetBtnStyles: React.CSSProperties = {
  padding: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const errorTextStyles: React.CSSProperties = {
  color: 'var(--color-danger)',
  fontSize: '0.725rem',
  fontWeight: 700,
  marginTop: '0.25rem',
};

/* Overrides Table Styles */
const tableCardStyles: React.CSSProperties = {
  padding: '1.5rem',
};

const tableHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1.25rem',
  flexWrap: 'wrap',
  gap: '0.75rem',
};

const tableTitleStyles: React.CSSProperties = {
  margin: 0,
  fontSize: '1.05rem',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  textAlign: 'left',
};

const copyBaselineBtnStyles: React.CSSProperties = {
  padding: '0.5rem 0.875rem',
  fontSize: '0.775rem',
};

const tableContainerStyles: React.CSSProperties = {
  width: '100%',
  overflowX: 'auto',
};

const recordsTableStyles: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
};

const thStyles: React.CSSProperties = {
  padding: '0.75rem 1rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-secondary)',
  borderBottom: '1px solid var(--border-color)',
};

const trStyles: React.CSSProperties = {
  borderBottom: '1px solid var(--border-color)',
};

const tdStyles: React.CSSProperties = {
  padding: '0.85rem 1rem',
  fontSize: '0.85rem',
  verticalAlign: 'middle',
};

const dayBadgeStyles: React.CSSProperties = {
  fontSize: '0.775rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const dateColStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
};

const dateTextStyles: React.CSSProperties = {
  fontWeight: 700,
  color: 'var(--text-primary)',
};

const weekdayStyles: React.CSSProperties = {
  fontSize: '0.725rem',
  color: 'var(--text-secondary)',
  fontWeight: 600,
};

const weekendBadgeStyles: React.CSSProperties = {
  fontSize: '0.675rem',
  fontWeight: 700,
  backgroundColor: '#EAF4FF',
  color: '#3B82F6',
  border: '1px solid #CDE3FF',
  padding: '0px 5px',
  borderRadius: '4px',
  display: 'inline-block',
  width: 'max-content',
};

const tableDiscountInputStyles: React.CSSProperties = {
  width: '64px',
  height: '32px',
  fontSize: '0.8rem',
  fontWeight: 700,
  padding: '0.25rem 0.75rem 0.25rem 0.25rem',
  textAlign: 'right',
};

const tablePercentStyles: React.CSSProperties = {
  position: 'absolute',
  right: '6px',
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  pointerEvents: 'none',
};

const smallSegmentStyles: React.CSSProperties = {
  padding: '0.45rem',
  fontSize: '0.75rem',
};

const actionsGroupStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.375rem',
};

const actionIconBtnStyles: React.CSSProperties = {
  width: '26px',
  height: '26px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  borderRadius: '6px',
};

export default ForecastForm;

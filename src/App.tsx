import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ForecastForm from './components/ForecastForm';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import ForecastSummary from './components/ForecastSummary';
import ForecastChart from './components/ForecastChart';
import ForecastTable from './components/ForecastTable';
import ForecastHistory from './components/ForecastHistory';
import Footer from './components/Footer';

import type { 
  ForecastFormValues, 
  ForecastResult, 
  ForecastRecord, 
  ForecastHistoryItem 
} from './types/forecast';
import { parsePredictions } from './utils/parsePredictions';
import { generateForecast } from './services/forecastApi';

export const App: React.FC = () => {
  // 1. Theme Configuration
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Load User preferences & baseline defaults
  const getInitialValues = (): ForecastFormValues => {
    const defaultDateStr = '2024-01-31';
    const savedDays = localStorage.getItem('lastForecastDays');

    return {
      startDate: defaultDateStr,
      forecastDays: savedDays ? Number(savedDays) : 1,
      discount: 10.0, // Strictly default to 10.0% to resolve any local storage overrides
      promotion: 0,
      epidemic: 0,
    };
  };

  const [initialValues] = useState<ForecastFormValues>(getInitialValues);

  // 3. Forecast History Book Log state
  const [history, setHistory] = useState<ForecastHistoryItem[]>(() => {
    try {
      const savedHistory = localStorage.getItem('forecastHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error('Failed to load history:', e);
      return [];
    }
  });

  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // 4. API & Visualization states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ForecastResult[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  const [activeParameters, setActiveParameters] = useState<{
    startDate: string;
    endDate: string;
    days: number;
    discount: number;
    promotion: 0 | 1;
    epidemic: 0 | 1;
  } | null>(null);

  const isConfigured = true; // Secured Serverless endpoint is operational

  // Retry reference trackers
  const [lastSubmittedValues, setLastSubmittedValues] = useState<ForecastFormValues | null>(null);
  const [lastSubmittedRecords, setLastSubmittedRecords] = useState<ForecastRecord[] | null>(null);

  // 5. Submit Forecast (incorporating per-day adjustments)
  const handleGenerateForecast = async (values: ForecastFormValues, customRecords: ForecastRecord[]) => {
    setIsLoading(true);
    setError(null);
    setLastSubmittedValues(values);
    setLastSubmittedRecords(customRecords);

    // Save non-sensitive general parameters
    localStorage.setItem('lastForecastDays', String(values.forecastDays));
    localStorage.setItem('lastDiscount', String(values.discount));

    try {
      // Step A: Build payload directly using customized per-day conditions array
      const payload = { dataframe_records: customRecords };

      // Step B: Send POST request via secure proxy backend
      const rawResponse = await generateForecast(payload);
      
      // Step C: Parse and validate predictions & confidence intervals
      const parsedResults = parsePredictions(rawResponse, customRecords);
      
      // Step D: Update states on success
      setResults(parsedResults);
      setIsConnected(true);

      const resolvedDays = customRecords.length;
      const endDateStr = parsedResults[parsedResults.length - 1].date;

      setActiveParameters({
        startDate: customRecords[0].Date,
        endDate: endDateStr,
        days: resolvedDays,
        discount: values.discount,
        promotion: values.promotion,
        epidemic: values.epidemic,
      });

      // Step E: Save to history record book
      const newHistoryItem: ForecastHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        startDate: customRecords[0].Date,
        endDate: endDateStr,
        days: resolvedDays,
        results: parsedResults,
      };

      setHistory((prev) => {
        const updated = [newHistoryItem, ...prev];
        localStorage.setItem('forecastHistory', JSON.stringify(updated));
        return updated;
      });

      // Mark this history run as active
      setActiveHistoryId(newHistoryItem.id);

      // Smooth scroll to results section
      setTimeout(() => {
        const element = document.getElementById('results-section-wrapper');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err: any) {
      console.error('Forecast request failed:', err);
      setError(err.message || 'An unexpected error occurred during prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-run the last submitted forecast inputs
  const handleRetry = () => {
    if (lastSubmittedValues && lastSubmittedRecords) {
      handleGenerateForecast(lastSubmittedValues, lastSubmittedRecords);
    }
  };

  // Load a saved history record
  const handleSelectHistoryItem = (item: ForecastHistoryItem) => {
    setError(null);
    setResults(item.results);
    setActiveHistoryId(item.id);
    setActiveParameters({
      startDate: item.startDate,
      endDate: item.endDate,
      days: item.days,
      discount: item.results[0].discount,
      promotion: item.results[0].promotion,
      epidemic: item.results[0].epidemic,
    });
  };

  // Clear History Book log
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the history log?')) {
      setHistory([]);
      localStorage.removeItem('forecastHistory');
      if (activeHistoryId) {
        setActiveHistoryId(null);
        setResults([]);
        setActiveParameters(null);
      }
    }
  };

  const formatReadableLongDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="app-container">
      {/* Ambient background orbs — purely decorative, no UI impact */}
      <div className="bg-orb-3" aria-hidden="true" />
      <div className="bg-orb-4" aria-hidden="true" />

      {/* 1. Header branding */}
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {/* 2. Page layout */}
      <main className="main-content">
        {/* A. Hero Banner */}
        <Hero isConfigured={isConfigured} isConnected={isConnected} />

        {/* B. Wide Forecast Configuration Form */}
        <ForecastForm
          onSubmit={handleGenerateForecast}
          isLoading={isLoading}
          initialValues={initialValues}
        />

        {/* C. Bottom Section: History (Left) + Results (Right) */}
        <div className="bottom-grid">
          {/* Sidebar Left: Scenario History Log Card */}
          <div className="history-column">
            <ForecastHistory
              history={history}
              onSelect={handleSelectHistoryItem}
              onClear={handleClearHistory}
              activeId={activeHistoryId}
            />
          </div>

          {/* Main Column Right: Visualization Results */}
          <div id="results-section-wrapper" className="results-column" style={resultsColumnStyles}>
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} onRetry={handleRetry} />
            ) : results.length > 0 ? (
              <div style={resultsFlowStyles}>
                {/* Result header details */}
                {activeParameters && (
                  <div className="fade-slide-up" style={resultsHeaderStyles}>
                    <h2 style={resultsTitleStyles}>Demand Forecast Results</h2>
                    <p style={resultsSubtitleStyles}>
                      Generated for {activeParameters.days} day{activeParameters.days > 1 ? 's' : ''} from{' '}
                      <strong>{formatReadableLongDate(activeParameters.startDate)}</strong> to{' '}
                      <strong>{formatReadableLongDate(activeParameters.endDate)}</strong>.
                    </p>
                  </div>
                )}

                {/* Compact Stats Grid */}
                <ForecastSummary results={results} />

                {/* Recharts Trends (Only show for Multi-Day forecasts) */}
                {results.length > 1 && <ForecastChart results={results} theme={theme} />}

                {/* Records Table */}
                <ForecastTable results={results} />
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};

// Styles
const resultsColumnStyles: React.CSSProperties = {
  width: '100%',
  minHeight: '400px',
};

const resultsFlowStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
};

const resultsHeaderStyles: React.CSSProperties = {
  textAlign: 'left',
};

const resultsTitleStyles: React.CSSProperties = {
  fontSize: '1.35rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  marginBottom: '0.25rem',
};

const resultsSubtitleStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4,
};

export default App;

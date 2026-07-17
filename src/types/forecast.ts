export interface ForecastFormValues {
  startDate: string;
  forecastDays: number; // 7, 15, 28, or -1 (for Custom)
  customDays?: number;
  discount: number;
  promotion: 0 | 1;
  epidemic: 0 | 1;
}

export interface ForecastRecord {
  Date: string;
  Discount: number;
  Promotion: 0 | 1;
  Epidemic: 0 | 1;
}

export interface ForecastResult {
  date: string;
  predictedDemand: number;
  lower95: number;
  upper95: number;
  discount: number;
  promotion: 0 | 1;
  epidemic: 0 | 1;
}

export interface ForecastHistoryItem {
  id: string;
  timestamp: string;
  startDate: string;
  endDate: string;
  days: number;
  results: ForecastResult[];
}

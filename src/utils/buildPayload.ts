import type { ForecastFormValues, ForecastRecord } from '../types/forecast';
import { buildForecastDates } from './buildForecastDates';

/**
 * Configurable Databricks Model Serving Payload Builder.
 * EDIT THIS FUNCTION if your MLflow model requires different field names,
 * capitalizations, types, or has a different outer JSON envelope.
 * 
 * @param values User inputs from the forecasting dashboard
 * @param format Wrapper format choice: 'dataframe_records' (default) or 'inputs'
 */
export function buildForecastPayload(
  values: ForecastFormValues,
  format: 'dataframe_records' | 'inputs' = 'dataframe_records'
) {
  // 1. Resolve the actual number of forecast horizon days
  const days = values.forecastDays === -1 
    ? Number(values.customDays || 7) 
    : Number(values.forecastDays);

  // 2. Generate sequential calendar dates (timezone-safe)
  const dates = buildForecastDates(values.startDate, days);

  // 3. Construct individual record objects
  // Ensure types are strictly cast (Databricks serving schema checking is strict):
  // - Date: String (YYYY-MM-DD)
  // - Discount: Floating point number (0.0 to 25.0)
  // - Promotion: Integer (0 or 1)
  // - Epidemic: Integer (0 or 1)
  const records: ForecastRecord[] = dates.map(date => ({
    Date: date,
    Discount: Number(values.discount),
    Promotion: values.promotion,
    Epidemic: values.epidemic,
  }));

  // 4. Return correct wrapper layout.
  // Databricks Model Serving endpoints accept payloads shaped in one of these ways:
  //
  // Format A (dataframe_records):
  // {
  //   "dataframe_records": [
  //     { "Date": "2026-08-01", "Discount": 5.0, "Promotion": 1, "Epidemic": 0 }
  //   ]
  // }
  //
  // Format B (inputs):
  // {
  //   "inputs": [
  //     { "Date": "2026-08-01", "Discount": 5.0, "Promotion": 1, "Epidemic": 0 }
  //   ]
  // }
  if (format === 'inputs') {
    return { inputs: records };
  }

  return { dataframe_records: records };
}
export type DatabricksPayload = ReturnType<typeof buildForecastPayload>;

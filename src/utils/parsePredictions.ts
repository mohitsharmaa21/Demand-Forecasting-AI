import type { ForecastResult, ForecastRecord } from '../types/forecast';

/**
 * Configurable Databricks Serving Response Parser.
 * Maps predictions and confidence intervals (Lower_95 & Upper_95) to dates.
 * 
 * Expected record shape:
 * {
 *   "Date": "2024-01-31",
 *   "Forecast_Demand": 10126.75,
 *   "Lower_95": 9733.70,
 *   "Upper_95": 10519.80
 * }
 */
export function parsePredictions(
  response: any,
  records: ForecastRecord[]
): ForecastResult[] {
  if (!response) {
    throw new Error('Received empty response from the forecasting service.');
  }

  let predictions: any[] = [];

  // Extract predictions array from potential envelopes
  if (Array.isArray(response.predictions)) {
    predictions = response.predictions;
  } else if (response.predictions && Array.isArray(response.predictions.predictions)) {
    predictions = response.predictions.predictions;
  } else if (response.predictions && Array.isArray(response.predictions.dataframe_records)) {
    predictions = response.predictions.dataframe_records;
  } else if (Array.isArray(response.results)) {
    predictions = response.results;
  } else {
    console.error('Unhandled API response payload structure:', response);
    throw new Error('The model serving response could not be parsed. Verify that the output schema matches the expected shape.');
  }

  // Count validation
  if (predictions.length !== records.length) {
    throw new Error(
      `Prediction count mismatch: expected ${records.length} forecasts for your selected duration, but the server returned ${predictions.length}.`
    );
  }

  // Map outputs back to date records with confidence intervals
  return records.map((record, index) => {
    const rawVal = predictions[index];

    let predictedDemand = 0;
    let lower95 = 0;
    let upper95 = 0;

    if (rawVal !== null && typeof rawVal === 'object' && !Array.isArray(rawVal)) {
      // 1. Resolve core forecast demand
      predictedDemand = Number(
        rawVal.Forecast_Demand ?? 
        rawVal.forecast_demand ?? 
        rawVal.prediction ?? 
        rawVal.predictedDemand ?? 
        Object.values(rawVal)[1] ?? 
        Object.values(rawVal)[0]
      );
      
      // 2. Resolve Lower 95% Confidence Interval
      lower95 = Number(
        rawVal.Lower_95 ?? 
        rawVal.lower_95 ?? 
        rawVal.lower ?? 
        rawVal.ci_lower ?? 
        predictedDemand * 0.95 // Fallback variance
      );

      // 3. Resolve Upper 95% Confidence Interval
      upper95 = Number(
        rawVal.Upper_95 ?? 
        rawVal.upper_95 ?? 
        rawVal.upper ?? 
        rawVal.ci_upper ?? 
        predictedDemand * 1.05 // Fallback variance
      );
    } else {
      // If the API returns raw numeric values rather than structured objects
      const num = Number(Array.isArray(rawVal) ? rawVal[0] : rawVal);
      predictedDemand = num;
      lower95 = num * 0.95;
      upper95 = num * 1.05;
    }

    if (isNaN(predictedDemand) || isNaN(lower95) || isNaN(upper95)) {
      throw new Error(`The model serving output at index ${index} contains an invalid numeric forecast.`);
    }

    return {
      date: record.Date,
      predictedDemand,
      lower95,
      upper95,
      discount: record.Discount,
      promotion: record.Promotion,
      epidemic: record.Epidemic,
    };
  });
}

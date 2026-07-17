/**
 * Frontend Service Layer.
 * Communicates with the secure serverless proxy (/api/forecast).
 */
export async function generateForecast(payload: unknown): Promise<any> {
  const response = await fetch('/api/forecast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let responseData;
  try {
    responseData = await response.json();
  } catch (err) {
    throw new Error('The forecasting service returned an unparseable response.');
  }

  if (!response.ok) {
    // Construct a readable, descriptive error message from proxy status
    const errorTitle = responseData.error || `HTTP Error ${response.status}`;
    const errorDetail = responseData.message || 'An unexpected error occurred while processing predictions.';
    
    // Throw error containing status and detail
    throw new Error(`${errorTitle} — ${errorDetail}`);
  }

  return responseData;
}

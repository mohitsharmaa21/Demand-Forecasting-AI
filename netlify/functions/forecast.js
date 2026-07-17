export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const endpointUrl = process.env.DATABRICKS_ENDPOINT_URL;
  const token = process.env.DATABRICKS_TOKEN;

  if (!endpointUrl || !token) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Backend Configuration Error', message: 'DATABRICKS_ENDPOINT_URL or DATABRICKS_TOKEN is missing.' }),
    };
  }

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: event.body,
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ error: 'Bad Gateway', message: text.substring(0, 200) }) };
    }

    const data = await response.json();
    return { statusCode: response.status, headers: { ...corsHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ error: 'Bad Gateway', message: err.message }) };
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Retrieve environment variables
  const endpointUrl = process.env.VITE_DATABRICKS_ENDPOINT_URL || process.env.DATABRICKS_ENDPOINT_URL;
  const token = process.env.VITE_DATABRICKS_TOKEN || process.env.DATABRICKS_TOKEN;

  if (!endpointUrl || !token) {
    return res.status(500).json({
      error: 'Backend Configuration Error',
      message: 'Databricks Serving Endpoint URL or Token is missing from the environment.'
    });
  }

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Invalid response format from Databricks: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Databricks Serving Error: ${response.status}`,
        message: data.message || 'The Databricks model serving endpoint returned a failing status.'
      });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(502).json({
      error: 'Bad Gateway',
      message: error.message || 'Failed to communicate with the Databricks serving endpoint.'
    });
  }
}

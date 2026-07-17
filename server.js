import http from 'http';
import fs from 'fs';

// Simple manual .env parser to avoid npm dependencies
function loadEnv() {
  const envPath = '.env';
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.substring(0, index).trim();
      let value = trimmed.substring(index + 1).trim();
      
      // Strip outer quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
    console.log('Loaded local configuration from .env successfully.');
  } else {
    console.warn('.env file not found. Ensure environment variables are set.');
  }
}

loadEnv();

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  // CORS Headers for API accessibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/forecast') {
    let bodyStr = '';
    req.on('data', chunk => {
      bodyStr += chunk;
    });

    req.on('end', async () => {
      const endpointUrl = process.env.VITE_DATABRICKS_ENDPOINT_URL || process.env.DATABRICKS_ENDPOINT_URL;
      const token = process.env.VITE_DATABRICKS_TOKEN || process.env.DATABRICKS_TOKEN;

      if (!endpointUrl || !token) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Backend Configuration Error',
          message: 'Databricks serving endpoint URL or Token is missing from the environment. Check your .env file.'
        }));
        return;
      }

      try {
        console.log(`Forwarding request to Databricks: ${endpointUrl}`);
        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: bodyStr
        });

        const contentType = response.headers.get('content-type');
        let responseData;
        
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('DATABRICKS RESPONSE:', JSON.stringify(responseData, null, 2));
        } else {
          const text = await response.text();
          throw new Error(`Invalid response format from Databricks: ${text.substring(0, 100)}`);
        }

        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData));
      } catch (error) {
        console.error('Error during Databricks API request:', error);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Bad Gateway',
          message: error.message || 'Failed to communicate with the Databricks Serving endpoint.'
        }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Local secure proxy running on http://localhost:${PORT}`);
});

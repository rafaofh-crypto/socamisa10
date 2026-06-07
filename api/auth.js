const fetch = require('node-fetch');

const AUTH_URL = 'https://login.globo.com/api/authentication';
const GLB_ID_URL = 'https://login.globo.com/api/v1/identification';

async function authenticateCartola() {
  const email = process.env.CARTOLA_EMAIL;
  const password = process.env.CARTOLA_PASSWORD;

  if (!email || !password) {
    return { success: false, error: 'Missing credentials in environment variables' };
  }

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Referer': 'https://login.globo.com/'
  };

  try {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        payload: {
          email,
          password,
          serviceId: 4728
        }
      })
    });

    const data = await response.json();

    if (data.status === 'OK' && data.glbId) {
      return { success: true, token: data.glbId };
    } else {
      return { success: false, error: data.error || 'Authentication failed' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function authenticatedRequest(url, token, options = {}) {
  const headers = {
    ...options.headers,
    'X-GLB-Token': token,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  };

  const response = await fetch(url, { ...options, headers });
  return await response.json();
}

module.exports = { authenticateCartola, authenticatedRequest };

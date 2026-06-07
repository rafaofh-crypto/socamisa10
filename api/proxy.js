const fetch = require('node-fetch');
const { authenticateCartola, authenticatedRequest } = require('./auth.js');

let cachedToken = null;
let tokenExpiry = 0;

async function getValidToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }
  const token = await authenticateCartola();
  cachedToken = token;
  tokenExpiry = now + 3600000;
  return token;
}

async function fetchWithRetry(url, options, retries = 3, backoff = 1000) {
  try {
    const response = await fetch(url, options);
    if (response.status === 401) throw new Error('401');
    if (response.status === 404) throw new Error('404');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    if (retries > 0) {
      console.error(`Retry attempt left: ${retries}, error: ${err.message}`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
}

module.exports = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Missing id parameter' });
  }

  try {
    const token = await getValidToken();
    const url = `https://api.cartola.globo.com/time/slug/${id}`;
    const data = await fetchWithRetry(url, {
      headers: { 'X-GLB-Token': token }
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Proxy Error:', err.message);
    const status = err.message === '404' ? 404 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

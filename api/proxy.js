const express = require('express');
const axios = require('axios');
const app = express();

const CARTOLA_API_BASE = 'https://api.cartola.globo.com';

app.get('/api/liga/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const response = await axios.get(`${CARTOLA_API_BASE}/auth/liga/${slug}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (!response.data) {
      throw new Error('Empty response from Cartola API');
    }

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching league ${slug}:`, error.message);

    const status = error.response ? error.response.status : 500;
    const message = error.response && error.response.data 
      ? error.response.data 
      : 'Failed to fetch league data. Please check the slug or try again later.';

    res.status(status).json({ error: message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

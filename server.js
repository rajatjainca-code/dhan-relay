const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const DHAN_API_ORDERS_URL = 'https://api.dhan.co/v2/orders';
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ status: 'ACTIVE', service: 'DhanHQ Static IP Relay Gateway' });
});

app.post('/v2/orders', async (req, res) => {
  try {
    const accessToken = req.headers['access-token'];
    const clientId = req.headers['client-id'];

    if (!accessToken || !clientId) {
      return res.status(401).json({ error: 'Missing access-token or client-id header' });
    }

    const response = await axios.post(DHAN_API_ORDERS_URL, req.body, {
      headers: {
        'access-token': accessToken,
        'client-id': clientId,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`DhanHQ Static IP Relay running on port ${PORT}`);
});

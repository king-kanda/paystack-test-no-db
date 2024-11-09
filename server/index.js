const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json()); // Parse JSON bodies

app.post('/initialize-transaction', (req, res) => {
  const { email, amount } = req.body;

  const params = JSON.stringify({
    email,
    amount
  });

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: 'Bearer 79c17a3db1c1',
      'Content-Type': 'application/json'
    }
  };

  const request = https.request(options, response => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        res.json(parsedData); // Send the Paystack response to the frontend
      } catch (error) {
        res.status(500).json({ error: 'Error parsing response' });
      }
    });
  });

  request.on('error', error => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.write(params);
  request.end();
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


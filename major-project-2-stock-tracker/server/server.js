import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Internal and External URLs
const STOCK_API = 'https://api.twelvedata.com';
const FRONTEND = 'https://fullstack-stocktracker.vercel.app';
const LOCAL = 'http://127.0.0.1:5500';

// CORS first
app.use(
  cors({
    origin: [FRONTEND, LOCAL],
  })
);

// Optional: JSON parsing; GET requests don’t have bodies, needed for POST, PUT, PATCH
app.use(express.json());

// Routes
// Quote by symbol
app.get('/api/stock/quote', async (req, res) => {
  const symbol = req.query.symbol;
  const response = await fetch(
    `${STOCK_API}/quote?symbol=${symbol}&apikey=${API_KEY}`
  );
  const data = await response.json();
  res.json(data);
});

// Search by name
app.get('/api/stock/search', async (req, res) => {
  const name = req.query.name;
  const response = await fetch(
    `${STOCK_API}/stocks?name=${name}&apikey=${API_KEY}`
  );
  const data = await response.json();
  res.json(data);
});

// Test route
app.get('/', (req, res) => {
  res.send('<h1>Backend is running</h1>');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

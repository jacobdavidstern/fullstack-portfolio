const cors = require('cors');

const allowedOrigins = [
  'https://ticketfire.vercel.app',
  'http://localhost:5173',
];

module.exports = cors({
  origin: allowedOrigins,
  credentials: true,
});

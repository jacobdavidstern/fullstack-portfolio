require('dotenv').config();

const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const connectDB = require('./db/connectDB');

const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT;

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});
app.use('/api/auth', authLimiter);

// Public / Root Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Feature routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Not Found (catch‑all)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// MongoDB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

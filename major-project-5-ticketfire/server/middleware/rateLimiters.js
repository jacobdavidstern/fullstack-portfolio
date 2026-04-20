const rateLimit = require('express-rate-limit');

// Global limiter for all /api routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 256,
  message: 'Too many requests, please try again later.',
});

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 64,
  message: 'Too many auth attempts, please try again later.',
});

// Strict limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 32,
  message: {
    message: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Export all limiters
module.exports = {
  apiLimiter,
  authLimiter,
  loginLimiter,
};

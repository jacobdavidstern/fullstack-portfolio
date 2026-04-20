const express = require('express');
const router = express.Router();

const { registerClient, registerUser, login } = require('../controllers/authController'); // prettier-ignore
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authorizeRole');

// Route registry must be invoked at definition time to capture Express 5 routes
const { register } = require('../routeRegistry');

// Public onboarding
router.post(
  '/register-client',
  // Register route for centralized tracking/inspection
  register('POST', '/register-client', '/api/auth'),
  registerClient
);

// Client owner creates users
router.post(
  '/:clientId/users',
  // Register route for centralized tracking/inspection
  register('POST', '/:clientId/users', '/api/auth'),
  protect,
  authorizeRole('owner'),
  registerUser
);

// Login (rate limited globally)
router.post(
  '/login',
  // Register route for centralized tracking/inspection
  register('POST', '/login', '/api/auth'),
  // loginLimiter, // handled at server level
  login
);

module.exports = router;

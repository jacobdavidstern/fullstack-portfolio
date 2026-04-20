const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const { protect, authorizeRole } = require('../middleware/authMiddleware');

// Route registry must be invoked at definition time to capture Express 5 routes
const { register } = require('../routeRegistry');

// Register route for centralized tracking/inspection
register('POST', '/:clientId/users', '/api');

router.post('/:clientId/users', protect, authorizeRole('owner'), createUser);

module.exports = router;

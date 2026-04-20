const express = require('express');
const router = express.Router();

const {
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
} = require('../controllers/eventController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authorizeRole');

// Route registry must be invoked at definition time to capture Express 5 routes
const { register } = require('../routeRegistry');

// Get all events for a client (slug-based)
router.get(
  '/:slug/events',
  protect,
  authorizeRole('staff', 'official', 'owner'),
  // Register route for centralized tracking/inspection
  register('GET', '/:slug/events', '/api'),
  getEvents
);

// Get a single event by eventNumber
router.get(
  '/:slug/events/:eventNumber',
  protect,
  authorizeRole('staff', 'official', 'owner'),
  // Register route for centralized tracking/inspection
  register('GET', '/:slug/events/:eventNumber', '/api'),
  getEvent
);

// Create new event
router.post(
  '/:slug/events',
  protect,
  authorizeRole('official', 'owner'),
  register('POST', '/:slug/events', '/api'),
  createEvent
);

// Update event (edit + publish/unpublish)
router.patch(
  '/:slug/events/:eventNumber',
  protect,
  authorizeRole('official', 'owner'),
  // Register route for centralized tracking/inspection
  register('PATCH', '/:slug/events/:eventNumber', '/api'),
  updateEvent
);

module.exports = router;

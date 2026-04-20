const express = require('express');
const router = express.Router();
const { createVenues } = require('../controllers/venueController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authorizeRole');
const Client = require('../models/Client');
const Venue = require('../models/Venue');

// Route registry must be invoked at definition time to capture Express 5 routes
const { register } = require('../routeRegistry');

// GET /api/:slug/venues
router.get(
  '/:slug/venues',
  // Register route for centralized tracking/inspection
  register('GET', '/:slug/venues', '/api'),
  protect,
  authorizeRole('staff', 'official', 'owner'),
  async (req, res) => {
    try {
      const client = await Client.findOne({ slug: req.params.slug });
      if (!client) return res.status(404).json({ message: 'Client not found' });

      const venues = await Venue.find({ client: client._id });
      res.json(venues);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to fetch venues',
        error: err.message,
      });
    }
  }
);

// POST /api/:slug/venues
router.post(
  '/:slug/venues',
  // Register route for centralized tracking/inspection
  register('POST', '/:slug/venues', '/api'),
  protect,
  authorizeRole('owner', 'official'),
  async (req, res) => {
    try {
      const client = await Client.findOne({ slug: req.params.slug });
      if (!client) return res.status(404).json({ message: 'Client not found' });

      // Inject client ID into the body so controller can use it
      req.body.client = client._id;

      await createVenues(req, res);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to create venues',
        error: err.message,
      });
    }
  }
);

module.exports = router;

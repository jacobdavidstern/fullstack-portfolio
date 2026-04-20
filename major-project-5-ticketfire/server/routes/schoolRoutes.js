const express = require('express');
const router = express.Router();
const { createSchools } = require('../controllers/schoolController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authorizeRole');
const Client = require('../models/Client');
const School = require('../models/School');

// Route registry must be invoked at definition time to capture Express 5 routes
const { register } = require('../routeRegistry');

// GET /api/:slug/schools
router.get(
  '/:slug/schools',
  // Register route for centralized tracking/inspection
  register('GET', '/:slug/schools', '/api'),
  protect,
  authorizeRole('staff', 'official', 'owner'),
  async (req, res) => {
    try {
      const client = await Client.findOne({ slug: req.params.slug });
      if (!client) return res.status(404).json({ message: 'Client not found' });

      const schools = await School.find({ client: client._id });
      res.json(schools);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to fetch schools',
        error: err.message,
      });
    }
  }
);

// POST /api/:clientId/schools
router.post(
  '/:slug/schools',
  // Register route for centralized tracking/inspection
  register('POST', '/:slug/schools', '/api'),
  protect,
  authorizeRole('owner', 'official'),
  async (req, res) => {
    try {
      const client = await Client.findOne({ slug: req.params.slug });
      if (!client) return res.status(404).json({ message: 'Client not found' });

      // Inject client ID into the body so controller can use it
      req.body.client = client._id;

      await createSchools(req, res);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to create schools',
        error: err.message,
      });
    }
  }
);

module.exports = router;

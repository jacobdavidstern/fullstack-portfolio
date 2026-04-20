const express = require('express');
const router = express.Router();
const { createDepartments } = require('../controllers/departmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authorizeRole');
const Client = require('../models/Client');
const Department = require('../models/Department');

// Route registry must be invoked at definition time to capture Express 5 routes
const { register } = require('../routeRegistry');

// GET /api/:slug/departments
router.get(
  '/:slug/departments',
  // Register route for centralized tracking/inspection
  register('GET', '/:slug/departments', '/api'),
  protect,
  authorizeRole('staff', 'official', 'owner'),
  async (req, res) => {
    try {
      const client = await Client.findOne({ slug: req.params.slug });
      if (!client) return res.status(404).json({ message: 'Client not found' });

      const departments = await Department.find({ client: client._id });
      res.json(departments);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to fetch departments',
        error: err.message,
      });
    }
  }
);

// POST /api/:slug/departments
router.post(
  '/:slug/departments',
  // Register route for centralized tracking/inspection
  register('POST', '/:slug/departments', '/api'),
  protect,
  authorizeRole('owner', 'official'),
  async (req, res) => {
    try {
      const client = await Client.findOne({ slug: req.params.slug });
      if (!client) return res.status(404).json({ message: 'Client not found' });

      // Inject client ID into the body so controller can use it
      req.body.client = client._id;

      await createDepartments(req, res);
    } catch (err) {
      res.status(500).json({
        message: 'Failed to create departments',
        error: err.message,
      });
    }
  }
);

module.exports = router;

const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// GET /api/:slug
router.get('/:slug', async (req, res) => {
  try {
    const client = await Client.findOne({ slug: req.params.slug });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch client',
      error: err.message,
    });
  }
});

module.exports = router;

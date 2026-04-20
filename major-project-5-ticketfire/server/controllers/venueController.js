const mongoose = require('mongoose');
const Venue = require('../models/Venue');

const createVenues = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { venues } = req.body;

    const docs = venues.map((v) => ({
      name: v.name,
      slug: v.slug,
      capacity: v.capacity,
      client: new mongoose.Types.ObjectId(clientId),
    }));

    const created = await Venue.create(docs);

    res.status(201).json(created);
  } catch (err) {
    console.error('CREATE VENUES ERROR:', err);
    res.status(400).json({ message: 'Failed to create venues' });
  }
};

module.exports = { createVenues };

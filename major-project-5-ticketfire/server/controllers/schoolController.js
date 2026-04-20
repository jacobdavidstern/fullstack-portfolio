const mongoose = require('mongoose');
const School = require('../models/School');

const createSchools = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { schools } = req.body;

    const docs = schools.map((s) => ({
      name: s.name,
      slug: s.slug,
      client: new mongoose.Types.ObjectId(clientId),
    }));

    const created = await School.create(docs);

    res.status(201).json(created);
  } catch (err) {
    console.error('CREATE SCHOOLS ERROR:', err);
    res.status(400).json({ message: 'Failed to create schools' });
  }
};

module.exports = { createSchools };

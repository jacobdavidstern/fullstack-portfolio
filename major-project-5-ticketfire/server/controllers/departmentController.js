const mongoose = require('mongoose');
const Department = require('../models/Department');

const createDepartments = async (req, res) => {
  const { clientId } = req.params;
  const { departments } = req.body;

  const docs = departments.map((d) => ({
    // prettier-ignore
    name: (d).name,
    // prettier-ignore
    slug: (d).slug,
    client: new mongoose.Types.ObjectId(clientId),
  }));

  const created = await Department.create(docs);

  res.status(201).json(created);
};

module.exports = { createDepartments };

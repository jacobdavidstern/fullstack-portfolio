const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema(
  {
    // Fields object, document fields in MongoDB
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 },
  },
  {
    // Schema options object, defines behavior, Mongoose
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = mongoose.model('Counter', counterSchema);

const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    // Fields object, document fields in MongoDB
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    clientNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    eventCounter: {
      type: Number,
      default: 0,
    },
  },
  {
    // Schema options object, defines behavior, Mongoose
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = mongoose.model('Client', clientSchema);

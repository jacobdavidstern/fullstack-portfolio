const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    // Fields object, document fields in MongoDB
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
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

// Prevent duplicate departments per client
departmentSchema.index({ client: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Department', departmentSchema);

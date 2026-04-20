const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    // Fields object, document fields in MongoDB
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
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

schoolSchema.index({ client: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('School', schoolSchema);

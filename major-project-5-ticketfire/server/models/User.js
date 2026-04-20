const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Fields object, document fields in MongoDB
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false, // prevent accidental exposure
    },
    role: {
      type: String,
      enum: ['staff', 'official', 'owner'],
      default: 'official',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: function () {
        return !this.isPlatformAdmin;
      },
    },
    isPlatformAdmin: {
      type: Boolean,
      default: false,
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

// Global response sanitizer
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);

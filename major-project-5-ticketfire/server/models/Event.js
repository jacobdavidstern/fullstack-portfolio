const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    // Fields object, document fields in MongoDB
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },
    event_number: {
      type: Number,
      required: true,
    },
    event_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    start_at: {
      type: Date,
      required: true,
    },
    end_at: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v || !this.start_at) return true;
          return v > this.start_at;
        },
        message: 'end_at must be after start_at',
      },
    },
    doors_open_before: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
      validate: {
        validator: function (v) {
          return v % 5 === 0;
        },
        message: 'doors_open_before must be multiple of 5',
      },
    },
    total_tickets: {
      type: Number,
      required: true,
      min: 1,
    },
    tickets_sold: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (v) {
          return v <= this.total_tickets;
        },
        message: 'tickets_sold cannot exceed total_tickets',
      },
    },
    published: {
      type: Boolean,
      default: true,
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

// Unique Index (Tenant-Safe, Event numbers can repeat across tenants, but not within)
eventSchema.index({ client: 1, event_number: 1 }, { unique: true });

module.exports = mongoose.model('Event', eventSchema);

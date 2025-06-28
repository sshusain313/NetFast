const mongoose = require('mongoose');

const spiritualSponsorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  relationship: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notification_preferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    violations: {
      type: Boolean,
      default: true
    },
    progress_reports: {
      type: Boolean,
      default: true
    }
  },
  last_contact: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
spiritualSponsorSchema.index({ user_id: 1, isActive: 1 });
spiritualSponsorSchema.index({ email: 1 });

module.exports = mongoose.model('SpiritualSponsor', spiritualSponsorSchema); 
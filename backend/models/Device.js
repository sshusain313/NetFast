const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  device_token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['windows', 'mac', 'linux', 'electron']
  },
  hostname: {
    type: String,
    default: ''
  },
  last_heartbeat: {
    type: Date,
    default: Date.now
  },
  dns_status: {
    is_filtered: {
      type: Boolean,
      default: false
    },
    provider: {
      type: String,
      default: ''
    },
    last_checked: {
      type: Date,
      default: Date.now
    }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
deviceSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Index for efficient queries
deviceSchema.index({ user_id: 1 });

module.exports = mongoose.model('Device', deviceSchema); 
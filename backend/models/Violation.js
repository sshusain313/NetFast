const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  device_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'dns_bypass_attempt',
      'proxy_usage',
      'vpn_usage',
      'hosts_file_modification',
      'dns_settings_change',
      'app_uninstall_attempt',
      'admin_privileges_bypass'
    ]
  },
  details: {
    type: String,
    required: true,
    trim: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolved_at: Date,
  resolved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    ip_address: String,
    user_agent: String,
    location: String,
    browser: String,
    os: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
violationSchema.index({ user_id: 1, created_at: -1 });
violationSchema.index({ device_id: 1, created_at: -1 });
violationSchema.index({ type: 1, created_at: -1 });
violationSchema.index({ resolved: 1 });

// Virtual for time since violation
violationSchema.virtual('timeSinceViolation').get(function() {
  return Date.now() - this.created_at.getTime();
});

module.exports = mongoose.model('Violation', violationSchema); 
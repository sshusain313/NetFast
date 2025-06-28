const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  tier: {
    type: String,
    required: true,
    enum: ['Digital Monk', 'Digital Master', 'Digital Sage', 'Free']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'cancelled', 'expired'],
    default: 'active'
  },
  expires_at: {
    type: Date,
    required: true
  },
  payment_method: {
    type: String,
    default: ''
  },
  stripe_customer_id: {
    type: String,
    default: ''
  },
  stripe_subscription_id: {
    type: String,
    default: ''
  },
  auto_renew: {
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
subscriptionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Virtual for checking if subscription is expired
subscriptionSchema.virtual('is_expired').get(function() {
  return this.expires_at < new Date();
});

// Virtual for checking if subscription is active
subscriptionSchema.virtual('is_active').get(function() {
  return this.status === 'active' && !this.is_expired;
});

// Index for efficient queries
subscriptionSchema.index({ user_id: 1 }, { unique: true });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ expires_at: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema); 
const mongoose = require('mongoose');

const progressReportSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  days_completed: {
    type: Number,
    required: true,
    min: 0
  },
  total_days: {
    type: Number,
    required: true,
    min: 1
  },
  violation_count: {
    type: Number,
    default: 0,
    min: 0
  },
  strength_moments: [{
    type: String,
    trim: true
  }],
  challenges_faced: [{
    type: String,
    trim: true
  }],
  spiritual_growth: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  mood_rating: {
    type: Number,
    min: 1,
    max: 10
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  milestone_achieved: {
    type: String,
    enum: [
      'first_day',
      'first_week',
      'first_month',
      'three_months',
      'six_months',
      'one_year',
      'custom'
    ]
  },
  is_public: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
progressReportSchema.index({ user_id: 1, created_at: -1 });
progressReportSchema.index({ milestone_achieved: 1 });
progressReportSchema.index({ days_completed: 1 });

// Virtual for progress percentage
progressReportSchema.virtual('progressPercentage').get(function() {
  return Math.round((this.days_completed / this.total_days) * 100);
});

// Virtual for days remaining
progressReportSchema.virtual('daysRemaining').get(function() {
  return Math.max(0, this.total_days - this.days_completed);
});

// Method to check if milestone is achieved
progressReportSchema.methods.checkMilestone = function() {
  const milestones = {
    1: 'first_day',
    7: 'first_week',
    30: 'first_month',
    90: 'three_months',
    180: 'six_months',
    365: 'one_year'
  };
  
  for (const [days, milestone] of Object.entries(milestones)) {
    if (this.days_completed >= parseInt(days) && this.milestone_achieved !== milestone) {
      this.milestone_achieved = milestone;
      return milestone;
    }
  }
  
  return null;
};

module.exports = mongoose.model('ProgressReport', progressReportSchema); 
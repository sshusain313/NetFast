const express = require('express');
const { body } = require('express-validator');
const ProgressReport = require('../models/ProgressReport');
const validate = require('../middleware/validate');

const router = express.Router();

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const reports = await ProgressReport.find({ user_id: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: reports.map(report => ({
        id: report._id,
        user_id: report.user_id,
        days_completed: report.days_completed,
        violation_count: report.violation_count,
        created_at: report.createdAt
      }))
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get reports'
    });
  }
});

// POST /api/reports
router.post('/', [
  body('days_completed').isInt({ min: 0 }).withMessage('Days completed must be a positive number'),
  body('violation_count').isInt({ min: 0 }).withMessage('Violation count must be a positive number')
], validate, async (req, res) => {
  try {
    const { days_completed, violation_count } = req.body;

    const report = new ProgressReport({
      user_id: req.userId,
      days_completed,
      total_days: 40, // Default to 40 days
      violation_count
    });

    // Check for milestone
    const milestone = report.checkMilestone();
    if (milestone) {
      // Send WebSocket notification for milestone
      if (global.sendToUser) {
        global.sendToUser(req.userId, {
          type: 'progress_update',
          data: {
            milestone,
            days_completed,
            achievement: `Achieved ${milestone.replace('_', ' ')} milestone!`
          },
          timestamp: new Date().toISOString()
        });
      }
    }

    await report.save();

    res.status(201).json({
      success: true,
      data: {
        id: report._id,
        user_id: report.user_id,
        days_completed: report.days_completed,
        violation_count: report.violation_count,
        created_at: report.createdAt
      }
    });

  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create report'
    });
  }
});

module.exports = router; 
const express = require('express');
const { body } = require('express-validator');
const Violation = require('../models/Violation');
const Device = require('../models/Device');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/violations
router.post('/', [
  body('device_id').notEmpty().withMessage('Device ID is required'),
  body('type').isIn([
    'dns_bypass_attempt',
    'proxy_usage',
    'vpn_usage',
    'hosts_file_modification',
    'dns_settings_change',
    'app_uninstall_attempt',
    'admin_privileges_bypass'
  ]).withMessage('Invalid violation type'),
  body('details').notEmpty().withMessage('Details are required')
], validate, async (req, res) => {
  try {
    const { device_id, type, details } = req.body;

    // Verify device belongs to user
    const device = await Device.findOne({ _id: device_id, user_id: req.userId });
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    const violation = new Violation({
      device_id,
      user_id: req.userId,
      type,
      details,
      metadata: {
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      }
    });

    await violation.save();

    // Send WebSocket notification
    if (global.sendToUser) {
      global.sendToUser(req.userId, {
        type: 'violation',
        data: {
          device_id,
          violation_type: type,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(201).json({
      success: true,
      data: {
        id: violation._id,
        device_id: violation.device_id,
        type: violation.type,
        timestamp: violation.createdAt,
        details: violation.details
      }
    });

  } catch (error) {
    console.error('Create violation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create violation'
    });
  }
});

// GET /api/violations
router.get('/', async (req, res) => {
  try {
    const violations = await Violation.find({ user_id: req.userId })
      .populate('device_id', 'platform hostname')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: violations.map(violation => ({
        id: violation._id,
        device_id: violation.device_id,
        type: violation.type,
        timestamp: violation.createdAt,
        details: violation.details,
        severity: violation.severity,
        resolved: violation.resolved
      }))
    });

  } catch (error) {
    console.error('Get violations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get violations'
    });
  }
});

module.exports = router; 
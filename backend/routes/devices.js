const express = require('express');
const { body } = require('express-validator');
const Device = require('../models/Device');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/devices - Register device
router.post('/', [
  body('device_token').notEmpty().withMessage('Device token is required'),
  body('platform').isIn(['win32', 'darwin', 'linux', 'unknown']).withMessage('Invalid platform')
], validate, async (req, res) => {
  try {
    const { device_token, platform } = req.body;
    const hostname = req.headers['x-hostname'] || 'unknown';

    // Check if device already exists
    const existingDevice = await Device.findOne({ device_token });
    if (existingDevice) {
      return res.status(400).json({
        success: false,
        error: 'Device already registered'
      });
    }

    // Create device
    const device = new Device({
      user_id: req.userId,
      device_token,
      platform,
      hostname,
      last_heartbeat: new Date(),
      dns_status: false
    });

    await device.save();

    res.status(201).json({
      success: true,
      data: {
        id: device._id,
        user_id: device.user_id,
        device_token: device.device_token,
        last_heartbeat: device.last_heartbeat,
        dns_status: device.dns_status,
        platform: device.platform,
        created_at: device.createdAt
      }
    });

  } catch (error) {
    console.error('Device registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Device registration failed'
    });
  }
});

// GET /api/devices - Get user devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find({ user_id: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: devices.map(device => ({
        id: device._id,
        user_id: device.user_id,
        device_token: device.device_token,
        last_heartbeat: device.last_heartbeat,
        dns_status: device.dns_status,
        platform: device.platform,
        created_at: device.createdAt
      }))
    });

  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get devices'
    });
  }
});

// POST /api/devices/:id/heartbeat - Send heartbeat
router.post('/:id/heartbeat', [
  body('dns_status').isBoolean().withMessage('DNS status must be boolean')
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    const { dns_status } = req.body;

    const device = await Device.findOne({ _id: id, user_id: req.userId });
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    device.last_heartbeat = new Date();
    device.dns_status = dns_status;
    await device.save();

    res.json({
      success: true,
      message: 'Heartbeat received'
    });

  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({
      success: false,
      error: 'Heartbeat failed'
    });
  }
});

module.exports = router; 
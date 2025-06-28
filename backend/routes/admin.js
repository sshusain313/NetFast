const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/User');
const Device = require('../models/Device');
const Subscription = require('../models/Subscription');
const Violation = require('../models/Violation');
const ProgressReport = require('../models/ProgressReport');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// Admin middleware - check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Get admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const devicesOnline = await Device.countDocuments({ status: 'online' });
    const violationsToday = await Violation.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    // Calculate revenue (mock calculation)
    const subscriptions = await Subscription.find({ status: 'active' });
    const revenue = subscriptions.reduce((total, sub) => {
      const amounts = { 'Digital Seeker': 19, 'Spiritual Practitioner': 39, 'Digital Master': 79 };
      return total + (amounts[sub.tier] || 0);
    }, 0);

    res.json({
      totalUsers,
      activeSubscriptions,
      devicesOnline,
      violationsToday,
      revenue,
      systemHealth: 98.5 // Mock system health
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
  }
});

// Get all users with pagination and search
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('subscription')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    // Get additional user stats
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const devices = await Device.countDocuments({ userId: user._id });
      const violations = await Violation.countDocuments({ userId: user._id });
      const lastSeen = await Device.findOne({ userId: user._id })
        .sort({ lastHeartbeat: -1 })
        .select('lastHeartbeat');

      return {
        ...user.toObject(),
        devices,
        violations,
        lastSeen: lastSeen?.lastHeartbeat || null
      };
    }));

    res.json({
      users: usersWithStats,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user details
router.get('/users/:userId', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('subscription');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const devices = await Device.find({ userId: user._id });
    const violations = await Violation.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);
    const reports = await ProgressReport.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5);

    res.json({
      user,
      devices,
      violations,
      reports
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
});

// Update user status (suspend/activate)
router.patch('/users/:userId/status', adminAuth, [
  body('status')
    .isIn(['active', 'suspended'])
    .withMessage('Status must be either active or suspended')
], validate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: req.body.status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
});

// Get all devices
router.get('/devices', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const devices = await Device.find(query)
      .populate('userId', 'email name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ lastHeartbeat: -1 });

    const total = await Device.countDocuments(query);

    res.json({
      devices,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
});

// Force device sync
router.post('/devices/:deviceId/sync', adminAuth, async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // In a real implementation, this would trigger a sync command to the device
    device.lastSyncRequest = new Date();
    await device.save();

    res.json({ message: 'Sync request sent to device', device });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting device sync', error: error.message });
  }
});

// Disconnect device
router.post('/devices/:deviceId/disconnect', adminAuth, async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.deviceId,
      { status: 'offline', disconnectedAt: new Date() },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json({ message: 'Device disconnected', device });
  } catch (error) {
    res.status(500).json({ message: 'Error disconnecting device', error: error.message });
  }
});

// Get all subscriptions
router.get('/subscriptions', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const subscriptions = await Subscription.find(query)
      .populate('userId', 'email name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Subscription.countDocuments(query);

    // Calculate revenue stats
    const revenueStats = await Subscription.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          monthlyRecurring: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      subscriptions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      revenueStats: revenueStats[0] || { totalRevenue: 0, monthlyRecurring: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
});

// Get violations with filtering
router.get('/violations', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, severity, timeFilter = 'today' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (severity) {
      query.severity = severity;
    }

    // Time filtering
    const now = new Date();
    switch (timeFilter) {
      case 'today':
        query.createdAt = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: weekAgo };
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: monthAgo };
        break;
    }

    const violations = await Violation.find(query)
      .populate('userId', 'email name')
      .populate('deviceId', 'deviceName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Violation.countDocuments(query);

    // Get violation stats
    const stats = await Violation.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          blocked: { $sum: { $cond: ['$blocked', 1, 0] } },
          highSeverity: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      violations,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      stats: stats[0] || { total: 0, blocked: 0, highSeverity: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching violations', error: error.message });
  }
});

// Get analytics data
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // User growth data
    const userGrowth = await User.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Violation trends
    const violationTrends = await Violation.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Subscription distribution
    const subscriptionDistribution = await Subscription.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$tier',
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue data
    const revenueData = await Subscription.aggregate([
      {
        $match: { 
          status: 'active',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      userGrowth,
      violationTrends,
      subscriptionDistribution,
      revenueData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

// Get system settings
router.get('/settings', adminAuth, async (req, res) => {
  try {
    // In a real implementation, these would come from a settings collection
    const settings = {
      autoBlock: true,
      emailNotifications: true,
      systemMaintenance: false,
      debugMode: false,
      apiRateLimit: true,
      backupEnabled: true
    };

    const systemInfo = {
      version: '2.1.4',
      uptime: '15 days, 8 hours',
      lastBackup: new Date().toISOString(),
      dbSize: '2.4 GB',
      apiCalls: '1,247,892',
      errorRate: '0.02%'
    };

    res.json({ settings, systemInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Update system settings
router.patch('/settings', adminAuth, [
  body('settings')
    .isObject()
    .withMessage('Settings must be an object')
], validate, async (req, res) => {
  try {
    // In a real implementation, this would update a settings collection
    const { settings } = req.body;
    
    // Here you would save settings to database
    // await Settings.findOneAndUpdate({}, settings, { upsert: true });

    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

module.exports = router; 
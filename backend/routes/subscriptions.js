const express = require('express');
const Subscription = require('../models/Subscription');

const router = express.Router();

// GET /api/subscriptions/current
router.get('/current', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user_id: req.userId })
      .sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'No subscription found'
      });
    }

    res.json({
      success: true,
      data: {
        id: subscription._id,
        user_id: subscription.user_id,
        tier: subscription.tier,
        expires_at: subscription.expires_at,
        status: subscription.status,
        created_at: subscription.createdAt
      }
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription'
    });
  }
});

// PUT /api/subscriptions
router.put('/', async (req, res) => {
  try {
    const { tier } = req.body;

    let subscription = await Subscription.findOne({ user_id: req.userId });
    
    if (!subscription) {
      // Create new subscription
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      subscription = new Subscription({
        user_id: req.userId,
        tier,
        expires_at: expiresAt,
        status: 'active'
      });
    } else {
      // Update existing subscription
      subscription.tier = tier;
      subscription.status = 'active';
    }

    await subscription.save();

    res.json({
      success: true,
      data: {
        id: subscription._id,
        user_id: subscription.user_id,
        tier: subscription.tier,
        expires_at: subscription.expires_at,
        status: subscription.status,
        created_at: subscription.createdAt
      }
    });

  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription'
    });
  }
});

module.exports = router; 
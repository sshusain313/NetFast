const express = require('express');
const { body } = require('express-validator');
const SpiritualSponsor = require('../models/SpiritualSponsor');
const validate = require('../middleware/validate');

const router = express.Router();

// GET /api/sponsors
router.get('/', async (req, res) => {
  try {
    const sponsors = await SpiritualSponsor.find({ user_id: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: sponsors.map(sponsor => ({
        id: sponsor._id,
        user_id: sponsor.user_id,
        name: sponsor.name,
        email: sponsor.email,
        phone: sponsor.phone,
        relationship: sponsor.relationship,
        isActive: sponsor.isActive,
        created_at: sponsor.createdAt
      }))
    });

  } catch (error) {
    console.error('Get sponsors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sponsors'
    });
  }
});

// POST /api/sponsors
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('relationship').notEmpty().withMessage('Relationship is required')
], validate, async (req, res) => {
  try {
    const { name, email, phone, relationship } = req.body;

    const sponsor = new SpiritualSponsor({
      user_id: req.userId,
      name,
      email,
      phone,
      relationship,
      isActive: true
    });

    await sponsor.save();

    res.status(201).json({
      success: true,
      data: {
        id: sponsor._id,
        user_id: sponsor.user_id,
        name: sponsor.name,
        email: sponsor.email,
        phone: sponsor.phone,
        relationship: sponsor.relationship,
        isActive: sponsor.isActive,
        created_at: sponsor.createdAt
      }
    });

  } catch (error) {
    console.error('Create sponsor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create sponsor'
    });
  }
});

// PUT /api/sponsors/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const sponsor = await SpiritualSponsor.findOneAndUpdate(
      { _id: id, user_id: req.userId },
      updateData,
      { new: true }
    );

    if (!sponsor) {
      return res.status(404).json({
        success: false,
        error: 'Sponsor not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: sponsor._id,
        user_id: sponsor.user_id,
        name: sponsor.name,
        email: sponsor.email,
        phone: sponsor.phone,
        relationship: sponsor.relationship,
        isActive: sponsor.isActive,
        created_at: sponsor.createdAt
      }
    });

  } catch (error) {
    console.error('Update sponsor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update sponsor'
    });
  }
});

// DELETE /api/sponsors/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sponsor = await SpiritualSponsor.findOneAndDelete({
      _id: id,
      user_id: req.userId
    });

    if (!sponsor) {
      return res.status(404).json({
        success: false,
        error: 'Sponsor not found'
      });
    }

    res.json({
      success: true,
      message: 'Sponsor deleted successfully'
    });

  } catch (error) {
    console.error('Delete sponsor error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete sponsor'
    });
  }
});

module.exports = router; 
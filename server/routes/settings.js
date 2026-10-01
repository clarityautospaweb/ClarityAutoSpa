const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const requireAuth = require('../middleware/requireAuth');

// Helper to get or create settings
async function getSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      weeklyHours: [
        { day: 'Mon-Fri', hours: '8:00 AM - 6:30 PM' },
        { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
        { day: 'Sunday', hours: 'Closed' }
      ]
    });
  }
  return settings;
}

// @route   GET /api/settings
// @desc    Get site settings (Public)
router.get('/', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PATCH /api/settings
// @desc    Update site settings (Admin)
router.patch('/', requireAuth, async (req, res) => {
  try {
    const settings = await getSettings();
    const updatedSettings = await Settings.findByIdAndUpdate(
      settings._id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;

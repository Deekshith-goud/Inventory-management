const Activity = require('../models/Activity');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
const getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const activities = await Activity.find()
      .populate('productId', 'name sku')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Log a new activity
// @route   POST /api/activities
// @access  Internal/Helper
const logActivity = async (action, productId, details = '') => {
  try {
    await Activity.create({ action, productId, details });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

module.exports = {
  getActivities,
  logActivity
};

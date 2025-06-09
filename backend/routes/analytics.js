const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const User = require('../models/User');

// Get all users with activity
router.get('/users', async (req, res) => {
  try {
    // Get users with their last activity
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'analytics',
          localField: '_id',
          foreignField: 'userId',
          as: 'activities'
        }
      },
      {
        $addFields: {
          lastActivity: { $max: '$activities.timestamp' },
          activityCount: { $size: '$activities' }
        }
      },
      {
        $match: {
          activityCount: { $gt: 0 }
        }
      },
      {
        $sort: { lastActivity: -1 }
      },
      {
        $project: {
          password: 0,
          __v: 0,
          activities: 0
        }
      }
    ]);

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity for specific user
router.get('/user-activity', async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    const filter = { userId };
    
    if (startDate && endDate) {
      filter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const activity = await Analytics.find(filter)
      .sort({ timestamp: -1 })
      .limit(200);
    
    res.json(activity);
  } catch (err) {
    console.error('Error fetching user activity:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's popular products
router.get('/user-products/:userId', async (req, res) => {
  try {
    const popularProducts = await Analytics.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId(req.params.userId),
          eventType: { $in: ['add_to_cart', 'purchase'] }
        } 
      },
      { 
        $group: { 
          _id: '$metadata.product_id',
          name: { $first: '$metadata.name' },
          count: { $sum: 1 },
          lastInteraction: { $max: '$timestamp' }
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json(popularProducts);
  } catch (err) {
    console.error('Error fetching user products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
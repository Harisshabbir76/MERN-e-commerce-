const express = require('express');
const router = express.Router();
const Analytics = require('../Models/Analytics');
const User = require('../Models/User');
const mongoose = require('mongoose');

// Track event endpoint
router.post('/track', async (req, res) => {
  try {
    const { eventName, metadata } = req.body;
    
    const analyticsData = {
      eventType: eventName,
      sessionId: metadata.sessionId,
      userAgent: metadata.userAgent,
      pageUrl: metadata.path || metadata.pageUrl,
      metadata: metadata,
      ip: req.ip
    };

    // Add userId if available
    if (metadata.userId) {
      analyticsData.userId = metadata.userId;
    }

    await Analytics.create(analyticsData);
    
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error tracking event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users and sessions with activity
router.get('/users', async (req, res) => {
  try {
    const results = await Analytics.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: { 
            userId: '$userId',
            sessionId: { $ifNull: ['$sessionId', '$_id'] }
          },
          lastActivity: { $max: '$timestamp' },
          activityCount: { $sum: 1 },
          firstActivity: { $min: '$timestamp' },
          events: { 
            $push: {
              type: '$eventType',
              timestamp: '$timestamp'
            }
          },
          userAgent: { $first: '$userAgent' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          id: { $ifNull: ['$_id.userId', '$_id.sessionId'] },
          userId: '$_id.userId',
          sessionId: '$_id.sessionId',
          name: '$user.name',
          email: '$user.email',
          lastActivity: 1,
          firstActivity: 1,
          activityCount: 1,
          userAgent: 1,
          isAnonymous: { $not: ['$_id.userId'] },
          events: 1
        }
      },
      {
        $sort: { lastActivity: -1 }
      }
    ]);

    res.json(results);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity for specific user or session
router.get('/user-activity', async (req, res) => {
  try {
    const { userId, sessionId, startDate, endDate } = req.query;
    
    const filter = {};
    
    if (userId) {
      filter.userId = mongoose.Types.ObjectId(userId);
    } else if (sessionId) {
      filter.sessionId = sessionId;
    } else {
      return res.status(400).json({ error: 'Either userId or sessionId required' });
    }
    
    if (startDate && endDate) {
      filter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const activity = await Analytics.find(filter)
      .sort({ timestamp: -1 })
      .limit(500);
    
    res.json(activity);
  } catch (err) {
    console.error('Error fetching user activity:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's popular products
router.get('/user-products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const filter = {
      $or: [
        { userId: mongoose.Types.ObjectId(id) },
        { sessionId: id }
      ],
      eventType: { $in: ['add_to_cart', 'purchase', 'product_view'] }
    };
    
    const popularProducts = await Analytics.aggregate([
      { $match: filter },
      { 
        $group: { 
          _id: '$metadata.product_id',
          name: { $first: '$metadata.name' },
          image: { $first: '$metadata.image' },
          count: { $sum: 1 },
          lastInteraction: { $max: '$timestamp' },
          types: { $addToSet: '$eventType' }
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
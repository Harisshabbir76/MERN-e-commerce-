const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // 'pageview' or 'event'
  eventName: { type: String, required: false }, // e.g., 'add_to_cart'
  pageUrl: { type: String, required: true },
  userAgent: { type: String, required: false },
  ipAddress: { type: String, required: false },
  metadata: { type: Object, required: false }, // Any additional data
  createdAt: { type: Date, default: Date.now, expires: '90d' } // Auto-delete after 90 days
});

module.exports = mongoose.model('Analytics', analyticsSchema);
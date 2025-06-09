const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: { 
    type: String,
    required: true,
    enum: [
      'page_view',
      'add_to_cart',
      'purchase',
      'search_query',
      'search_result_click',
      'product_view',
      'checkout_start',
      'account_login',
      'external_link_click',
      'video_play',
      'tab_change',
      'scroll_depth'
    ]
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: false
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  ip: String,
  userAgent: String,
  pageUrl: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { 
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes
analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ sessionId: 1, timestamp: -1 });
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ 'metadata.product_id': 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
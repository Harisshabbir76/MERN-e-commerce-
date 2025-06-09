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
      'account_login'
    ]
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  sessionId: String,
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

// Compound index for common queries
analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ 'metadata.product_id': 1, timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
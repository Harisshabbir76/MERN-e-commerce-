const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  originalPrice: Number,
  discountedPrice: Number,
  image: [String],
  category: String,
  stock: Number,
  slug: { type: String, unique: true },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
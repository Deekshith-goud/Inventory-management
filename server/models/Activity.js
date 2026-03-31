const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "CREATE_PRODUCT", "RESTOCK_PRODUCT", "DELETE_PRODUCT"
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  details: { type: String }, // Optional additional context
}, { timestamps: true });

// To fetch most recent tracking actions quickly
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);

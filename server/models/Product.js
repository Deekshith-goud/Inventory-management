const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: [0, 'Price must be positive'] },
  quantity: { type: Number, required: true, min: [0, 'Quantity cannot be negative'] },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  sku: { type: String, required: true, unique: true },
  reorderLevel: { type: Number, required: true },
  salesCount: { type: Number, default: 0 },
  lastRestocked: { type: Date, default: Date.now },
  demandScore: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Product', productSchema);

const Product = require('../models/Product');
const Activity = require('../models/Activity');

// Intelligence Logic
const calculateDemandScore = (salesCount, daysSinceCreated) => {
  return salesCount / (daysSinceCreated + 1);
};

const determineStockStatus = (quantity, reorderLevel, demandScore, DEMAND_THRESHOLD = 5) => {
  if (quantity === 0) return 'OUT_OF_STOCK';
  if (quantity < reorderLevel) return 'LOW_STOCK';
  if (demandScore > DEMAND_THRESHOLD && quantity <= reorderLevel * 1.5) return 'HIGH_DEMAND_RISK';
  return 'HEALTHY';
};

const checkRestockRecommendation = (quantity, reorderLevel, demandScore, DEMAND_THRESHOLD = 5) => {
  return quantity < reorderLevel || demandScore > DEMAND_THRESHOLD;
};

const getInventoryInsights = async () => {
  const products = await Product.find({});
  let totalValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  products.forEach(p => {
    totalValue += (p.price * p.quantity);
    if (p.quantity === 0) outOfStockCount++;
    else if (p.quantity < p.reorderLevel) lowStockCount++;
  });

  return {
    totalProducts: products.length,
    totalValue,
    lowStockCount,
    outOfStockCount
  };
};

module.exports = {
  calculateDemandScore,
  determineStockStatus,
  checkRestockRecommendation,
  getInventoryInsights
};

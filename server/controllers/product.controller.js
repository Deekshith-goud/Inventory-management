const { Parser } = require('json2csv');
const Product = require('../models/Product');
const { logActivity } = require('./activity.controller');
const { calculateDemandScore, determineStockStatus, checkRestockRecommendation, getInventoryInsights } = require('../services/intelligence.service');

const getProducts = async (req, res) => {
  try {
    const { search, category, sort, order, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;

    const sortOpt = sort ? { [sort]: order === 'desc' ? -1 : 1 } : { createdAt: -1 };
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOpt)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);
    
    // Attach intelligence to response
    const enrichedProducts = await Promise.all(products.map(async p => {
      const daysSinceCreated = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600 * 24);
      const demandScore = calculateDemandScore(p.salesCount, daysSinceCreated);
      const status = determineStockStatus(p.quantity, p.reorderLevel, demandScore);
      const recommendRestock = checkRestockRecommendation(p.quantity, p.reorderLevel, demandScore);
      
      return { ...p._doc, demandScore, status, recommendRestock };
    }));

    res.status(200).json({
      success: true,
      data: enrichedProducts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await logActivity('CREATE_PRODUCT', product._id, `Created product: ${product.name}`);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await logActivity('UPDATE_PRODUCT', product._id, `Updated product metadata`);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await logActivity('DELETE_PRODUCT', null, `Deleted product: ${product.name}`);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInsights = async (req, res) => {
  try {
    const insights = await getInventoryInsights();
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLowStock = async (req, res) => {
  try {
    const products = await Product.find({ $expr: { $lt: ["$quantity", "$reorderLevel"] } });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ salesCount: -1 }).limit(5);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportCSV = async (req, res) => {
  try {
    const products = await Product.find({}, '-__v').lean();
    if (!products.length) return res.status(404).json({ success: false, message: 'No products to export' });
    
    // Convert ObjectId to string
    const formatted = products.map(p => ({ ...p, _id: p._id.toString() }));
    
    const parser = new Parser();
    const csv = parser.parse(formatted);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('products.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct, getInsights, getLowStock, getTopProducts, exportCSV
};

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getInsights,
  getLowStock,
  getTopProducts,
  exportCSV
} = require('../controllers/product.controller');

// Important: Specific routes must go before dynamic routes like /:id
router.get('/insights', getInsights);
router.get('/low-stock', getLowStock);
router.get('/top-products', getTopProducts);
router.get('/export/csv', exportCSV);

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;

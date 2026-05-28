const express = require('express');
const router = express.Router();
const {
  checkout,
  getOrders,
  getOrderById,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect); // All order routes require auth

router.post('/checkout', checkout);
router.get('/', getOrders);
router.get('/admin/all', adminOnly, getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;

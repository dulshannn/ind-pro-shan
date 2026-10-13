// routes/orderRoutes.js – Order CRUD routes
const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');
const { protect, isAdmin, requirePermission } = require('../middleware/authMiddleware');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);
router.put('/:id', protect, requirePermission('orders'), updateOrder);
router.delete('/:id', protect, requirePermission('orders'), deleteOrder);

module.exports = router;

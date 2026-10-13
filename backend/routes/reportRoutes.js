// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { generateOrdersReport } = require('../controllers/reportController');
const { protect, requirePermission } = require('../middleware/authMiddleware');

router.get('/orders', protect, requirePermission('reports'), generateOrdersReport);

module.exports = router;

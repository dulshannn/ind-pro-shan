// routes/dashboardRoutes.js – Dashboard analytics route
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, isAdmin, requirePermission } = require('../middleware/authMiddleware');

router.get('/stats', protect, requirePermission('dashboard'), getDashboardStats);

module.exports = router;

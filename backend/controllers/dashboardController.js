// controllers/dashboardController.js – Admin analytics
const Vehicle = require('../models/Vehicle');
const SparePart = require('../models/SparePart');
const Order = require('../models/Order');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');

/**
 * @desc    Get dashboard stats: counts + recent activities
 * @route   GET /api/dashboard/stats
 * @access  Admin
 */
const getDashboardStats = async (req, res) => {
    try {
        // Run all count queries in parallel
        const [
            totalVehicles,
            totalSpareParts,
            totalOrders,
            totalInquiries,
            totalCustomers,
            availableVehicles,
            pendingOrders,
            pendingInquiries,
            recentVehicles,
            recentOrders,
            recentInquiries,
        ] = await Promise.all([
            Vehicle.countDocuments(),
            SparePart.countDocuments(),
            Order.countDocuments(),
            Inquiry.countDocuments(),
            User.countDocuments({ role: 'customer' }),
            Vehicle.countDocuments({ status: 'available' }),
            Order.countDocuments({ orderStatus: 'processing' }),
            Inquiry.countDocuments({ status: 'pending' }),
            Vehicle.find().sort({ createdAt: -1 }).limit(5).select('title brand model year price status createdAt'),
            Order.find().sort({ createdAt: -1 }).limit(5).populate('customer', 'name email').select('total orderStatus paymentStatus createdAt'),
            Inquiry.find().sort({ createdAt: -1 }).limit(5).select('customerName chassisNumber status createdAt'),
        ]);

        res.json({
            stats: {
                totalVehicles,
                totalSpareParts,
                totalOrders,
                totalInquiries,
                totalCustomers,
                availableVehicles,
                pendingOrders,
                pendingInquiries,
            },
            recentActivities: {
                recentVehicles,
                recentOrders,
                recentInquiries,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getDashboardStats };

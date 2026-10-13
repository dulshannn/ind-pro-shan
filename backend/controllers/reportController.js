// controllers/reportController.js
const Order = require('../models/Order');

/**
 * @desc    Generate Orders Report (CSV)
 * @route   GET /api/reports/orders
 * @access  Admin/Manager (requires 'reports' permission)
 */
const generateOrdersReport = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer', 'name email').sort({ createdAt: -1 });

        let csv = 'Order ID,Date,Customer Name,Customer Email,Total (Rs.),Payment Method,Payment Status,Order Status,Fulfillment\n';

        orders.forEach(o => {
            const date = new Date(o.createdAt).toLocaleDateString('en-LK');
            const name = (o.customer?.name || 'N/A').replace(/,/g, '');
            const email = (o.customer?.email || 'N/A').replace(/,/g, '');
            const total = o.total;
            const pm = o.paymentMethod;
            const ps = o.paymentStatus;
            const os = o.orderStatus;
            const ful = o.fulfillmentType;

            csv += `${o._id},${date},${name},${email},${total},${pm},${ps},${os},${ful}\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment(`orders_report_${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
};

module.exports = { generateOrdersReport };

// controllers/orderController.js – Order CRUD operations
const Order = require('../models/Order');
const SparePart = require('../models/SparePart');

/**
 * @desc    Get all orders (admin) or customer's own orders
 * @route   GET /api/orders
 * @access  Private
 */
const getOrders = async (req, res) => {
    try {
        let query = {};
        // Customers only see their own orders
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            query.customer = req.user._id;
        }

        const orders = await Order.find(query)
            .populate('customer', 'name email')
            .populate('products.sparePart', 'partName brand price')
            .sort({ createdAt: -1 });

        res.json({ count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get a single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email')
            .populate('products.sparePart', 'partName brand price image');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure customer can only access their own order
        if (req.user.role !== 'admin' && req.user.role !== 'manager' && order.customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, notes } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products in order' });
        }

        // Calculate total from DB prices (never trust client-sent prices)
        let total = 0;
        const orderProducts = [];

        for (const item of products) {
            const part = await SparePart.findById(item.sparePart);
            if (!part) {
                return res.status(404).json({ message: `Spare part ${item.sparePart} not found` });
            }
            if (part.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${part.partName}` });
            }

            const itemTotal = part.price * item.quantity;
            total += itemTotal;

            orderProducts.push({
                sparePart: part._id,
                quantity: item.quantity,
                price: part.price,
            });

            // Deduct stock
            await SparePart.findByIdAndUpdate(part._id, { $inc: { stock: -item.quantity } });
        }

        const order = await Order.create({
            customer: req.user._id,
            products: orderProducts,
            total,
            shippingAddress,
            notes,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update order status / payment status
 * @route   PUT /api/orders/:id
 * @access  Admin
 */
const updateOrder = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const updateData = {};
        if (orderStatus) updateData.orderStatus = orderStatus;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate('customer', 'name email')
            .populate('products.sparePart', 'partName brand');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete an order
 * @route   DELETE /api/orders/:id
 * @access  Admin
 */
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.deleteOne();
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };

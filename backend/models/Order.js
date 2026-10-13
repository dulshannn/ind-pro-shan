// models/Order.js – Customer spare parts order
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    sparePart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SparePart',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Customer reference is required'],
        },
        products: {
            type: [orderItemSchema],
            required: true,
        },
        total: {
            type: Number,
            required: [true, 'Order total is required'],
            min: [0, 'Total cannot be negative'],
        },
        // ── Fulfillment ──────────────────────────────────────
        fulfillmentType: {
            type: String,
            enum: ['delivery', 'pickup'],
            default: 'delivery',
        },
        shippingAddress: {
            address: { type: String, trim: true },
            city: { type: String, trim: true },
            postalCode: { type: String, trim: true },
            phone: { type: String, trim: true },
        },
        // ── Payment ──────────────────────────────────────────
        paymentMethod: {
            type: String,
            enum: ['cash', 'card'],
            default: 'cash',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        // ── Order Status ─────────────────────────────────────
        orderStatus: {
            type: String,
            enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'processing',
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

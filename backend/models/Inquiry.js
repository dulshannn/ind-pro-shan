// models/Inquiry.js – Customer vehicle/part compatibility inquiry
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            trim: true,
        },
        chassisNumber: {
            type: String,
            required: [true, 'Chassis number is required'],
            trim: true,
            uppercase: true,
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'resolved'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);

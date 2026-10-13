// controllers/inquiryController.js – Customer Inquiry CRUD
const Inquiry = require('../models/Inquiry');
const { validationResult } = require('express-validator');

/**
 * @desc    Submit a new inquiry (public)
 * @route   POST /api/inquiries
 * @access  Public
 */
const createInquiry = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const inquiry = await Inquiry.create(req.body);
        res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get all inquiries
 * @route   GET /api/inquiries
 * @access  Admin
 */
const getInquiries = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        // Customers can only see their own inquiries (matched by email)
        if (req.user && req.user.role !== 'admin' && req.user.role !== 'manager') {
            query.email = req.user.email;
        }

        const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
        res.json({ count: inquiries.length, inquiries });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update inquiry status
 * @route   PUT /api/inquiries/:id
 * @access  Admin
 */
const updateInquiry = async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete an inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Admin
 */
const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }
        await inquiry.deleteOne();
        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createInquiry, getInquiries, updateInquiry, deleteInquiry };

// routes/inquiryRoutes.js – Inquiry routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createInquiry,
    getInquiries,
    updateInquiry,
    deleteInquiry,
} = require('../controllers/inquiryController');
const { protect, isAdmin, requirePermission } = require('../middleware/authMiddleware');

const inquiryValidation = [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('chassisNumber').trim().notEmpty().withMessage('Chassis number is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
];

router.post('/', inquiryValidation, createInquiry);
router.get('/', protect, getInquiries);           // customers see their own, admins see all
router.put('/:id', protect, requirePermission('inquiries'), updateInquiry);
router.delete('/:id', protect, requirePermission('inquiries'), deleteInquiry);

module.exports = router;

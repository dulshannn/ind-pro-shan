// routes/authRoutes.js – Authentication routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerUser, loginUser, getMe, getAllUsers, updateMe, updatePassword, updateUserRolePermissions } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/me/password', protect, updatePassword);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/role-permissions', protect, isAdmin, updateUserRolePermissions);

module.exports = router;

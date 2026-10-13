// controllers/authController.js – Registration and Login
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user (password hashed by model pre-save hook)
        const user = await User.create({ name, email, password, role: role || 'customer' });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Login user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        permissions: req.user.permissions,
        createdAt: req.user.createdAt,
    });
};

/**
 * @desc    Get all users (admin)
 * @route   GET /api/auth/users
 * @access  Admin
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update user role & permissions (admin)
 * @route   PUT /api/auth/users/:id/role-permissions
 * @access  Admin
 */
const updateUserRolePermissions = async (req, res) => {
    try {
        const { role, permissions } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (role) {
            user.role = role;
        }
        if (permissions && Array.isArray(permissions)) {
            user.permissions = permissions;
        }

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update current user's profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateMe = async (req, res) => {
    try {
        const { name, email } = req.body;
        // Check email not taken by another account
        if (email && email !== req.user.email) {
            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ message: 'Email already in use by another account.' });
        }
        const updated = await User.findByIdAndUpdate(
            req.user._id,
            { ...(name && { name }), ...(email && { email }) },
            { new: true, runValidators: true }
        ).select('-password');
        res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, permissions: updated.permissions });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Change current user's password
 * @route   PUT /api/auth/me/password
 * @access  Private
 */
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both passwords are required.' });
        const user = await User.findById(req.user._id).select('+password');
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe, getAllUsers, updateMe, updatePassword, updateUserRolePermissions };


// middleware/authMiddleware.js – JWT verification and role-based access control
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes – verifies JWT token from Authorization header
 */
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

/**
 * Admin only – must be used after protect middleware
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied: Admins only' });
};

/**
 * Dynamic Permission Check
 * Admins bypass this entirely. Managers must have the explicitly requested permission in their array.
 */
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Admins bypass all checks
        if (req.user.role === 'admin') {
            return next();
        }

        // Managers must have the specific permission
        if (req.user.role === 'manager' && req.user.permissions && req.user.permissions.includes(permission)) {
            return next();
        }

        return res.status(403).json({ message: `Access denied. Requires '${permission}' permission.` });
    };
};

module.exports = { protect, isAdmin, requirePermission };

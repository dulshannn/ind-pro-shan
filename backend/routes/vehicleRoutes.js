// routes/vehicleRoutes.js – Vehicle CRUD routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} = require('../controllers/vehicleController');
const { protect, isAdmin, requirePermission } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const vehicleValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('brand').trim().notEmpty().withMessage('Brand is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1990 }).withMessage('Valid year is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
];

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', protect, requirePermission('vehicles'), upload.array('images', 10), vehicleValidation, createVehicle);
router.put('/:id', protect, requirePermission('vehicles'), upload.array('images', 10), updateVehicle);
router.delete('/:id', protect, requirePermission('vehicles'), deleteVehicle);

module.exports = router;

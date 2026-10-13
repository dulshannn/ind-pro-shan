// routes/sparePartRoutes.js – Spare Parts CRUD routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getSpareParts,
    getSparePartById,
    createSparePart,
    updateSparePart,
    deleteSparePart,
} = require('../controllers/sparePartController');
const { protect, isAdmin, requirePermission } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const sparePartValidation = [
    body('partName').trim().notEmpty().withMessage('Part name is required'),
    body('brand').trim().notEmpty().withMessage('Brand is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('stock').isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
];

router.get('/', getSpareParts);
router.get('/:id', getSparePartById);
router.post('/', protect, requirePermission('spareparts'), upload.single('image'), sparePartValidation, createSparePart);
router.put('/:id', protect, requirePermission('spareparts'), upload.single('image'), updateSparePart);
router.delete('/:id', protect, requirePermission('spareparts'), deleteSparePart);

module.exports = router;

// controllers/sparePartController.js – Spare Parts CRUD
const SparePart = require('../models/SparePart');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all spare parts with optional filters
 * @route   GET /api/spareparts
 * @access  Public
 */
const getSpareParts = async (req, res) => {
    try {
        const { brand, category, minPrice, maxPrice, search } = req.query;

        let query = {};
        if (brand) query.brand = { $regex: brand, $options: 'i' };
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { partName: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const parts = await SparePart.find(query).populate('category', 'categoryName').sort({ createdAt: -1 });
        res.json({ count: parts.length, spareParts: parts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get a single spare part by ID
 * @route   GET /api/spareparts/:id
 * @access  Public
 */
const getSparePartById = async (req, res) => {
    try {
        const part = await SparePart.findById(req.params.id).populate('category', 'categoryName');
        if (!part) {
            return res.status(404).json({ message: 'Spare part not found' });
        }
        res.json(part);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create a new spare part
 * @route   POST /api/spareparts
 * @access  Admin
 */
const createSparePart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Cloudinary returns the full HTTPS URL via file.path
        const image = req.file ? req.file.path : '';
        const part = await SparePart.create({ ...req.body, image });
        const populated = await part.populate('category', 'categoryName');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update a spare part
 * @route   PUT /api/spareparts/:id
 * @access  Admin
 */
const updateSparePart = async (req, res) => {
    try {
        const part = await SparePart.findById(req.params.id);
        if (!part) {
            return res.status(404).json({ message: 'Spare part not found' });
        }

        let updateData = { ...req.body };
        if (req.file) {
            // Cloudinary returns the full HTTPS URL via file.path
            updateData.image = req.file.path;
        }

        const updated = await SparePart.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }).populate('category', 'categoryName');

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete a spare part
 * @route   DELETE /api/spareparts/:id
 * @access  Admin
 */
const deleteSparePart = async (req, res) => {
    try {
        const part = await SparePart.findById(req.params.id);
        if (!part) {
            return res.status(404).json({ message: 'Spare part not found' });
        }
        await part.deleteOne();
        res.json({ message: 'Spare part deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getSpareParts, getSparePartById, createSparePart, updateSparePart, deleteSparePart };

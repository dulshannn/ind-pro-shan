// controllers/categoryController.js – Category CRUD
const Category = require('../models/Category');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ categoryName: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Admin
 */
const createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        if (!categoryName || !categoryName.trim()) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const exists = await Category.findOne({ categoryName: categoryName.trim() });
        if (exists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ categoryName: categoryName.trim() });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Admin
 */
const updateCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        if (!categoryName || !categoryName.trim()) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { categoryName: categoryName.trim() },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Admin
 */
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.deleteOne();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

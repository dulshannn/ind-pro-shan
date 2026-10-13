// models/SparePart.js – Spare parts inventory model
const mongoose = require('mongoose');
require('./Category');

const sparePartSchema = new mongoose.Schema(
    {
        partName: {
            type: String,
            required: [true, 'Part name is required'],
            trim: true,
        },
        brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        compatibleModels: {
            type: [String],
            default: [],
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        image: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('SparePart', sparePartSchema);

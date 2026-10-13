// models/Vehicle.js – Vehicle inventory model
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true,
        },
        model: {
            type: String,
            required: [true, 'Model is required'],
            trim: true,
        },
        year: {
            type: Number,
            required: [true, 'Year is required'],
            min: [1990, 'Year must be 1990 or later'],
            max: [new Date().getFullYear() + 1, 'Year cannot be in the far future'],
        },
        engineCapacity: {
            type: String,
            trim: true,
        },
        transmission: {
            type: String,
            enum: ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'],
            default: 'Automatic',
        },
        fuelType: {
            type: String,
            enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'],
            default: 'Petrol',
        },
        mileage: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        description: {
            type: String,
            trim: true,
        },
        images: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['available', 'sold', 'reserved'],
            default: 'available',
        },
        location: {
            type: String,
            enum: ['Showroom', 'Warehouse', 'Auction'],
            default: 'Showroom',
        },
        tax: {
            type: Number,
            default: 0,
            min: [0, 'Tax cannot be negative'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);

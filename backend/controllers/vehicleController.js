// controllers/vehicleController.js – Vehicle CRUD operations
const Vehicle = require('../models/Vehicle');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all vehicles with optional search/filter
 * @route   GET /api/vehicles
 * @access  Public
 */
const getVehicles = async (req, res) => {
    try {
        const { brand, model, year, minPrice, maxPrice, fuelType, transmission, status, search } = req.query;

        let query = {};

        if (brand) query.brand = { $regex: brand, $options: 'i' };
        if (model) query.model = { $regex: model, $options: 'i' };
        if (year) query.year = Number(year);
        if (fuelType) query.fuelType = fuelType;
        if (transmission) query.transmission = transmission;
        if (status) query.status = status;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
            ];
        }

        const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
        res.json({ count: vehicles.length, vehicles });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get a single vehicle by ID
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create a new vehicle
 * @route   POST /api/vehicles
 * @access  Admin
 */
const createVehicle = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Cloudinary returns the full HTTPS URL via file.path
        const images = req.files ? req.files.map((f) => f.path) : [];

        const vehicle = await Vehicle.create({ ...req.body, images });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update a vehicle
 * @route   PUT /api/vehicles/:id
 * @access  Admin
 */
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Cloudinary returns the full HTTPS URL via file.path
        let updateData = { ...req.body };
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map((f) => f.path);
        }

        const updated = await Vehicle.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete a vehicle
 * @route   DELETE /api/vehicles/:id
 * @access  Admin
 */
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        await vehicle.deleteOne();
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };

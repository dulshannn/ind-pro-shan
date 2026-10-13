// backend/seedManager.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedManager = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB.');

        const email = 'manager@shanauto.lk';
        const existing = await User.findOne({ email });

        if (existing) {
            existing.role = 'manager';
            existing.permissions = ['vehicles', 'spareparts', 'orders', 'inquiries', 'customers', 'dashboard', 'reports'];
            await existing.save();
            console.log('✅ Updated existing user to manager:', email);
        } else {
            await User.create({
                name: 'Shan Auto Manager',
                email,
                password: 'password123',
                role: 'manager',
                permissions: ['vehicles', 'spareparts', 'orders', 'inquiries', 'customers', 'dashboard', 'reports']
            });
            console.log('✅ Created new manager account:', email);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedManager();

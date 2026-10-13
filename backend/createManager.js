// backend/createManager.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedManager = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const args = process.argv.slice(2);
        const name = args[0] || 'Admin Manager';
        const email = args[1] || 'manager1234@shanauto.lk';
        const password = args[2] || 'password1234';

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log(`User ${email} already exists. Updating to Manager with all permissions...`);
            user.role = 'manager';
            user.permissions = ['vehicles', 'spareparts', 'orders', 'inquiries', 'customers', 'dashboard', 'reports'];
            await user.save();
            console.log(`✅ User ${email} has been updated to fully capable Manager.`);
            process.exit(0);
        }

        const newManager = new User({
            name,
            email,
            password,
            role: 'manager',
            permissions: ['vehicles', 'spareparts', 'orders', 'inquiries', 'customers', 'dashboard', 'reports']
        });

        await newManager.save();
        console.log(`✅ Successfully created FULL PERMISSIONS Manager account!`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedManager();

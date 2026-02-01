const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const createAdmin = async () => {
    const email = 'admin@admin.com';
    const password = 'admin';

    if (!process.env.DB_URL) {
        console.error("DB_URL is missing in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to Database');

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log(`Admin user ${email} already exists.`);
            // Update password just in case
            const hashedPassword = await bcrypt.hash(password, 10);
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log(`Password reset for ${email} to '${password}'`);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new Admin({
                email,
                password: hashedPassword
            });
            await admin.save();
            console.log(`Admin created successfully.`);
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        }

    } catch (err) {
        console.error("Error creation admin:", err);
    } finally {
        await mongoose.disconnect();
        console.log('Done');
        process.exit(0);
    }
};

createAdmin();

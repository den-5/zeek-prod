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
        void(0);

        
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            void(0);
            
            const hashedPassword = await bcrypt.hash(password, 10);
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            void(0);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new Admin({
                email,
                password: hashedPassword
            });
            await admin.save();
            void(0);
            void(0);
            void(0);
        }

    } catch (err) {
        console.error("Error creation admin:", err);
    } finally {
        await mongoose.disconnect();
        void(0);
        process.exit(0);
    }
};

createAdmin();

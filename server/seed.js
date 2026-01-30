const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany(); 

        const adminUser = new User({
            email: 'admin@example.com',
            password: 'admin123' 
        });

        await adminUser.save();

        console.log('Admin User Seeded Successfully');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();

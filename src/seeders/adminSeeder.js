const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../app/models/User');
const db = require('../config/db');

db.connect();

async function seedAdmin() {
    const username = 'admin';
    const password = '123';
    const email = 'admin@gmail.com';
    const fullname = 'Admin User';

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log('Admin account already exists.');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword,
            email,
            fullname,
            role: 'admin',
            avatar: 'https://files.f8.edu.vn/f8-prod/user_photos/360703/65105d07c2f4b.jpg'
        });

        await user.save();
        console.log('Admin account created successfully!');
        console.log('Username: admin');
        console.log('Password: 123');
    } catch (error) {
        console.error('Error creating admin account:', error);
    } finally {
        process.exit();
    }
}

seedAdmin();

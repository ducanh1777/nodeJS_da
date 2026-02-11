const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/app/models/User');
const db = require('./src/config/db');

async function verifyAdmin() {
    try {
        await db.connect();

        const username = 'admin';
        const user = await User.findOne({ username });

        if (!user) {
            console.log("Admin user NOT FOUND in database.");
        } else {
            console.log("Admin user FOUND.");
            console.log("Stored Password Hash:", user.password);

            const isMatch = await bcrypt.compare('123', user.password);
            console.log("Password '123' matches hash:", isMatch);

            if (!isMatch) {
                const newHash = await bcrypt.hash('123', 10);
                console.log("Generated new hash for '123':", newHash);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

verifyAdmin();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

dotenv.config();
connectDB();

const seedStudent = async () => {
    try {
        console.log('Seeding Demo Student...');

        // Check if student exists
        const email = 'student@permitto.com';
        let user = await User.findOne({ email });

        if (user) {
            console.log('Demo student already exists. Resetting password...');
            user.password = 'password123';
            await user.save();
        } else {
            console.log('Creating new demo student...');
            user = await User.create({
                name: 'Demo Student',
                email: email,
                password: 'password123',
                role: 'student',
                department: 'CSE',
                classId: 'IV-CSE-A', // Ideally matches a real class, but string is fine for now
                regNo: '2021CSE001',
                phone: '9876543210'
            });
        }

        console.log(`Student Ready:\nEmail: ${email}\nPassword: password123`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedStudent();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');

dotenv.config();
connectDB();

const seedCoreUsers = async () => {
    try {
        console.log('Seeding Core Users...');

        const users = [
            {
                email: 'student@college.edu',
                name: 'Student User',
                role: 'student',
                password: 'password123',
                department: 'CSE',
                classId: 'IV-CSE-A',
                regNo: '2023CSE001',
                phone: '9876543210'
            },
            {
                email: 'mentor@college.edu',
                name: 'Mentor User',
                role: 'faculty', // Using 'faculty' as per some codebase logic, or 'mentor'. I'll stick to 'mentor' if routes expect it, but 'faculty' is safer value for legacy. Actually, let's use 'mentor' as my updates support it.
                // Wait, sidebar logic usually checks role. Let's use 'mentor' to be explicit.
                // Re-reading previous context: "req.user.role === 'mentor' || req.user.role === 'faculty'". 
                // Routes: authorize('mentor', 'admin', 'hod').
                // So 'mentor' is definitely supported and preferred now.
                role: 'mentor',
                password: 'password123',
                department: 'CSE',
                phone: '9876543211'
            },
            {
                email: 'hod@college.edu',
                name: 'HOD User',
                role: 'hod',
                password: 'password123',
                department: 'CSE',
                phone: '9876543212'
            }
        ];

        for (const u of users) {
            let user = await User.findOne({ email: u.email });
            if (user) {
                console.log(`Updating ${u.email}...`);
                user.name = u.name;
                user.role = u.role;
                user.password = u.password; // Will be hashed by pre-save
                user.department = u.department;
                if (u.classId) user.classId = u.classId;
                if (u.regNo) user.regNo = u.regNo;
                await user.save();
            } else {
                console.log(`Creating ${u.email}...`);
                await User.create(u);
            }
        }

        console.log('Core Users Seeded Successfully.');
        console.log('Credentials -> Pass: password123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedCoreUsers();

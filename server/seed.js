const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Leave = require('./src/models/Leave');
const Attendance = require('./src/models/Attendance');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vidumurai')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        await User.deleteMany({});
        await Leave.deleteMany({});
        await Attendance.deleteMany({});
        console.log('Old data cleared.');

        // 1. Create Mentor
        const mentor = await User.create({
            name: 'Prof. Senthil Kumar',
            email: 'mentor@college.edu',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'mentor',
            department: 'CSE',
            classId: 'IV-CSE-A',
            phone: '9876543210'
        });
        console.log('Mentor created: mentor@college.edu / password123');

        // 2. Create HOD
        const hod = await User.create({
            name: 'Dr. R. Kavitha',
            email: 'hod@college.edu',
            password: 'password123',
            role: 'hod',
            department: 'CSE'
        });
        console.log('HOD created: hod@college.edu / password123');

        // 2b. Demo Users (Read Only)
        // Demo HOD
        const demoHod = await User.create({
            name: 'Demo HOD',
            email: 'hod@demo.com',
            password: 'demo123',
            role: 'hod',
            department: 'CSE'
        });

        // Demo Mentor
        const demoMentor = await User.create({
            name: 'Demo Faculty',
            email: 'mentor@demo.com',
            password: 'demo123',
            role: 'mentor',
            department: 'CSE',
            classId: 'IV-CSE-A'
        });

        // Demo Student
        await User.create({
            name: 'Demo Student',
            email: 'student@demo.com',
            password: 'demo123',
            role: 'student',
            department: 'CSE',
            classId: 'IV-CSE-A',
            rollNo: '24CS000',
            mentorId: demoMentor._id,
            parentMobile: '0000000000'
        });
        console.log('Demo Accounts Created: student/mentor/hod@demo.com (Password: demo123)');

        // 3. Create Student
        const student = await User.create({
            name: 'Arun Vijay',
            email: 'student@college.edu',
            password: 'password123',
            role: 'student',
            department: 'CSE',
            classId: 'IV-CSE-A',
            rollNo: '22CS056',
            phone: '9988776655',
            parentMobile: '9876543210',
            mentorId: mentor._id
        });
        console.log('Student created: student@college.edu / password123');

        // 4. Create Dummy Attendance for Student (Last 5 days)
        const today = new Date();
        for (let i = 1; i <= 5; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);

            await Attendance.create({
                student: student._id,
                date: date,
                status: i === 3 ? 'Absent' : 'Present', // One absent day
                markedBy: 'System'
            });
        }
        console.log('Dummy attendance added.');

        // 5. Create a Pending Leave Request
        const leaveDate = new Date();
        leaveDate.setDate(leaveDate.getDate() + 2); // Future leave

        await Leave.create({
            student: student._id,
            leaveType: 'Sick',
            reason: 'High fever and cold.',
            startDate: leaveDate,
            endDate: leaveDate,
            totalDays: 1,
            status: 'Pending'
        });
        console.log('Pending leave request created.');

        console.log('-----------------------------------');
        console.log('SEEDING COMPLETE! You can now login.');
        console.log('-----------------------------------');
        process.exit();

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();

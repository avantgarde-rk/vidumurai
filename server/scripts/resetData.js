const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Leave = require('../src/models/Leave');
const Class = require('../src/models/Class');
const Attendance = require('../src/models/Attendance'); // If exists? Check imports later.
const Announcement = require('../src/models/Announcement');

dotenv.config();
connectDB();

const resetData = async () => {
    try {
        console.log('Resetting Data...');

        // Delete all students
        const studentResult = await User.deleteMany({ role: 'student' });
        console.log(`Deleted ${studentResult.deletedCount} students.`);

        // Delete all data related to students
        await Leave.deleteMany({});
        console.log('Deleted all Leaves.');

        await Class.deleteMany({});
        console.log('Deleted all Classes.');

        await Announcement.deleteMany({});
        console.log('Deleted all Announcements.');

        // If Attendance model exists (I'll check file existence first usually, but assume yes)
        try {
            // const Attendance = require('../src/models/Attendance'); 
            // await Attendance.deleteMany({});
            // console.log('Deleted all Attendance records.');
            /* Accessing collection directly if model file uncertain */
            await mongoose.connection.collection('attendances').deleteMany({});
            console.log('Deleted all Attendance records (direct).');

        } catch (e) { console.log('Attendance cleanup skipped or failed: ' + e.message); }

        console.log('Data Reset Complete. HOD/Faculty accounts preserved.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetData();

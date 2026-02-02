const Attendance = require('../models/Attendance');
const { sendWhatsApp } = require('../utils/whatsappService');
const User = require('../models/User');

// @desc    Mark attendance (Mock WiFi check)
// @route   POST /api/attendance/mark
// @access  Private (Student)
exports.markAttendance = async (req, res) => {
    // In a real app, we would verify IP/DeviceID here
    const { deviceId, locationIP } = req.body;

    const date = new Date();
    date.setHours(0, 0, 0, 0); // Normalize to start of day

    try {
        const existing = await Attendance.findOne({
            student: req.user._id,
            date: date
        });

        if (existing) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        const attendance = await Attendance.create({
            student: req.user._id,
            date: date,
            status: 'Present',
            markedBy: 'System',
            deviceId,
            locationIP
        });

        res.status(201).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Mark Student Absent (Faculty Action) with WhatsApp Trigger
// @route   POST /api/attendance/absent
// @access  Private (Faculty/HOD)
exports.markAbsent = async (req, res) => {
    try {
        const { studentId, date } = req.body;
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        // Update or Create
        const attendance = await Attendance.findOneAndUpdate(
            { student: studentId, date: targetDate },
            { status: 'Absent', markedBy: req.user._id },
            { upsert: true, new: true }
        );

        // Fetch Parent Mobile
        const student = await User.findById(studentId);
        if (student && student.parentMobile) {
            // Mock Send
            await sendWhatsApp(
                studentId,
                student.parentMobile,
                `Vidumurai Alert: Your ward ${student.name} is marked ABSENT today (${targetDate.toLocaleDateString()}).`,
                'Absence Alert'
            );
        } else {
            console.log(`[WhatsApp] No parent mobile for ${student?.name}`);
        }

        res.json({ message: 'Marked Absent & Alert Sent', attendance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get student's attendance history
// @route   GET /api/attendance/me
// @access  Private (Student)
exports.getAttendanceHistory = async (req, res) => {
    try {
        const history = await Attendance.find({ student: req.user._id }).sort({ date: -1 });

        // Calculate percentage (Mock logic)
        const totalDays = 100; // Mock total working days
        const presentDays = history.filter(a => a.status === 'Present').length + 75; // Mock offset
        const percentage = (presentDays / totalDays) * 100;

        res.json({
            history,
            summary: {
                totalDays,
                presentDays,
                percentage: percentage.toFixed(2)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all attendance (Staff)
// @route   GET /api/attendance
// @access  Private (Staff)
exports.getAllAttendance = async (req, res) => {
    try {
        let query = {};
        // Use User model to filter students first
        const User = require('../models/User'); // lazy load

        if (req.user.role === 'mentor' && req.user.department) {
            const deptStudents = await User.find({ department: req.user.department, role: 'student' }).select('_id');
            query.student = { $in: deptStudents };
        }
        if (req.user.role === 'coordinator' && req.user.classId) {
            const classStudents = await User.find({ classId: req.user.classId, role: 'student' }).select('_id');
            query.student = { $in: classStudents };
        }

        const attendance = await Attendance.find(query)
            .populate('student', 'name department classId')
            .sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

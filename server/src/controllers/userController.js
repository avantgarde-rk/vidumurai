const Class = require('../models/Class');
const User = require('../models/User');

// @desc    Create a new class
// @route   POST /api/users/class
// @access  Private (Faculty/HOD/Admin)
exports.createClass = async (req, res) => {
    try {
        const { name } = req.body;
        // Check if exists
        const exists = await Class.findOne({ name });
        if (exists) return res.status(400).json({ message: 'Class already exists' });

        const newClass = await Class.create({
            name,
            department: req.user.department || 'CSE', // Default or from user
            mentor: req.user._id
        });
        res.status(201).json(newClass);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all classes for logged in staff
// @route   GET /api/users/classes
// @access  Private (Faculty/HOD)
exports.getClasses = async (req, res) => {
    try {
        // If HOD, return all in department. If Mentor, return assigned.
        let query = {};
        if (req.user.role === 'hod') {
            query.department = req.user.department;
        } else {
            // For simplicity in demo, return all created by this user OR all generally
            query.department = req.user.department || 'CSE';
        }

        const classes = await Class.find(query).populate('students', 'name regNo');

        // Return format suitable for frontend
        const result = classes.map(c => ({
            id: c._id,
            name: c.name,
            studentCount: c.students.length
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get students in a specific class
// @route   GET /api/users/class/:classId/students
// @access  Private
exports.getClassStudents = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.classId).populate('students');
        if (!cls) return res.status(404).json({ message: 'Class not found' });
        res.json(cls.students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get Department Stats (HOD)
// @route   GET /api/users/stats/department
// @access  Private (HOD)
exports.getDepartmentStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student', department: req.user.department });
        // Leaves approved count
        const Leave = require('../models/Leave'); // Lazy load
        const approvedLeaves = await Leave.countDocuments({
            status: 'Approved',
        });

        // Simple accurate count for students is critical request
        res.json({
            studentCount,
            approvedLeaves: approvedLeaves,
            absentToday: 0 // Placeholder
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Create a new student
// @route   POST /api/users/student
// @access  Private (Faculty/Admin)
exports.createStudent = async (req, res) => {
    try {
        const { name, email, password, department, classId, regNo, phone } = req.body; // classId here is optionally name or ID

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Check RegNo uniqueness
        if (regNo) {
            const regExists = await User.findOne({ regNo });
            if (regExists) return res.status(400).json({ message: 'Register Number already exists' });
        }

        const user = await User.create({
            name, email, password, role: 'student', department, classId, regNo, phone,
            mentorId: req.user._id
        });

        // Link to Class model if classId provided (which is name in current frontend)
        if (classId) {
            // Try finding by Name first (as per current frontend logic sending name)
            // Or ID.
            const cls = await Class.findOne({ name: classId }) || await Class.findById(classId).catch(() => null);
            if (cls) {
                cls.students.push(user._id);
                await cls.save();
            }
        }

        res.status(201).json(user);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email or Register Number already in use.' });
        }
        res.status(500).json({ error: err.message });
    }
};

// @desc    Submit profile update request
// @route   POST /api/users/profile-request
// @access  Private (Student)
exports.submitProfileRequest = async (req, res) => {
    try {
        const { details, changes, reason } = req.body; // details = new full object
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.profileUpdateRequest = {
            newDetails: details, // Store the proposed state
            changes,
            reason,
            status: 'Pending',
            requestedAt: new Date()
        };

        await user.save();
        res.status(200).json({ message: 'Request submitted successfully' });
    } catch (err) {
        console.error("Profile Request Error:", err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};

// @desc    Get pending profile requests
// @route   GET /api/users/profile-requests
// @access  Private (Faculty/Admin)
exports.getProfileRequests = async (req, res) => {
    try {
        const users = await User.find({ 'profileUpdateRequest.status': 'Pending' });

        const requests = users.map(u => ({
            id: u._id,
            student: `${u.name} (${u.regNo || u.email})`,
            changes: u.profileUpdateRequest.changes,
            newDetails: u.profileUpdateRequest.newDetails,
            reason: u.profileUpdateRequest.reason
        }));

        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Approve or Reject request
// @route   PUT /api/users/profile-requests/:id
// @access  Private (Faculty)
exports.actionProfileRequest = async (req, res) => {
    try {
        const { action } = req.body; // 'Approve' or 'Reject'
        const user = await User.findById(req.params.id);

        if (!user || !user.profileUpdateRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (action === 'Approve') {
            const updates = user.profileUpdateRequest.newDetails || {};

            // Basic Fields
            if (updates.phone) user.phone = updates.phone;
            if (updates.address) user.address = updates.address;
            if (updates.profilePic) user.profilePic = updates.profilePic;

            // Extended Fields
            if (updates.name) user.name = updates.name;
            if (updates.email) user.email = updates.email;
            if (updates.parentMobile) user.parentMobile = updates.parentMobile;

            if (updates.semester) user.semester = Number(updates.semester) || user.semester;
            if (updates.classId) user.classId = updates.classId;

            // Handle Unique/Sparse RegNo
            if (updates.regNo && updates.regNo.trim() !== '') {
                user.regNo = updates.regNo;
            }

            user.profileUpdateRequest = null;
            await user.save();
            return res.json({ message: 'Request Approved and Profile Updated' });
        } else {
            user.profileUpdateRequest = null;
            await user.save();
            return res.json({ message: 'Request Rejected' });
        }
    } catch (err) {
        console.error("Profile Action Error:", err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Update failed: Email or RegNo already assigned to another student.' });
        }
        res.status(500).json({ error: err.message });
    }
};

const GatePass = require('../models/GatePass');
const OnDuty = require('../models/OnDuty');
const Announcement = require('../models/Announcement');
const Academic = require('../models/Academic');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const CommunicationLog = require('../models/CommunicationLog');

// --- GATE PASS CONTROLLERS ---

exports.requestGatePass = async (req, res) => {
    try {
        const { type, reason, destination, outTime, inTime } = req.body;
        const pass = await GatePass.create({
            student: req.user._id,
            type, reason, destination,
            expectedOutTime: outTime,
            expectedInTime: inTime
        });
        res.status(201).json(pass);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getGatePasses = async (req, res) => {
    try {
        // If student, own passes. If staff, all pending/approved.
        let query = {};
        if (req.user.role === 'student') query.student = req.user._id;
        else if (req.user.role === 'mentor' || req.user.role === 'hod') {
            // Fetch students under this mentor/hod department
            const students = await User.find({
                department: req.user.department
            }).select('_id');
            const studentIds = students.map(s => s._id);
            query.student = { $in: studentIds };
        }

        const passes = await GatePass.find(query)
            .populate('student', 'name regNo classId')
            .sort({ createdAt: -1 });
        res.json(passes);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.actionGatePass = async (req, res) => {
    try {
        const { action, reason } = req.body; // 'Approve', 'Reject'
        const pass = await GatePass.findById(req.params.id);
        if (!pass) return res.status(404).json({ message: 'Pass not found' });

        const userRole = req.user.role; // 'mentor', 'hod'

        // MENTOR ACTION
        if (pass.status === 'Pending Mentor Approval' || pass.status === 'Pending') {
            if (userRole !== 'mentor' && userRole !== 'hod') { // Usually mentors, but HOD is super-user? Strict: only mentor.
                // Assuming strict flow:
                if (userRole !== 'mentor') return res.status(403).json({ message: 'Only Mentor can approve at this stage' });
            }

            if (action === 'Approve') {
                pass.mentorApproved = true;
                pass.mentorActionBy = req.user._id;
                pass.mentorActionAt = new Date();
                pass.status = 'Pending HOD Approval';
            } else {
                pass.status = 'Rejected';
                pass.rejectionReason = reason || 'Rejected by Mentor';
                pass.mentorActionBy = req.user._id;
            }
        }
        // HOD ACTION
        else if (pass.status === 'Pending HOD Approval') {
            if (userRole !== 'hod') return res.status(403).json({ message: 'Only HOD can approve at this stage' });

            if (action === 'Approve') {
                pass.hodApproved = true;
                pass.hodActionBy = req.user._id;
                pass.hodActionAt = new Date();
                pass.status = 'Approved';
                pass.qrCodeString = `GP-${pass._id}-${Date.now()}`;
            } else {
                pass.status = 'Rejected';
                pass.rejectionReason = reason || 'Rejected by HOD';
                pass.hodActionBy = req.user._id;
            }
        } else {
            return res.status(400).json({ message: 'Invalid status for action' });
        }

        await pass.save();
        res.json(pass);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.verifyGatePass = async (req, res) => {
    try {
        const { qrString } = req.body;
        if (!qrString) return res.status(400).json({ message: 'QR String required' });

        const pass = await GatePass.findOne({ qrCodeString: qrString }).populate('student', 'name regNo dept classId img');
        if (!pass) return res.status(404).json({ message: 'Invalid or Expired Pass' });

        res.json(pass);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- ON DUTY CONTROLLERS ---

exports.applyOnDuty = async (req, res) => {
    try {
        const { eventName, eventDate, organizer, description, brochure } = req.body;
        const od = await OnDuty.create({
            student: req.user._id,
            eventName, eventDate, organizer, description,
            initialBrochure: brochure
        });
        res.status(201).json(od);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOnDuty = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'student') query.student = req.user._id;
        else if (req.user.role === 'mentor' || req.user.role === 'hod') {
            const students = await User.find({ department: req.user.department }).select('_id');
            const studentIds = students.map(s => s._id);
            query.student = { $in: studentIds };
        }

        const ods = await OnDuty.find(query).populate('student', 'name regNo classId').sort({ createdAt: -1 });
        res.json(ods);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.actionOnDuty = async (req, res) => {
    try {
        const { action, reason } = req.body; // 'Approve', 'Reject'
        const od = await OnDuty.findById(req.params.id);
        if (!od) return res.status(404).json({ message: 'OD not found' });

        if (action === 'Approve') {
            // HOD can give Final Approval if already Pre-Approved
            if (req.user.role === 'hod' && od.status === 'Pre-Approved') {
                od.status = 'Approved';
                od.hodComment = 'Final Approval by HOD';
            } else {
                od.status = 'Pre-Approved';
                od.mentorComment = 'Pre-Approved by Faculty';
            }
        } else {
            od.status = 'Rejected';
            od.mentorComment = reason || 'Rejected';
        }
        await od.save();
        res.json(od);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.uploadCertificate = async (req, res) => {
    try {
        const { certificate } = req.body;
        const od = await OnDuty.findById(req.params.id);
        if (!od) return res.status(404).json({ message: 'OD not found' });

        od.completionCertificate = certificate;
        od.status = 'Proof-Submitted';
        await od.save();
        res.json(od);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.verifyCertificate = async (req, res) => {
    try {
        const od = await OnDuty.findById(req.params.id);
        if (!od) return res.status(404).json({ message: 'OD not found' });

        od.status = 'Fully-Verified';
        od.verifiedBy = req.user._id;
        await od.save();
        res.json(od);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- ANNOUNCEMENT CONTROLLERS ---

exports.createAnnouncement = async (req, res) => {
    try {
        const item = await Announcement.create({ ...req.body, author: req.user._id });
        res.status(201).json(item);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getAnnouncements = async (req, res) => {
    try {
        const items = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// --- ACADEMIC STATS ---

// Quick Calc Helper
const calculateSafeZone = (totalClasses, attended) => {
    const currentPct = (attended / totalClasses) * 100;
    const required = 75;
    if (currentPct >= required) return { status: 'Safe', message: 'You are in the safe zone.' };

    // How many more needed?
    // (attended + x) / (total + x) = 0.75
    // attended + x = 0.75 * total + 0.75 * x
    // 0.25 * x = 0.75 * total - attended
    // x = (0.75 * total - attended) / 0.25
    let needed = Math.ceil((0.75 * totalClasses - attended) / 0.25);
    return { status: 'Danger', message: `Attend next ${needed} classes to hit 75%.` };
};

exports.getAcademicStats = async (req, res) => {
    try {
        // Mock data or fetch from Academic model if populated
        // For demo, we return a standard structure
        const stats = {
            attendance: { total: 120, present: 85, percentage: 70 },
            safeZone: calculateSafeZone(120, 85),
            marks: [
                { subject: 'Cloud Computing', cat1: 85, cat2: 90, model: null },
                { subject: 'Compiler Design', cat1: 72, cat2: 68, model: null }
            ]
        };
        res.json(stats);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
// --- ADVANCED REPORTS ---

exports.getAdvancedReport = async (req, res) => {
    try {
        const { classId, type, startDate, endDate } = req.query;

        let studentQuery = { role: 'student' };
        // Restrict to HOD Department
        if (req.user.department) studentQuery.department = req.user.department;

        // Specific Class
        if (classId && classId !== 'All') {
            studentQuery.classId = classId;
        }

        const students = await User.find(studentQuery).select('_id');
        const studentIds = students.map(s => s._id);

        let query = { student: { $in: studentIds } };

        // Date Range
        if (startDate && endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            const dateRange = { $gte: new Date(startDate), $lte: end };

            if (type === 'Attendance') query.date = dateRange;
            else if (type === 'Leave') query.startDate = dateRange;
            else if (type === 'OnDuty') query.eventDate = dateRange;
        }

        let data = [];
        if (type === 'Attendance') {
            // Assuming Attendance model is imported at the top of the file
            // If not, you would need to add: const Attendance = require('../models/Attendance');
            data = await Attendance.find(query).populate('student', 'name regNo classId').sort({ date: -1 });
        } else if (type === 'Leave') {
            // Assuming Leave model is imported at the top of the file
            // If not, you would need to add: const Leave = require('../models/Leave');
            data = await Leave.find(query).populate('student', 'name regNo classId').sort({ startDate: -1 });
        } else if (type === 'OnDuty') {
            data = await OnDuty.find(query).populate('student', 'name regNo classId').sort({ eventDate: -1 });
        }

        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getCommunicationLogs = async (req, res) => {
    try {
        const logs = await CommunicationLog.find()
            .populate('student', 'name regNo classId')
            .sort({ sentAt: -1 })
            .limit(50);
        res.json(logs);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

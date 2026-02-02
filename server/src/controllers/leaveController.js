const Leave = require('../models/Leave');
const User = require('../models/User');
const { calculateRisk } = require('../utils/aiRiskEngine');

const DAILY_OD_LIMIT = 20;

// @desc    Apply for new leave
// @route   POST /api/leaves
// @access  Private (Student)
exports.applyLeave = async (req, res) => {
    const { leaveType, reason, startDate, endDate, isFreeRun, odProof } = req.body;

    // Calculate total days (simplified logic)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include start date

    if (totalDays <= 0) {
        return res.status(400).json({ message: 'End date must be after start date' });
    }

    try {
        // AI Risk Analysis
        const history = await Leave.find({ student: req.user._id }).sort({ createdAt: -1 });
        const riskAnalysis = calculateRisk(history, { startDate, reason });

        const leave = await Leave.create({
            student: req.user._id,
            leaveType,
            reason,
            startDate,
            endDate,
            totalDays,
            isFreeRun: isFreeRun || false,
            odProof,
            status: 'Pending',
            riskScore: riskAnalysis.score,
            riskLevel: riskAnalysis.level,
            riskFactors: riskAnalysis.factors
        });

        res.status(201).json(leave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get logged in student's leaves
// @route   GET /api/leaves
// @access  Private (Student)
exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get leaves for staff (Pending by default, or filtered)
// @route   GET /api/leaves/pending
// @access  Private (Staff)
exports.getPendingLeaves = async (req, res) => {
    try {
        let query = {};

        // Status Filter
        if (req.query.status && req.query.status !== 'All') {
            query.status = req.query.status;
        } else if (!req.query.status) {
            query.status = 'Pending'; // Default to Pending if not specified
        }
        // If status='All', we don't set query.status, so it fetches all.

        if (req.user.role === 'coordinator' && req.user.classId) {
            const classStudents = await User.find({
                classId: req.user.classId,
                role: 'student'
            }).select('_id');
            query.student = { $in: classStudents };
        }

        // If HOD, filter by Department (This part is now for initial pending, not 'Faculty Approved')
        if (req.user.role === 'hod' && req.user.department) {
            const deptStudents = await User.find({
                department: req.user.department,
                role: 'student'
            }).select('_id');
            query.student = { $in: deptStudents };
        }

        const leaves = await Leave.find(query)
            .populate('student', 'name email rollNo department classId')
            .sort({ createdAt: 1 });

        res.json(leaves);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Approve or Reject leave
// @route   PUT /api/leaves/:id/action
// @access  Private (Staff)
exports.approveLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;
        const leave = await Leave.findById(id).populate('student');

        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        // --- OD LIMIT CHECK ---
        if (leave.leaveType === 'On-Duty' && status === 'Approved') {
            const start = new Date(leave.startDate);
            const startOfDay = new Date(start.setHours(0, 0, 0, 0));
            const endOfDay = new Date(start.setHours(23, 59, 59, 999));

            // Count existing APPROVED ODs for this class on this day
            const odCount = await Leave.countDocuments({
                _id: { $ne: leave._id }, // Exclude current leave from count
                leaveType: 'On-Duty',
                'student.classId': leave.student.classId,
                status: 'Approved',
                startDate: { $gte: startOfDay, $lte: endOfDay }
            });

            if (odCount >= DAILY_OD_LIMIT) {
                return res.status(400).json({ message: `Daily OD Limit (${DAILY_OD_LIMIT}) reached for this class. Cannot approve.` });
            }
        }

        if (req.user.role === 'hod') {
            leave.hodStatus = status; // Approved or Rejected
            leave.status = status; // Final Status
            leave.hodActionBy = req.user._id;
            leave.remarks = remarks || leave.remarks;
        }
        else if (req.user.role === 'mentor' || req.user.role === 'faculty') { // Mentor
            // --- FREE RUN LOGIC ---
            if (leave.isFreeRun && status === 'Approved') {
                leave.status = 'Approved'; // Finalize immediately
                leave.hodStatus = 'Approved'; // Auto-approve HOD step
                leave.remarks = remarks ? `${leave.remarks || ''} [Free Run Approved by Mentor]` : leave.remarks;
            } else {
                if (status === 'Approved') {
                    leave.status = 'Faculty Approved'; // Move to HOD
                    leave.hodStatus = 'Pending';
                } else {
                    leave.status = 'Rejected';
                }
                leave.remarks = remarks || leave.remarks;
            }
            leave.facultyActionBy = req.user._id;
        }

        await leave.save();
        res.json(leave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Resend/Update a rejected leave
// @route   PUT /api/leaves/:id/resend
// @access  Private (Student)
exports.resendLeave = async (req, res) => {
    const { reason, startDate, endDate } = req.body;

    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        if (leave.student.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update fields
        if (startDate) leave.startDate = startDate;
        if (endDate) leave.endDate = endDate;
        if (reason) leave.reason = reason;

        // Recalculate days if dates changed
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const timeDiff = end.getTime() - start.getTime();
            leave.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        }

        // Reset status to Pending for Mentor review
        leave.status = 'Pending';
        leave.hodStatus = 'Pending';
        leave.facultyActionBy = undefined;
        leave.hodActionBy = undefined;

        await leave.save();
        res.json(leave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

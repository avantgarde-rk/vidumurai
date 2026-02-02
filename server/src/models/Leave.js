const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['Sick', 'Casual', 'On-Duty', 'Emergency', 'Other'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalDays: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Faculty Approved', 'Approved', 'Rejected'], // 'Approved' means Final/HOD Approved
        default: 'Pending'
    },
    hodStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    facultyActionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hodActionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: {
        type: String
    },
    documents: [
        { type: String } // URLs to uploaded medical certs etc
    ],
    odProof: {
        type: String, // URL/Path to initial proof for On-Duty (Event registration etc)
    },
    attendanceProof: {
        type: String, // URL/Path to final proof (Certificate/Selfie at event)
    },
    attendanceProof: {
        type: String, // URL/Path to final proof (Certificate/Selfie at event)
    },
    isOdCompleted: {
        type: Boolean,
        default: false
    },
    isFreeRun: {
        type: Boolean,
        default: false // If true, skips HOD approval
    },
    // AI Risk Analysis
    riskScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low' },
    riskFactors: [{ type: String }]
}, {
    timestamps: true
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;

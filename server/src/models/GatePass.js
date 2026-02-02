const mongoose = require('mongoose');

const gatePassSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Local', 'Outstation', 'Emergency'], required: true },
    reason: { type: String, required: true },
    destination: { type: String, required: true },
    expectedOutTime: { type: Date, required: true },
    expectedInTime: { type: Date, required: true },

    // Approval Workflow
    status: {
        type: String,
        enum: ['Pending', 'Pending Mentor Approval', 'Pending HOD Approval', 'Approved', 'Rejected', 'Active', 'Used', 'Expired'],
        default: 'Pending Mentor Approval'
    },

    // Mentor Level
    mentorApproved: { type: Boolean, default: false },
    mentorActionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mentorActionAt: { type: Date },

    // HOD Level
    hodApproved: { type: Boolean, default: false },
    hodActionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    hodActionAt: { type: Date },

    rejectionReason: { type: String },

    // Gate Logic
    qrCodeString: { type: String },
    actualOutTime: { type: Date },
    actualInTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('GatePass', gatePassSchema);

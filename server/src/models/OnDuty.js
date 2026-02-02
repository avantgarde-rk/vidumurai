const mongoose = require('mongoose');

const onDutySchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    organizer: { type: String, required: true }, // e.g. IIT Madras
    description: { type: String },

    // Proofs
    initialBrochure: { type: String }, // URL/Base64
    completionCertificate: { type: String }, // URL/Base64 to close the OD

    // Status
    status: {
        type: String,
        enum: ['Pending', 'Pre-Approved', 'Rejected', 'Proof-Submitted', 'Fully-Verified'],
        default: 'Pending'
    },
    mentorComment: { type: String },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('OnDuty', onDutySchema);

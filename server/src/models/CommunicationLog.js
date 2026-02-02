const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientMobile: { type: String, required: true },
    recipientName: { type: String, default: 'Parent' },
    message: { type: String, required: true },
    type: { type: String, enum: ['Absence Alert', 'Gate Pass', 'Emergency', 'General'], required: true },
    status: { type: String, enum: ['Sent', 'Delivered', 'Failed'], default: 'Sent' },
    sentAt: { type: Date, default: Date.now },
    serviceId: { type: String } // Message ID from Twilio/Provider if real
}, { timestamps: true });

module.exports = mongoose.model('CommunicationLog', logSchema);

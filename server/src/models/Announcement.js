const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ['Normal', 'High', 'Emergency'], default: 'Normal' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Principal/Admin
    audience: { type: String, enum: ['All', 'Students', 'Faculty', 'Class'], default: 'All' },
    targetClass: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);

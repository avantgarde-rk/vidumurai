const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        required: true,
        default: 'Present'
    },
    markedBy: { // 'System' (WiFi) or 'Manual' (Staff)
        type: String,
        default: 'System'
    },
    deviceId: {
        type: String
    },
    locationIP: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index to ensure one record per student per day
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;

const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    // Attendance Stats (Aggregated)
    overallAttendance: { type: Number, default: 0 }, // percentage
    daysPresent: { type: Number, default: 0 },
    daysAbsent: { type: Number, default: 0 },
    daysOD: { type: Number, default: 0 }, // On Duty counts as present often, but tracked separately

    // Marks (Internal Assessments)
    assessments: [{
        examName: { type: String }, // CAT-1, CAT-2, Model
        subjects: [{
            subjectName: { type: String },
            subjectCode: { type: String },
            marksObtained: { type: Number },
            maxMarks: { type: Number, default: 100 }
        }]
    }],

    cgpa: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Academic', academicSchema);

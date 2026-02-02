const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'mentor', 'coordinator', 'hod', 'admin'],
        default: 'student'
    },
    department: {
        type: String,
        required: false
    },
    classId: { // e.g., "CSE-A"
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    parentMobile: {
        type: String,
        required: false,
        default: '' // Critical for automated parent alerts
    },
    profilePic: {
        type: String,
        default: ''
    },
    // For students:
    // Identity
    regNo: { type: String, unique: true, sparse: true },

    // For students:
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    semester: { type: Number, default: 1 },

    // Profile Management
    profileLocked: { type: Boolean, default: true }, // Once set, needs approval
    profileUpdateRequest: { type: Object, default: null }, // Store pending changes here

    // For faculty:
    classesManaged: [{ type: String }], // Array of class IDs they manage

    // Stats (Mock for now, could be calculated)
    academicStats: {
        semAttendance: { type: Number, default: 0 },
        cat1Attendance: { type: Number, default: 0 },
        cat2Attendance: { type: Number, default: 0 },
        cat3Attendance: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Encrypt password before save
// Encrypt password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., IV-CSE-A
    department: { type: String, required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Class', classSchema);

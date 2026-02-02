const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceHistory, getAllAttendance, markAbsent } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/mark', protect, authorize('student'), markAttendance);
router.post('/absent', protect, authorize('mentor', 'coordinator', 'hod'), markAbsent);
router.get('/me', protect, authorize('student'), getAttendanceHistory);
router.get('/', protect, authorize('mentor', 'coordinator', 'hod', 'admin'), getAllAttendance);

module.exports = router;

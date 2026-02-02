const express = require('express');
const router = express.Router();
const { submitProfileRequest, getProfileRequests, actionProfileRequest, createStudent, createClass, getClasses, getClassStudents, getDepartmentStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkDemoMode } = require('../middleware/demoMiddleware');

router.post('/class', protect, checkDemoMode, authorize('mentor', 'admin', 'hod'), createClass); // Added HOD
router.get('/classes', protect, authorize('mentor', 'admin', 'hod'), getClasses); // New
router.get('/class/:classId/students', protect, authorize('mentor', 'admin', 'hod'), getClassStudents); // New
router.get('/stats/department', protect, authorize('hod'), getDepartmentStats); // New
router.post('/student', protect, checkDemoMode, authorize('mentor', 'admin', 'hod'), createStudent); // Added HOD

// Profile Requests
router.post('/profile-request', protect, checkDemoMode, authorize('student'), submitProfileRequest);
router.get('/profile-requests', protect, authorize('mentor', 'admin', 'hod'), getProfileRequests);
router.put('/profile-requests/:id', protect, checkDemoMode, authorize('mentor', 'admin', 'hod'), actionProfileRequest);

module.exports = router;

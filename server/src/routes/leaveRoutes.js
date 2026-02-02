const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getPendingLeaves, approveLeave } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkDemoMode } = require('../middleware/demoMiddleware');

router.post('/', protect, checkDemoMode, authorize('student'), applyLeave);
router.get('/', protect, authorize('student'), getMyLeaves);
router.put('/:id/resend', protect, authorize('student'), checkDemoMode, require('../controllers/leaveController').resendLeave);

router.get('/pending', protect, authorize('mentor', 'coordinator', 'hod', 'admin'), getPendingLeaves);
router.put('/:id/action', protect, checkDemoMode, authorize('mentor', 'coordinator', 'hod'), approveLeave);

module.exports = router;

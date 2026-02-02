const express = require('express');
const router = express.Router();
const {
    requestGatePass, getGatePasses, actionGatePass, verifyGatePass,
    applyOnDuty, getOnDuty, actionOnDuty, uploadCertificate, verifyCertificate,
    createAnnouncement, getAnnouncements,
    getAcademicStats, getAdvancedReport, getCommunicationLogs
} = require('../controllers/featureController'); // Updated import
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkDemoMode } = require('../middleware/demoMiddleware');

// Gate Pass
router.post('/gatepass/verify', verifyGatePass); // Public for scanner simulation or add protect
router.post('/gatepass', protect, checkDemoMode, requestGatePass);
router.get('/gatepass', protect, getGatePasses);
router.put('/gatepass/:id', protect, checkDemoMode, authorize('mentor', 'hod', 'warden'), actionGatePass);

// On Duty
router.post('/od', protect, checkDemoMode, applyOnDuty);
router.get('/od', protect, getOnDuty);
router.put('/od/:id/action', protect, checkDemoMode, authorize('mentor', 'hod'), actionOnDuty);
router.put('/od/:id/certificate', protect, checkDemoMode, uploadCertificate);
router.put('/od/:id/verify', protect, checkDemoMode, authorize('mentor', 'hod'), verifyCertificate);

// Announcements
router.post('/announcements', protect, checkDemoMode, authorize('admin', 'hod', 'principal'), createAnnouncement);
router.get('/announcements', protect, getAnnouncements);

// Academics
router.get('/academics', protect, getAcademicStats);

// Advanced Reports
router.get('/reports/advanced', protect, authorize('hod', 'admin'), getAdvancedReport);
router.get('/reports/logs', protect, authorize('admin', 'principal'), getCommunicationLogs); // New Log Viewer

module.exports = router;

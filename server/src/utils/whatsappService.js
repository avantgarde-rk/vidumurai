
const CommunicationLog = require('../models/CommunicationLog');

/**
 * Mock WhatsApp Service
 * In production, this would use Twilio / Meta Graph API
 */
const sendWhatsApp = async (studentId, parentMobile, message, type = 'General') => {
    try {
        // Simulate API Call Delay
        // await new Promise(r => setTimeout(r, 500)); 

        const log = await CommunicationLog.create({
            student: studentId,
            recipientMobile: parentMobile,
            message: message,
            type: type,
            status: 'Sent', // Simulate success
            serviceId: `WA-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        });

        console.log(`[WhatsApp Mock] To: ${parentMobile} | Msg: ${message}`);
        return { success: true, log };
    } catch (err) {
        console.error('WhatsApp Service Error:', err);
        return { success: false, error: err.message };
    }
};

module.exports = { sendWhatsApp };

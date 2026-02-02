const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // Check if email creds are present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[Mock Email] To: ${to}, Subject: ${subject}, Body: ${text}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"Vidumurai System" <no-reply@vidumurai.edu>',
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to ' + to);
    } catch (error) {
        console.error('Email sending failed:', error);
    }
};

module.exports = sendEmail;

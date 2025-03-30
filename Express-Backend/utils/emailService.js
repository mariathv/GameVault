// emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_APP_PASSWORD,
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to,
        subject,
        text
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };

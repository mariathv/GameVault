const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_APP_PASSWORD,
    }
});

const sendMail = (to, subject, content, isHtml = false) => {
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to,
        subject,
    };

    if (isHtml) {
        mailOptions.html = content;
    } else {
        mailOptions.text = content;
    }

    return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };

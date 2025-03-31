const { sendMail } = require('../utils/emailService');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

const mailController = {
    purchaseConfirmation: async (req, res) => {
        const { email, gameKey } = req.body;

        try {
            const templatePath = path.join(__dirname, '../templates/purchase-confirmation.html');
            const templateContent = await fs.readFile(templatePath, 'utf8');

            const template = handlebars.compile(templateContent);
            const htmlContent = template({ email, gameKey });

            await sendMail(email, "Purchase Confirmation", htmlContent, true);
            res.status(200).send('Purchase confirmation email sent!');
        } catch (error) {
            res.status(500).send('Failed to send email');
        }
    },

    forgotPassword: async (req, res) => {
        const { email, resetLink } = req.body;

        try {
            const templatePath = path.join(__dirname, '../templates/forgot-pass.html');
            const templateContent = await fs.readFile(templatePath, 'utf8');

            const template = handlebars.compile(templateContent);
            const htmlContent = template({ email, resetLink });

            await sendMail(email, 'Password Reset', htmlContent, true);

            res.status(200).send('Password reset email sent!');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            res.status(500).send('Failed to send email');
        }
    },
}

module.exports = mailController;
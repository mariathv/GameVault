const { sendMail } = require('../utils/emailService');
const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');

const mailController = {
    purchaseConfirmation: async (email, games, orderID) => {
        try {
            const templatePath = path.join(__dirname, '../templates/purchase-confirmation.html');
            const templateContent = await fs.readFile(templatePath, 'utf8');
            const template = handlebars.compile(templateContent);

            const gameDetails = games.map((game) => ({
                title: game.title,
                gameKeys: game.gameKeys.join(', ')
            }));

            const htmlContent = template({ email, games: gameDetails, orderID });

            await sendMail(email, 'Purchase Confirmation', htmlContent, true);
            console.log('Purchase confirmation email sent!');
        } catch (error) {
            console.error('Failed to send email:', error?.response?.data || error.message);
            throw error;
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
    sendVerificationEmail: async (email, token) => {
        try {
            const verificationLink = `${process.env.CLIENT_URL}/auth/verify-email/${token}`;

            const templatePath = path.join(__dirname, '../templates/email-verify.html');
            const templateContent = await fs.readFile(templatePath, 'utf8');
            const template = handlebars.compile(templateContent);

            const htmlContent = template({ email, verificationLink });

            await sendMail(email, 'Verify your email', htmlContent, true);

            console.log('Verification email sent!');
        } catch (error) {
            console.error('Failed to send verification email:', error?.response?.data || error.message);
            throw error;
        }
    },
    send2FACode: async (email, code) => {
        try {
            const templatePath = path.join(__dirname, '../templates/2fa-code.html');
            const templateContent = await fs.readFile(templatePath, 'utf8');
            const template = handlebars.compile(templateContent);

            const htmlContent = template({ code });

            await sendMail(email, 'Your Verification Code', htmlContent, true);

            console.log('2FA code email sent!');
            return true;
        } catch (error) {
            console.error('Failed to send 2FA email:', error?.response?.data || error.message);
            return false;
        }
    },
    sendRefundConfirmation: async (email, gameTitle, refundedKey, refundAmount) => {
        try {
            const templatePath = path.join(__dirname, '../templates/refund-confirmation.html');
            const templateContent = await fs.readFile(templatePath, 'utf8');
            const template = handlebars.compile(templateContent);
    
            const htmlContent = template({ email, gameTitle, refundedKey, refundAmount });
    
            await sendMail(email, 'Your Refund Has Been Processed', htmlContent, true);
    
            console.log('Refund confirmation email sent!');
        } catch (error) {
            console.error('Failed to send refund email:', error?.response?.data || error.message);
            throw error;
        }
    },
    
    sendReplacementKey: async (email, gameTitle, oldKey, newKey) => {
        try {
            const templatePath = path.join(__dirname, '../templates/replacement-key.html');
            const templateContent = await fs.readFile(templatePath, 'utf8');
            const template = handlebars.compile(templateContent);
    
            const htmlContent = template({ email, gameTitle, oldKey, newKey });
    
            await sendMail(email, 'Your Replacement Game Key', htmlContent, true);
    
            console.log('Replacement key email sent!');
        } catch (error) {
            console.error('Failed to send replacement key email:', error?.response?.data || error.message);
            throw error;
        }
    }
    



}

module.exports = mailController;
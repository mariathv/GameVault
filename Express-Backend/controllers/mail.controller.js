
const { sendMail } = require('../utils/emailService');

const mailController = {
    purchaseConfirmation: async (req, res) => {
        const { email, gameKey } = req.body;


        try {
            await sendMail(email, 'Purchase Confirmation', `Thanks for your purchase! Your game key is: ${gameKey}`);
            res.status(200).send('Purchase confirmation email sent!');
        } catch (error) {
            res.status(500).send('Failed to send email');
        }
    },
    forgotPassword: async (req, res) => {
        const { email, resetLink } = req.body;

        try {
            await sendMail(email, 'Password Reset', `Reset your password here: ${resetLink}`);
            res.status(200).send('Password reset email sent!');
        } catch (error) {
            res.status(500).send('Failed to send email');
        }
    },

}

module.exports = mailController;
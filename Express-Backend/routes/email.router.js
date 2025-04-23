const express = require('express');

const router = express.Router();
const mailController = require("../controllers/mail.controller");
const { protect, restrictTo } = require('../controllers/auth.controller');

router.post('/forgot-password', mailController.forgotPassword);

router.post('/purchase-confirmation', protect, mailController.purchaseConfirmation);

router.get('/verify-email', mailController.sendVerificationEmail);

module.exports = router;

const express = require("express");
const router = express.Router();


const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/token-verify", authController.protect, authController.getMe);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/send-2fa-code', authController.send2FAuthCode);
router.post('/verify-2fa', authController.verify2FA);
router.post('/toggle-2fa', authController.protect, authController.toggle2FA);
router.patch("/update-profile", authController.protect, authController.updateProfile)
router.patch("/change-password", authController.protect, authController.changePassword)

module.exports = router;
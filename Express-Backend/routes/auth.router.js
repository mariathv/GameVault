const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/token-verify", authController.protect, authController.getMe);
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;
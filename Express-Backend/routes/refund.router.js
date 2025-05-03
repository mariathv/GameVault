const { protect, restrictTo } = require('../controllers/auth.controller');

const express = require("express");
const router = express.Router();

const refundController = require("../controllers/refund.controller");

router.post("/process", protect, restrictTo("admin"), refundController.processRefund);
router.post("/replace", protect, restrictTo("admin"), refundController.replaceGameKey);

module.exports = router;

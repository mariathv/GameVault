const { protect, restrictTo } = require('../controllers/auth.controller');

const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");

router.post("/create-order/", protect, orderController.createOrder);

module.exports = router;
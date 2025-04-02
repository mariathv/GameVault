const { protect, restrictTo } = require('../controllers/auth.controller');

const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");

router.post("/create-order/", protect, orderController.createOrder);
router.get("/get-all-orders", protect, restrictTo("admin"), orderController.getAllOrders);

module.exports = router;
const { protect, restrictTo } = require('../controllers/auth.controller');

const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");

router.post("/create-order/", protect, orderController.createOrder);
router.get("/get-all-orders", protect, restrictTo("admin"), orderController.getAllOrders);
router.get("/getRecentOrders", protect, restrictTo("admin"), orderController.getRecentOrders);
router.get("/getCount", protect, restrictTo("admin"), orderController.getGameSaleCount);
router.get("/getWeeklySale", protect, restrictTo("admin"), orderController.getWeeklySalesOverview);
router.get("/revenue", protect, restrictTo("admin"), orderController.getTotalRevenue);
router.get('/details/:orderId', protect, restrictTo("admin"), orderController.getOrderDetails)

module.exports = router;
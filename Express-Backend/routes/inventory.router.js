const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const authController = require('../controllers/auth.controller');
const Order = require('../models/order'); // Import Order model for debug route

// Debug endpoint - no auth required to help with troubleshooting
router.get('/debug/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId });

    res.status(200).json({
      success: true,
      message: 'Debug endpoint',
      rawOrders: orders,
      inventory: orders.map(order => ({
        orderId: order._id,
        transactionId: order.paymentInfo?.transactionId || '',
        purchaseDate: order.createdAt,
        totalAmount: order.totalAmount || 0,
        games: (order.games || []).map(game => ({
          gameId: game.gameId,
          title: game.title,
          cover_url: game.cover_url,
          price: game.price,
        }))
      }))
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  }
});

// New enhanced debug endpoint with more diagnostics
router.get('/debug-full/:userId', inventoryController.debugUserInventory);

// Get all inventory without userId - useful for testing
router.get('/', inventoryController.getAllInventory);

// Get detailed information about a specific order (more specific route first)
router.get('/order/:orderId', authController.protect, inventoryController.getOrderDetails);

// Get all purchases for a user (more general route after)
router.get('/:userId', authController.protect, inventoryController.getUserInventory);

module.exports = router;
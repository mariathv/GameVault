const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/auth.controller');
const paymentController = require('../controllers/payment.controller');

// Customer management routes
router.post('/customers', protect, paymentController.createCustomer);
router.get('/customers/:customerId', protect, paymentController.getCustomer);

// Card management routes
router.post('/cards', protect, paymentController.saveCard);
router.get('/customers/:customerId/cards', protect, paymentController.getCustomerCards);
router.delete('/cards/:cardId', protect, paymentController.deleteCard);

// Payment processing routes
router.post('/process', protect, paymentController.processPayment);
router.get('/payments/:paymentId', protect, paymentController.getPayment);

module.exports = router;
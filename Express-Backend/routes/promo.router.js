const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promo.controller');
const { protect, restrictTo } = require('../controllers/auth.controller');

router.post('/apply', protect, promoController.applyPromo);

router.post('/create', protect, restrictTo('admin'), promoController.createPromo);
router.delete('/:id', protect, restrictTo('admin'), promoController.deletePromo);
router.get('/', protect, restrictTo('admin'), promoController.getAllPromos);
router.get('/:id', protect, restrictTo('admin'), promoController.getPromoById);

module.exports = router;

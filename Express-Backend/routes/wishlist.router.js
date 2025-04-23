const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { protect, restrictTo } = require('../controllers/auth.controller');

router.post('/add', protect, restrictTo("user"), wishlistController.addToWishlist);
router.post('/remove', protect, restrictTo("user"), wishlistController.removeFromWishlist);
router.get('/:userId', protect, restrictTo("user"), wishlistController.getWishlist);

module.exports = router;

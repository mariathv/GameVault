const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");

// Open routes
// (Your auth routes like signup/login would typically be in auth.router.js)

// Protected routes
router.use(authController.protect);

// Current user routes
router.get('/me', usersController.getMe, usersController.getUser);
router.patch('/updateMe', usersController.getMe, usersController.updateUser);
router.delete('/deleteMe', usersController.getMe, usersController.deleteUser);

// Get purchase history for current user (alternative to inventory route)
router.get('/purchases', usersController.getMe, usersController.getUserPurchaseHistory);

// Admin only routes
router.use(authController.restrictTo('admin'));
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUser);
router.patch('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
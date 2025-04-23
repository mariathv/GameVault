const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require('../controllers/auth.controller');

const usersController = require("../controllers/users.controller");

router.get("/count/", protect, restrictTo("admin"), usersController.getUsersCount);



module.exports = router;
const { protect, restrictTo } = require('../controllers/auth.controller');

const express = require("express");
const router = express.Router();

const storeController = require("../controllers/store.controller");
const authController = require("../controllers/auth.controller");




router.post("/add-game/", protect, restrictTo("admin"), storeController.addGame);
router.post("/remove-game/", protect, restrictTo("admin"), storeController.removeGame);
router.post("/view-purchases/", protect, restrictTo("admin"), storeController.viewPurchases);
router.delete("/game/delete/", protect, restrictTo("admin"), storeController.removeGame);
router.post("/games/update/", protect, restrictTo("admin"), storeController.updateGame);
router.post("/set-featured/", protect, restrictTo("admin"), storeController.setFeaturedGame)



router.get("/games/search/", storeController.searchGame);
router.get("/games/get-all/", storeController.getAllGames);
router.get("/games/get/", storeController.getGame);
router.get("/get-featured/", storeController.getFeaturedGame);


module.exports = router;
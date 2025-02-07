const express = require("express");
const router = express.Router();

const storeController = require("../controllers/store.controller");

router.post("/add-game/", storeController.addGame);
router.post("/remove-game/", storeController.removeGame);
router.post("/view-purchases/", storeController.viewPurchases);
//testing routes only (below) will delete later
router.post("/delete-all-games/", storeController.removeAllGames);

module.exports = router;
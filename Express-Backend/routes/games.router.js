const express = require("express");
const router = express.Router();

const gamesController = require("../controllers/games.controller");

router.get("/search/name/", gamesController.searchByName);
router.get("/get/", gamesController.getGameInfoByID);
router.get("/get/multi/", gamesController.getGamesInfoByIDs);


module.exports = router;
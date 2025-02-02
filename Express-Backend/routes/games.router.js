const express = require("express");
const router = express.Router();

const gamesController = require("../controllers/games.controller");

router.get("/search/", gamesController.search);
router.get("/get/", gamesController.getGameInfo);

module.exports = router;
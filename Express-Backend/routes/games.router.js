const express = require("express");
const router = express.Router();

const gamesController = require("../controllers/games.controller");

router.get("/search/name/", gamesController.searchByName);
router.get("/get/", gamesController.getGameInfoByID);
router.get("/get/multi/", gamesController.getGamesInfoByIDs);
router.get("/get/artworks/", gamesController.getGameArtworks)
router.get("/get/screenshots/", gamesController.getGameScreenshots)
router.get("/get/genres/", gamesController.getGameGenres)
router.get("/get/videos/", gamesController.getGameVideos)
router.get("/get/companies/", gamesController.getInvolvedCompanies)
router.get("/get/devpubs/", gamesController.getDeveloperAndPublisher)
router.get("/get/themes", gamesController.getGameThemes);
router.get("/get/platforms", gamesController.getPlatformsByIds);
router.get("/get/release-dates", gamesController.getReleaseDatesByIds);

module.exports = router;
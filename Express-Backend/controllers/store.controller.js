// Refactored legacy MongoDB storeController to use Mongoose
const Store = require('../models/store');
const chalk = require("chalk");


const storeController = {
    addGame: async (req, res) => {
        const { newGame } = req.body;
        if (!newGame) {
            return res.status(400).json({ success: false, message: "New game data is missing!" });
        }

        try {
            const existingGame = await Store.findOne({ id: newGame.id });
            if (existingGame) {
                return res.status(409).json({
                    success: false,
                    message: `A game with id ${newGame.id} already exists.`,
                });
            }

            newGame.createdAt = new Date();

            const created = await Store.create(newGame);

            return res.status(200).json({
                success: true,
                message: "Game successfully added to store",
                gameId: created.id
            });

        } catch (error) {
            console.error("Error adding game:", error);
            return res.status(500).json({ success: false, message: "Failed to add game to store", error: error.message });
        }
    },

    updateGame: async (req, res) => {
        const { update } = req.body;
        if (!update) {
            return res.status(400).json({ success: false, message: "No update specified" });
        }
        const id = update.id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Missing game ID in update object" });
        }

        try {
            update.updatedAt = new Date();

            const result = await Store.findOneAndUpdate({ id: id }, update, { new: false });

            if (!result) {
                return res.status(404).json({ success: false, message: "Game not found" });
            }

            return res.status(200).json({ success: true, message: "Game updated successfully" });

        } catch (error) {
            console.error("Error updating game:", error);
            return res.status(500).json({ success: false, message: "Failed to update game in store", error: error.message });
        }
    },

    getGame: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ success: false, message: "No ID given!" });
        }
        const numericId = parseInt(id);

        try {
            const result = await Store.findOne({ id: numericId });
            if (result) {
                console.log(chalk.green(`[${new Date().toISOString()}] game data found`));
            } else {
                console.log(chalk.yellow(`[${new Date().toISOString()}] No game data found with id specified`));
            }
            return res.status(200).json({ success: true, gameData: result });
        } catch (error) {
            console.error("Error fetching game:", error);
            return res.status(500).json({ success: false, message: "Failed to fetch game from store" });
        }
    },

    removeGame: async (req, res) => {
        const { gameId } = req.body;
        if (!gameId) {
            return res.status(400).json({ success: false, message: "Game ID is missing!" });
        }

        try {
            const result = await Store.findOneAndDelete({ _id: gameId });
            if (!result) {
                return res.status(404).json({ success: false, message: "Game not found with the given ID." });
            }
            console.log(`Game with ID: ${gameId} removed successfully.`);
            return res.status(200).json({ success: true, message: "Game successfully removed from store" });
        } catch (error) {
            console.error("Error removing game:", error);
            return res.status(500).json({ success: false, message: "Failed to remove game from store", error: error.message });
        }
    },
    setFeaturedGame: async (req, res) => {
        const { gameId } = req.body;
        if (!gameId) {
            return res.status(400).json({ success: false, message: "Game ID is missing!" });
        }

        try {
            await Store.updateMany({}, { isFeatured: false });
            const updatedGame = await Store.findOneAndUpdate({ _id: gameId }, { isFeatured: true }, { new: true });

            if (!updatedGame) {
                return res.status(404).json({ success: false, message: "Game not found" });
            }
            console.log("set featured", gameId);
            return res.status(200).json({ success: true, message: "Game set as featured", game: updatedGame });
        } catch (error) {
            console.error("Error setting featured game:", error);
            return res.status(500).json({ success: false, message: "Failed to set featured game", error: error.message });
        }
    },
    addGameDiscount: async (req, res) => {
        const { gameId, discount } = req.body;

        if (!gameId) {
            return res.status(400).json({ success: false, message: "Game ID is missing!" });
        }

        try {
            const updatedGame = await Store.findOneAndUpdate(
                { _id: gameId },
                { isDiscount: true, discountPercentage: discount },
                { new: true }
            );

            if (!updatedGame) {
                return res.status(404).json({ success: false, message: "Game not found" });
            }

            console.log("Set discount successfully", gameId, "discount", discount);
            return res.status(200).json({ success: true, message: "Game discount added", game: updatedGame });
        } catch (error) {
            console.error("Error setting discount game:", error);
            return res.status(500).json({ success: false, message: "Failed to set discount game", error: error.message });
        }
    },
    getGameDiscount: async (req, res) => {
        try {
            const { gameId } = req.body;
            const game = await Store.findOne({ _id: gameId });

            if (!game) {
                return res.status(404).json({ success: false, message: "No game found" });
            }

            discount = game.discountPercentage || 0;

            return res.status(200).json({ success: true, message: "Discount retrieved", discount });


        } catch (error) {
            console.error("Error retrieving  game:", error);
            return res.status(500).json({ success: false, message: "Failed to retrieve  game", error: error.message });
        }
    },

    getFeaturedGame: async (req, res) => {
        try {
            const featuredGame = await Store.findOne({ isFeatured: true });

            if (!featuredGame) {
                return res.status(404).json({ success: false, message: "No featured game found" });
            }

            return res.status(200).json({ success: true, message: "Featured game retrieved", game: featuredGame });
        } catch (error) {
            console.error("Error retrieving featured game:", error);
            return res.status(500).json({ success: false, message: "Failed to retrieve featured game", error: error.message });
        }
    },
    getGameCount: async (req, res) => {
        try {
            const filter = {};

            if (req.query.genre) {
                const genreVal = parseInt(req.query.genre);
                filter.genres = { $in: [genreVal] };
            }

            if (req.query.theme) {
                const themesVal = parseInt(req.query.theme);
                filter.themes = { $in: [themesVal] };
            }

            const total = await Store.countDocuments(filter);

            return res.status(200).json({
                success: true,
                total
            });
        } catch (error) {
            console.error("Error getting game count:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to get game count."
            });
        }
    },

    getAllGames: async (req, res) => {
        try {
            // --- Sort logic ---
            const sortBy = req.query.sortBy;
            const sortField = sortBy ? { [sortBy]: -1 } : { createdAt: -1 };

            // --- Pagination logic ---
            const limit = Math.min(parseInt(req.query.limit) || 12, 100); // Max 100 items per page
            const page = Math.max(parseInt(req.query.page) || 1, 1);
            const skip = (page - 1) * limit;

            // --- Filter logic ---
            const filter = {};

            if (req.query.genre) {
                const genreVal = parseInt(req.query.genre);
                filter.genres = { $in: [genreVal] };
            }

            if (req.query.theme) {
                const themesVal = parseInt(req.query.theme);
                filter.themes = { $in: [themesVal] };
            }

            // --- Fetch games + total count ---
            const [games, total] = await Promise.all([
                Store.find(filter)
                    .sort(sortField)
                    .skip(skip)
                    .limit(limit),
                Store.countDocuments(filter)
            ]);

            // --- If no games found ---
            if (games.length === 0) {
                return res.status(200).json({
                    success: true,
                    games: [],
                    total,
                    page,
                    pages: 0,
                    message: "No games found."
                });
            }

            // --- Success response with metadata ---
            return res.status(200).json({
                success: true,
                games,
                total,
                page,
                pages: Math.ceil(total / limit)
            });

        } catch (error) {
            console.error("Error fetching games:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch games."
            });
        }
    },
    searchGame: async (req, res) => {
        try {
            const rawQuery = (req.query.q || "").trim();
            const searchQuery = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex
            const sortBy = req.query.sortBy;
            const sortField = sortBy ? { [sortBy]: -1 } : { createdAt: -1 };
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;

            console.log("[DEBUG] search query:", req.query.q);

            const filter = { name: { $regex: searchQuery, $options: "i" } };



            const games = await Store.find(filter)
                .sort(sortField)
                .skip(skip)
                .limit(limit);

            if (games.length === 0) {
                return res.status(200).json({ success: true, games: [], message: "No matching games found." });
            }

            return res.status(200).json({ success: true, games });
        } catch (error) {
            console.error("Error searching games:", error);
            return res.status(500).json({ success: false, message: "Failed to search games." });
        }
    },

    removeAllGames: async (req, res) => {
        try {
            const result = await Store.deleteMany({});
            console.log("All games deleted.");
            return res.status(200).json({ success: true, message: "Collection successfully deleted." });
        } catch (error) {
            console.error("Error deleting collection:", error);
            return res.status(400).json({ success: false, message: "Failed to delete collection." });
        }
    },

    viewPurchases: async (req, res) => {
        // Placeholder
        return res.status(200).json({ success: true, message: "No purchase data available." });
    },

};

module.exports = storeController;



/*
 31 -> adventure
 12 -> RPG
 15 -> strategy
 14 -> sport
 10 -> racing
 13 -> simulator
 32 -> indie
*/

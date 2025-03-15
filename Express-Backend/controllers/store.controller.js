const { connectToMongo } = require('../database/index');
const { ObjectId } = require('mongodb');
const chalk = require("chalk"); // Import chalk

async function getNextGameId(db) {
    const countersCollection = db.collection("counters");

    const counterDoc = await countersCollection.findOneAndUpdate(
        { _id: "gameId" },
        { $inc: { sequence_value: 1 } },
        { returnDocument: "after", upsert: true }
    );

    console.log("Counter document:", counterDoc); // Debugging line

    // ✅ Fix: Access counterDoc directly instead of counterDoc.value
    if (!counterDoc || (!counterDoc.value && !counterDoc.sequence_value)) {
        throw new Error("Counter document missing or not updated properly!");
    }

    return counterDoc.value?.sequence_value || counterDoc.sequence_value;
}




const storeController = {
    addGame: async (req, res) => {
        const { newGame } = req.body;

        if (!newGame) {
            return res.status(400).json({ success: false, message: "New game data is missing!" });
        }

        try {

            console.log("add game ");
            const client = await connectToMongo();
            const database = client.db("game-vault");
            const storeCollection = database.collection("StoreGames");

            const existingGame = await storeCollection.findOne({ id: newGame.id });

            if (existingGame) {
                return res.status(409).json({
                    success: false,
                    message: `A game with id ${customGameId} already exists.`,
                });
            }


            const customGameId = await getNextGameId(database);
            newGame._id = customGameId;

            newGame.createdAt = new Date();

            const result = await storeCollection.insertOne(newGame);
            console.log(`New game added with custom ID: ${customGameId}`);

            return res.status(200).json({
                success: true,
                message: "Game successfully added to store",
                gameId: customGameId
            });

        } catch (error) {
            console.error("Error adding game:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to add game to store",
                error: error.message
            });
        }
    },

    updateGame: async (req, res) => {
        const { update } = req.body;

        if (!update) {
            console.log("Error: No update specified");
            return res.status(400).json({ success: false, message: "No update specified" });
        }

        let id = update._id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Missing game ID in update object" });
        }

        try {
            const client = await connectToMongo();
            const database = client.db("game-vault");
            const storeCollection = database.collection("StoreGames");

            update.updatedAt = new Date();

            const result = await storeCollection.replaceOne({ _id: id }, update);

            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Game not found" });
            }

            return res.status(200).json({
                success: true,
                message: "Game updated successfully"
            });

        } catch (error) {
            console.error("Error updating game:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to update game in store",
                error: error.message
            });
        }
    },


    getGame: async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ success: false, message: "No ID given!" });
        }
        const numericId = parseInt(id, 10);


        try {
            const client = await connectToMongo();
            const database = client.db("game-vault");
            const storeCollection = database.collection("StoreGames");

            const result = await storeCollection.findOne({ id: numericId });

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
            const client = await connectToMongo();
            const database = client.db("game-vault");
            const storeCollection = database.collection("StoreGames");

            console.log("delete", gameId);

            const result = await storeCollection.deleteOne({ _id: gameId });

            if (result.deletedCount === 0) {
                return res.status(404).json({ success: false, message: "Game not found with the given ID." });
            }

            console.log(`Game with ID: ${gameId} removed successfully.`);
            return res.status(200).json({ success: true, message: "Game successfully removed from store" });

        } catch (error) {
            console.error("Error removing game:", error);
            return res.status(500).json({ success: false, message: "Failed to remove game from store", error: error.message });
        }
    },

    viewPurchases: async (req, res) => {
        //someone else???

    },
    //dangerOUS functions (for testing only plsplspls)
    removeAllGames: async (req, res) => {
        try {
            const client = await connectToMongo();
            const database = client.db("game-vault");
            const storeCollection = database.collection("StoreGames");

            const result = await storeCollection.drop();
            if (result) {
                console.log("Collection deleted successfully.");
                return res.status(200).json({ success: true, message: "Collection successfully deleted." });
            }
        } catch (error) {
            console.error("Error deleting collection:", error);
            return res.status(400).json({ success: false, message: "Failed to delete collection." });
        }
    },

    getAllGames: async (req, res) => {
        try {
            const client = await connectToMongo();
            const database = client.db("game-vault");
            const storeCollection = database.collection("StoreGames");
            const sortBy = req.query.sortBy;
            const sortField = sortBy ? { [sortBy]: -1 } : { createdAt: -1 };

            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;

            const games = await storeCollection
                .find()
                .sort(sortField)
                .skip(skip)
                .limit(limit)
                .toArray();

            if (games.length === 0) {
                return res.status(200).json({ success: true, games: [], message: "No games found." });
            }

            return res.status(200).json({ success: true, games });
        } catch (error) {
            console.error("Error fetching games:", error);
            return res.status(500).json({ success: false, message: "Failed to fetch games." });
        }
    },

    searchGame: async (req, res) => {
        try {
            const client = await connectToMongo();
            const database = client.db("game-vault");
            const storeCollection = database.collection("StoreGames");

            const searchQuery = req.query.q || ""; // search term
            const sortBy = req.query.sortBy;
            const sortField = sortBy ? { [sortBy]: -1 } : { createdAt: -1 };

            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;

            // 🔍 Case-insensitive search on "name" field using regex
            const filter = {
                name: { $regex: searchQuery, $options: "i" },
            };

            const games = await storeCollection
                .find(filter)
                .sort(sortField)
                .skip(skip)
                .limit(limit)
                .toArray();

            if (games.length === 0) {
                return res.status(200).json({
                    success: true,
                    games: [],
                    message: "No matching games found.",
                });
            }

            return res.status(200).json({ success: true, games });
        } catch (error) {
            console.error("Error searching games:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to search games.",
            });
        }
    },





};

module.exports = storeController;
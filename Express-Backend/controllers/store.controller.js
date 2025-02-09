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
            const client = await connectToMongo();
            const database = client.db("game-vault");
            const storeCollection = database.collection("StoreGames");

            const customGameId = await getNextGameId(database);

            newGame._id = customGameId;

            const result = await storeCollection.insertOne(newGame);
            console.log(`New game added with custom ID: ${customGameId}`);

            return res.status(200).json({ success: true, message: "Game successfully added to store", gameId: customGameId });

        } catch (error) {
            console.error("Error adding game:", error);
            return res.status(500).json({ success: false, message: "Failed to add game to store", error: error.message });
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
        //someone else???
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

};

module.exports = storeController;
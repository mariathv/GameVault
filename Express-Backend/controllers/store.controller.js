const { connectToMongo, closeMongoConnection } = require('../database/index');


const storeController = {
    addGame: async (req, res) => {
        const { newGame } = req.body;
        try {
            const client = await connectToMongo();
            const database = client.db("game-vault");
            const storeCollection = database.collection("StoreGames");

            const result = await storeCollection.insertOne(newGame);

            console.log(`New game added with ID: ${result.insertedId}`);
            return res.status(200).json({ success: true, message: "game successfully added to store" });

        } catch (error) {
            console.error("Error adding game:", error);
            return res.status(400).json({ success: false, message: "failed to add game to store" });
        } finally {
            await closeMongoConnection();
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
        } finally {
            await client.close();
        }
    },

};

module.exports = storeController;
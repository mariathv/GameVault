require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_CON;
if (!uri) {
    console.error("❌ MongoDB connection string is missing! Check your .env file.");
    process.exit(1);
}

async function initializeCounter() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db("game-vault");
        const countersCollection = db.collection("counters");

        await countersCollection.updateOne(
            { _id: "gameId" },
            { $setOnInsert: { sequence_value: 0 } },
            { upsert: true }
        );

        console.log("✅ Counter initialized!");
        await client.close();
    } catch (err) {
        console.error("❌ Error initializing counter:", err);
    }
}

initializeCounter();

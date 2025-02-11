const { MongoClient } = require('mongodb');  // Ensure this import is at the top of the file
require('dotenv').config();

const uri = process.env.MONGO_DB_CON;

let client;

const connectToMongo = async () => {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        console.log("Connected to MongoDB!");
    }
    return client;
};

async function closeMongoConnection() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed!');
    }
}

module.exports = {
    connectToMongo,
    closeMongoConnection,
};

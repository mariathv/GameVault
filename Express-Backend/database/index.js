const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_DB_CON;

let client;

async function connectToMongo() {
    if (client) return client;
    try {
        // connection
        client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to MongoDB!');
        return client;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}

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

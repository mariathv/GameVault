const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    games: [
        {
            gameId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'StoreGames',
                required: true
            },
            title: String,
            price: Number,
            quantity: Number,
            cover_url: String,
            genre: [Number],
            releaseDate: Number,
            gameKeys: [String]
        }
    ],
    totalAmount: Number,
    status: {
        type: String,
        default: "Pending"
    },
    paymentInfo: {
        method: String,
        transactionId: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);

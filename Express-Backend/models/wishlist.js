const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    games: [
        {
            gameId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'StoreGames',
                required: true
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
module.exports = Wishlist;

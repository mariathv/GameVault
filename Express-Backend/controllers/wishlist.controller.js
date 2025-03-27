const Wishlist = require('../models/wishlist');

exports.addToWishlist = async (req, res) => {
    try {
        const { userId, gameId } = req.body;

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, games: [] });
        }

        const gameExists = wishlist.games.some(game => game.gameId.equals(gameId));

        if (gameExists) {
            return res.status(400).json({ message: 'Game already in wishlist' });
        }

        wishlist.games.push({ gameId });
        await wishlist.save();

        res.status(200).json({ message: 'Game added to wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { userId, gameId } = req.body;

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.games = wishlist.games.filter(game => !game.gameId.equals(gameId));

        await wishlist.save();
        res.status(200).json({ message: 'Game removed from wishlist', wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const wishlist = await Wishlist.findOne({ userId }).populate('games.gameId');

        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json({ wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

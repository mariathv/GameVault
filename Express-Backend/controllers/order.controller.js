const { v4: uuidv4 } = require('uuid');
const Order = require('../models/order.js');
const StoreGames = require('../models/store.js');
const User = require('../models/users.js');
const mailController = require("./mail.controller.js")

const orderController = {
    createOrder: async (req, res) => {
        try {
            const { userId, games, paymentMethod } = req.body;

            const transactionId = uuidv4();

            let totalAmount = 0;
            const gameDetails = await Promise.all(
                games.map(async (game) => {
                    const gameInfo = await StoreGames.findById(game.gameId);

                    if (!gameInfo) throw new Error(`Game with ID ${game.gameId} not found`);

                    if (gameInfo.copies < game.quantity) {
                        throw new Error(`Not enough copies of ${gameInfo.name} available`);
                    }

                    const selectedKeys = [];
                    for (let i = 0; i < game.quantity; i++) {
                        const gameKey = gameInfo.gameKeys.pop(); // Get a game key and remove it from the list
                        if (!gameKey) {
                            throw new Error(`No game keys available for ${gameInfo.name}`);
                        }
                        selectedKeys.push(gameKey);
                    }

                    gameInfo.copies -= game.quantity;
                    await gameInfo.save();

                    totalAmount += gameInfo.price * game.quantity;

                    console.log("selected", selectedKeys);

                    return {
                        gameId: gameInfo._id,
                        title: gameInfo.name,
                        price: gameInfo.price,
                        quantity: game.quantity,
                        cover_url: gameInfo.cover_url,
                        genre: gameInfo.genres,
                        releaseDate: gameInfo.first_release_date,
                        gameKeys: selectedKeys,
                    };
                })
            );

            const taxAmount = totalAmount * 0.08;
            const totalAmountWithTax = totalAmount + taxAmount;

            const order = new Order({
                user: userId,
                games: gameDetails,
                totalAmount: totalAmountWithTax,
                status: "Completed",
                paymentInfo: {
                    method: paymentMethod,
                    transactionId: transactionId
                }
            });

            await order.save();

            const user = await User.findById(userId);
            if (user && user.email) {
                await mailController.purchaseConfirmation(user.email, gameDetails, transactionId);
            }

            res.status(201).json({ message: "Order successfully created", order });
        } catch (error) {
            res.status(500).json({ message: "Error creating order", error: error.message });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const { email, date } = req.query;

            let filter = {};

            if (email) {
                console.log("--> filtering email");

                const user = await User.findOne({ email: email });
                if (!user) {
                    return res.status(200).json({ message: "User not found" });
                }

                filter['user'] = user._id;
                console.log(`Filtering by user: ${user._id}`);
            }

            if (date) {
                const [month, day, year] = date.split('/');
                const fullYear = `20${year}`;
                const formattedDate = new Date(`${fullYear}-${month}-${day}`);

                if (!isNaN(formattedDate.getTime())) {
                    filter['createdAt'] = {
                        $gte: formattedDate.setHours(0, 0, 0, 0),
                        $lte: formattedDate.setHours(23, 59, 59, 999),
                    };
                } else {
                    return res.status(400).json({ message: "Invalid date format" });
                }
            }

            console.log("Filters being applied:", filter);

            const orders = await Order.find(filter)
                .populate('user', 'name email')
                .populate('games.gameId', 'name price');

            res.status(200).json({ message: "Orders fetched successfully", orders });
        } catch (error) {
            res.status(500).json({ message: "Error fetching orders", error: error.message });
        }

    }

}

module.exports = orderController;
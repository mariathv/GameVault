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

    },
    getRecentOrders: async (req, res) => {
        try {
            const { limit } = req.query;

            // Default limit if not provided
            const limitValue = parseInt(limit) || 3;

            const orders = await Order.find({})
                .sort({ createdAt: -1 }) // Most recent first
                .limit(limitValue)
                .populate("user", "name email")
                .populate("games.gameId", "name price");

            res.status(200).json({
                message: "Recent orders fetched successfully",
                orders,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error fetching recent orders",
                error: error.message,
            });
        }
    },
    getGameSaleCount: async (req, res) => {
        try {
            const { email, month, year } = req.query;

            let filter = {};

            if (email) {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return res.status(200).json({ count: 0, message: "User not found" });
                }
                filter['user'] = user._id;
            }

            if (month && year) {
                const m = parseInt(month) - 1;
                const y = parseInt(year);

                const startDate = new Date(y, m, 1, 0, 0, 0, 0);  // First day of the month
                const endDate = new Date(y, m + 1, 0, 23, 59, 59, 999);  // Last day of the month

                filter['createdAt'] = { $gte: startDate, $lte: endDate };
            }

            const orders = await Order.find(filter);

            let totalGames = 0;
            for (const order of orders) {
                for (const game of order.games) {
                    totalGames += game.quantity || 0;
                }
            }

            // Calculate the start and end dates for the previous month
            const currentDate = new Date();
            let previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            let previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

            let previousMonthFilter = {};
            if (email) {
                previousMonthFilter['user'] = filter['user'];
            }
            previousMonthFilter['createdAt'] = {
                $gte: new Date(previousMonthStart.setHours(0, 0, 0, 0)),
                $lte: new Date(previousMonthEnd.setHours(23, 59, 59, 999)),
            };

            const previousMonthOrders = await Order.find(previousMonthFilter);

            // Count total games sold in the previous month
            let previousMonthGames = 0;
            for (const order of previousMonthOrders) {
                for (const game of order.games) {
                    previousMonthGames += game.quantity || 0;
                }
            }

            // Calculate percentage change
            let percentageChange = 0;
            if (previousMonthGames > 0) {
                percentageChange = ((totalGames - previousMonthGames) / previousMonthGames) * 100;
            }

            res.status(200).json({
                count: totalGames,
                percentageChange: percentageChange.toFixed(2), // Format to 2 decimal places
                message: percentageChange >= 0
                    ? `+${percentageChange.toFixed(2)}% from last month`
                    : `${percentageChange.toFixed(2)}% from last month`
            });

        } catch (error) {
            res.status(500).json({ message: "Error fetching game count", error: error.message });
        }
    },


    getTotalRevenue: async (req, res) => {
        try {
            const { month, year } = req.query;
            let filter = {};

            if (!month || !year) {
                return res.status(400).json({ success: false, message: "Please provide both month and year." });
            }

            const m = parseInt(month) - 1;
            const y = parseInt(year);

            const startDate = new Date(y, m, 1, 0, 0, 0, 0);
            const endDate = new Date(y, m + 1, 0, 23, 59, 59, 999);

            filter['createdAt'] = { $gte: startDate, $lte: endDate };
            const orders = await Order.find(filter);
            const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

            const previousMonthStart = new Date(y, m - 1, 1, 0, 0, 0, 0);
            const previousMonthEnd = new Date(y, m, 0, 23, 59, 59, 999);

            const previousMonthFilter = { createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd } };
            const previousMonthOrders = await Order.find(previousMonthFilter);
            const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

            console.log("Current Month Revenue: ", totalRevenue);
            console.log("Previous Month Revenue: ", previousMonthRevenue);

            let percentageChange = 0;
            if (previousMonthRevenue > 0) {
                percentageChange = ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
            }

            res.status(200).json({
                success: true,
                totalRevenue,
                percentageChange: percentageChange.toFixed(2), // Limit to 2 decimal places
                message: percentageChange >= 0 ? `+${percentageChange.toFixed(2)}% from last month` : `${percentageChange.toFixed(2)}% from last month`
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error calculating revenue", error: error.message });
        }
    },
    getWeeklySalesOverview: async (req, res) => {
        try {
            const { email } = req.query;

            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

            const monday = new Date(now);
            monday.setDate(now.getDate() + diffToMonday);
            monday.setHours(0, 0, 0, 0);

            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            sunday.setHours(23, 59, 59, 999);

            let filter = { createdAt: { $gte: monday, $lte: sunday } };

            if (email) {
                const user = await User.findOne({ email: email });
                if (!user) {
                    return res.status(200).json({ data: [], message: "User not found" });
                }
                filter['user'] = user._id;
            }

            const orders = await Order.find(filter);

            // Prepare daily sales counts (Mon to Sun)
            const dailySales = {
                Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
            };

            for (const order of orders) {
                const orderDate = new Date(order.createdAt);
                const day = orderDate.getDay(); // 0 = Sunday

                const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayKey = dayMap[day];

                let gameCount = 0;
                for (const game of order.games) {
                    gameCount += game.quantity || 0;
                }

                dailySales[dayKey] += gameCount;
            }

            // Format for chart (Mon to Sun)
            const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
                day,
                count: dailySales[day]
            }));

            res.status(200).json({ data: chartData });
        } catch (error) {
            res.status(500).json({ message: "Error generating weekly sales", error: error.message });
        }
    }






}

module.exports = orderController;
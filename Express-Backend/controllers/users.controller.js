const User = require("../models/users")

exports.getUsersCount = async (req, res) => {
    try {
        const { month, year } = req.query;

        const now = new Date();
        const currentMonth = month ? parseInt(month) - 1 : now.getMonth();
        const currentYear = year ? parseInt(year) : now.getFullYear();

        const currentMonthStart = new Date(currentYear, currentMonth, 1);
        const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const prevMonthStart = new Date(prevYear, prevMonth, 1);
        const prevMonthEnd = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59, 999);

        const totalCount = await User.countDocuments({ role: "user" });

        const currentMonthCount = await User.countDocuments({
            role: "user",
            createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
        });

        const previousMonthCount = await User.countDocuments({
            role: "user",
            createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd }
        });

        console.log(prevMonthStart, prevMonthEnd)

        const change = currentMonthCount - previousMonthCount;
        const message = change >= 0
            ? `+${change} since last month`
            : `${change} since last month`;

        res.status(200).json({
            success: true,
            count: totalCount,
            change,
            message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users count",
            error: error.message
        });
    }
};

exports.updateUserWallet = async (req, res) => {
    try {
        const userId = req.params.id;
        const { amount, type } = req.body; // type can be "add" or "deduct"

        console.log(userId, amount, type);

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid amount greater than zero"
            });
        }

        if (type !== "add" && type !== "deduct") {
            return res.status(400).json({
                success: false,
                message: "Invalid wallet update type. Use 'add' or 'deduct'"
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check balance before deducting
        if (type === "deduct" && user.wallet < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance"
            });
        }

        // Update wallet
        user.wallet += (type === "add" ? amount : -amount);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Wallet updated successfully",
            data: {
                wallet: user.wallet
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user wallet",
            error: error.message
        });
    }
};

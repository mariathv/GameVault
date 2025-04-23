const User = require("../models/users")

exports.getUsersCount = async (req, res) => {
    try {
        const { month, year } = req.query;

        const now = new Date();
        const currentMonth = month ? parseInt(month) - 1 : now.getMonth();
        const currentYear = year ? parseInt(year) : now.getFullYear();

        // Get start and end of current full month
        const currentMonthStart = new Date(currentYear, currentMonth, 1);
        const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

        // Get previous full month
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const prevMonthStart = new Date(prevYear, prevMonth, 1);
        const prevMonthEnd = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59, 999);

        // Total non-admin users (all time)
        const totalCount = await User.countDocuments({ role: "user" });

        // Users added this full month
        const currentMonthCount = await User.countDocuments({
            role: "user",
            createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd }
        });

        // Users added in previous full month
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


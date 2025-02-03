const chalk = require("chalk"); // Import chalk
const { fetchData, fetchStoreData } = require("../api/api-steam");
const { fetchGBData } = require("../api/api-gb");

const GB_KEY = process.env.API_KEY_GB;

const gamesController = {
    search: async (req, res) => {
        const { search_query } = req.query;
        try {
            if (!search_query) {
                return res.status(400).json({ error: "Search query required!" });
            }

            const searchData = await fetchGBData(`games/?api_key=${GB_KEY}&format=json&limit=15&filter=name:${search_query}&field_list=name,id`);

            if (!searchData?.results) {
                console.log(chalk.yellow(`[${new Date().toISOString()}] No search data found`));
                return res.status(200).json({ success: false, message: "No games found" });
            }

            const result = searchData.results;
            console.log(chalk.green(`[${new Date().toISOString()}] ✅ Found ${result.length} games for query: ${search_query}`));

            return res.status(200).json({ success: true, queryResult: result });

        } catch (error) {
            console.error(chalk.red(`[${new Date().toISOString()}] ❌ Error fetching search result:`), error);
            return res.status(500).json({ error: "Failed to fetch search result" });
        }
    },

    getGameInfoByID: async (req, res) => {
        const { id } = req.query;
        try {
            if (!id) {
                return res.status(400).json({ error: "id required!" });
            }

            const appIDSearch = await fetchGBData(`game/${id}/?api_key=${GB_KEY}&format=json`);

            if (!appIDSearch || !appIDSearch.results || appIDSearch.results.length == 0) {
                console.log(chalk.yellow(`[${new Date().toISOString()}] ⚠️ No valid game data found`));
                return res.status(200).json({ success: false, message: "No games found" });
            }

            console.log(chalk.green(`[${new Date().toISOString()}] ✅ Fetched game info for query: ${id}`));

            return res.status(200).json({
                success: true,
                queryResult: appIDSearch.results
            });

        } catch (error) {
            console.error(chalk.red(`[${new Date().toISOString()}] ❌ Error fetching game info:`), error);
            return res.status(500).json({ error: "Failed to fetch game info" });
        }
    },
};

module.exports = gamesController;

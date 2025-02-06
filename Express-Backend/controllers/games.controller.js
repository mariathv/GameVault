const chalk = require("chalk"); // Import chalk
const { fetchData, fetchStoreData } = require("../api/api-steam");
const { fetchGBData } = require("../api/api-gb");

const GB_KEY = process.env.API_KEY_GB;

const gamesController = {
    //fetches game data (search query given (by name))
    searchByName: async (req, res) => {
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
    //fetches game data (single) 
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
    //fetches game data (given multiple ids as array)
    getGamesInfoByIDs: async (req, res) => {
        const { ids } = req.query;

        if (!ids) {
            return res.status(400).json({ error: "ids required!" });
        }

        //in case of a single id is passed
        const gameIds = Array.isArray(ids) ? ids : ids.split(",");

        if (gameIds.length === 0) {
            return res.status(400).json({ error: "At least one ID is required!" });
        }


        const gamesInfos = await fetchGBData(`games/?api_key=${GB_KEY}&format=json&limit=15&filter=id:${gameIds.join("|")}`);

        if (!gamesInfos || !gamesInfos.results || gamesInfos.results.length == 0) {
            console.log(chalk.yellow(`[${new Date().toISOString()}] ⚠️ No valid game data found`));
            return res.status(400).json({ error: "games info not found" });
        }

        console.log(chalk.green(`[${new Date().toISOString()}] ✅ Fetched game info for queries: ${gameIds}`));

        return res.status(200).json({ success: true, queryResult: gamesInfos.results });
    },
};

module.exports = gamesController;

const { fetchData, fetchStoreData } = require("../api/api-steam");
const { fetchGBData } = require("../api/api-gb");

const GB_KEY = process.env.API_KEY_GB



const gamesController = {
    search: async (req, res) => {
        const { search_query } = req.query;
        try {
            if (!search_query) {
                return res.status(400).json({
                    error: "Search query required!",
                });
            }

            // ---- fetch the list of all games ----

            const searchData = await fetchGBData(`games/?api_key=${GB_KEY}&format=json&limit=15&filter=name:${search_query}&field_list=name`);


            if (!searchData?.results) {
                console.log(`[${new Date().toISOString()}] No search data found`);
                return res.status(200).json({ success: false, message: "No games found" });
            }

            const result = searchData.results;
            console.log(`[${new Date().toISOString()}] Found ${result.length} games for query: ${search_query}`);

            return res.status(200).json({ success: true, queryResult: result });

        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error fetching search result:`, error);
            return res.status(500).json({ error: "Failed to fetch search result" });
        }
    },
    getGameInfo: async (req, res) => {
        const { name } = req.query;
        try {
            if (!name) {
                return res.status(400).json({
                    error: "Name required!",
                });
            }

            const appIDSearch = await fetchData("ISteamApps/GetAppList/v1/");

            console.log(`[${new Date().toISOString()}] appIDSearch response:`, appIDSearch);

            if (!appIDSearch?.applist?.apps?.app || !Array.isArray(appIDSearch.applist.apps.app)) {
                console.log(`[${new Date().toISOString()}] No valid apps data found`);
                return res.status(200).json({ success: false, message: "No games found" });
            }

            const appsArray = appIDSearch.applist.apps.app;

            // --- Normalize the name by trimming and converting to lowercase ---
            const normalizedQuery = name.toLowerCase().trim();

            const exactMatches = appsArray.filter(game =>
                game.name?.toLowerCase().trim() === normalizedQuery
            );

            if (exactMatches.length === 0) {
                console.log(`[${new Date().toISOString()}] No matching games for name: ${name}`);
                return res.status(200).json({ success: false, message: "No matching games found" });
            }

            console.log(`[${new Date().toISOString()}] Found ${exactMatches.length} exact match(es) for query: ${name}`);

            // --- Fetch the game details for all matches ---
            const gameDetailsPromises = exactMatches.map(async (match) => {
                const appid = match.appid;
                const steamGameInfo = await fetchStoreData(`appdetails?appids=${appid}`);
                return { appid, steamGameInfo };
            });

            const gameDetails = await Promise.all(gameDetailsPromises);

            const successfulResults = gameDetails.filter(result => result.steamGameInfo[result.appid]?.success);

            if (successfulResults.length > 0) {
                return res.status(200).json({
                    success: true,
                    queryResult: successfulResults.map(result => result.steamGameInfo[result.appid])
                });
            }

            console.log(`[${new Date().toISOString()}] No successful game info for query: ${name}`);
            return res.status(200).json({ success: false, message: "No successful game details found" });

        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error fetching game info:`, error);
            return res.status(500).json({ error: "Failed to fetch game info" });
        }
    },

};

module.exports = gamesController;

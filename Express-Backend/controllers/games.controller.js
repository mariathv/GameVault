const { fetchData } = require("../api/api-steam");

const gamesController = {
    search: async (req, res) => {
        const { search_query } = req.query;
        try {
            if (!search_query) {
                return res.status(400).json({
                    error: "Search query required!",
                    search_query,
                });
            }

            // ---- fetch the list of all games ----
            const searchData = await fetchData(`ISteamApps/GetAppList/v2/`);

            if (!searchData?.applist?.apps) {
                console.log(`[${new Date().toISOString()}] No search data found`);
                return res.status(200).json({ success: false, message: "No games found" });
            }

            // --- Exact match ---
            const exactMatches = searchData.applist.apps
                .filter(game => game.name?.toLowerCase().trim() === search_query.toLowerCase().trim());

            // --- Partial match (excluding exact matches) ---
            const partialMatches = searchData.applist.apps
                .filter(game =>
                    game.name?.toLowerCase().match(new RegExp(`(^|\\W)${search_query.toLowerCase()}(\\W|$)`)) &&
                    game.name?.toLowerCase().trim() !== search_query.toLowerCase().trim()
                );

            const combinedResults = [
                ...exactMatches,
                ...partialMatches.filter((game, index, self) =>
                    index === self.findIndex((t) => t.appid === game.appid)  // Exclude duplicates based on appid
                )
            ].slice(0, 20);  // limit to top 20 results

            if (combinedResults.length === 0) {
                console.log(`[${new Date().toISOString()}] No matching games for query: ${search_query}`);
                return res.status(200).json({ success: false, message: "No matching games found" });
            }

            console.log(`[${new Date().toISOString()}] Found ${combinedResults.length} games for query: ${search_query}`);

            return res.status(200).json({ success: true, queryResult: combinedResults });

        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error fetching search result:`, error);
            return res.status(500).json({ error: "Failed to fetch search result" });
        }
    },
};

module.exports = gamesController;

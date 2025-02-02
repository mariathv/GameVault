const { fetchData } = require("../api/api-steam");
const { fetchGBData } = require("../api/api-gb");

const GB_KEY = process.env.API_KEY_GB

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
};

module.exports = gamesController;

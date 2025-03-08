const chalk = require("chalk"); // Import chalk
const { fetchData, fetchStoreData } = require("../api/api-steam");
const { fetchGBData } = require("../api/api-gb");
const { fetchIGDB } = require("../api/api-igdb");

const GB_KEY = process.env.API_KEY_GB;

const gamesController = {
    //fetches game data (search query given (by name))
    searchByName: async (req, res) => {
        const { search_query } = req.query;
        try {
            if (!search_query) {
                return res.status(400).json({ error: "Search query required!" });
            }
            //exact searched (lowercase == upper case)
            // const body = `fields *; where name ~ "${search_query}";`;

            const body = `fields *; search "${search_query}"; where (version_parent = null) & (name ~ *"${search_query}"*) & (rating != null);`;
            let searchData = await fetchIGDB(`games`, body);

            if (!searchData || searchData.length == 0) {

                const body_alt = `fields *; search "${search_query}";`;
                const searchData_alt = await fetchIGDB(`games`, body_alt);

                if (!searchData_alt || searchData_alt.length == 0) {
                    console.log(chalk.yellow(`[${new Date().toISOString()}] No search data found`));
                    return res.status(200).json({ success: false, message: "No games found" });
                }

                searchData = searchData_alt;
            }

            const coverIds = searchData.map(game => game.cover).filter(Boolean); // Exclude undefined covers
            const body_cover = `fields *; where id = (${coverIds.join(",")});`;

            const coverData = await fetchIGDB('covers', body_cover);

            const sortedCoverData = coverIds.map(coverId => coverData.find(cover => cover.id === coverId));

            console.log(chalk.green(`[${new Date().toISOString()}] ✅ Found ${searchData.length} games for query: ${search_query}`));

            return res.status(200).json({ success: true, queryResult: searchData, coverResult: sortedCoverData });

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

            const body = `fields *; where id = ${id};`

            const appIDSearch = await fetchIGDB("games", body);

            if (!appIDSearch) {
                console.log(chalk.yellow(`[${new Date().toISOString()}] ⚠️ No valid game data found`));
                return res.status(200).json({ success: false, message: "No games found" });
            }

            const coverIds = appIDSearch.map(game => game.cover).filter(Boolean); // Exclude undefined covers
            const body_cover = `fields *; where id = (${coverIds.join(",")});`;

            const coverData = await fetchIGDB('covers', body_cover);

            const sortedCoverData = coverIds.map(coverId => coverData.find(cover => cover.id === coverId));

            console.log(chalk.green(`[${new Date().toISOString()}] ✅ Fetched game info for query: ${id}`));

            return res.status(200).json({
                success: true,
                queryResult: appIDSearch,
                coverResult: sortedCoverData
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

        const body = `fields *; where id = (${gameIds});`

        if (gameIds.length === 0) {
            return res.status(400).json({ error: "At least one ID is required!" });
        }


        const gamesInfos = await fetchIGDB("games", body);

        if (!gamesInfos) {
            console.log(chalk.yellow(`[${new Date().toISOString()}] ⚠️ No valid game data found`));
            return res.status(400).json({ error: "games info not found" });
        }

        console.log(chalk.green(`[${new Date().toISOString()}] ✅ Fetched game info for queries: ${gameIds}`));

        return res.status(200).json({ success: true, queryResult: gamesInfos });
    },

    getGameArtworks: async (req, res) => {
        const { ids } = req.query;

        const artworkIds = Array.isArray(ids) ? ids : ids.split(",");

        const body = `fields *; where id = (${artworkIds});`

        if (artworkIds.length === 0) {
            return res.status(400).json({ error: "At least one ID is required!" });
        }

        const artworksData = await fetchIGDB("artworks", body);

        if (!artworksData) {
            console.log(chalk.yellow(`[${new Date().toISOString()}] ⚠️ No valid art data found`));
            return res.status(400).json({ error: "art info not found" });
        }


        return res.status(200).json({ success: true, queryResult: artworksData });

    },

    getGameScreenshots: async (req, res) => {
        const { ids } = req.query;

        const screenshotsIds = Array.isArray(ids) ? ids : ids.split(",");

        const body = `fields *; where id = (${screenshotsIds});`

        if (screenshotsIds.length === 0) {
            return res.status(400).json({ error: "At least one ID is required!" });
        }

        const screenshotsData = await fetchIGDB("screenshots", body);

        if (!screenshotsData) {
            console.log(chalk.yellow(`[${new Date().toISOString()}] ⚠️ No valid ss data found`));
            return res.status(400).json({ error: "ss info not found" });
        }


        return res.status(200).json({ success: true, queryResult: screenshotsData });
    },
    getGameGenres: async (req, res) => {
        const { ids } = req.query;

        const gameGenresIds = Array.isArray(ids) ? ids : ids.split(",");

        const body = `fields *; where id = (${gameGenresIds});`

        if (gameGenresIds.length === 0) {
            return res.status(400).json({ error: "At least one ID is required!" });
        }

        const genres = await fetchIGDB("genres", body);

        if (!genres) {
            console.log(chalk.yellow(`[${new Date().toISOString()}] ⚠️ No valid genre data found`));
            return res.status(400).json({ error: "genre info not found" });
        }


        return res.status(200).json({ success: true, queryResult: genres });
    },
    getGameVideos: async (req, res) => {
        const { ids } = req.query;

        const gameVideosIds = Array.isArray(ids) ? ids : ids.split(",");

        const body = `fields *; where id = (${gameVideosIds});`

        if (gameVideosIds.length === 0) {
            return res.status(400).json({ error: "At least one ID is required!" });
        }

        const vids = await fetchIGDB("game_videos", body);

        if (!vids) {
            console.log(chalk.yellow(`[${new Date().toISOString()}] ⚠️ No valid vid data found`));
            return res.status(400).json({ error: "vid info not found" });
        }


        return res.status(200).json({ success: true, queryResult: vids });
    }
};

module.exports = gamesController;

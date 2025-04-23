import { useState } from "react";
import { fetchData } from "./api/api-gamevault";

const usePrefetchGameData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAll = async (gameId) => {
        setLoading(true);
        setError(null);
        try {
            const fetch = await fetchData(`store/games/get?id=${gameId}`);
            const game = fetch.gameData;

            const [artworksRes, screenshotsRes, genresRes, videosRes] = await Promise.all([
                fetchData(`games/get/artworks?ids=${game.artworks}`),
                fetchData(`games/get/screenshots?ids=${game.screenshots}`),
                fetchData(`games/get/genres?ids=${game.genres}`),
                fetchData(`games/get/videos?ids=${game.videos}`)
            ]);

            return {
                game,
                artworks: artworksRes.queryResult,
                screenshots: screenshotsRes.queryResult,
                genres: genresRes.queryResult,
                videos: videosRes.queryResult,
            };
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchAll, loading, error };
};

export default usePrefetchGameData;
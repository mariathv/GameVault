"use client"

import { useState, useEffect } from "react"
import { FaSearch, FaPlus } from "react-icons/fa"
import { fetchData } from '../api/api-gamevault';
import { AspectRatio, Image } from "@chakra-ui/react";

function AddGame() {
    const [gamesList, setGamesList] = useState();
    const [covers, setGameCovers] = useState();
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);

    function convertImageUrl(url, newSize = "t_1080p") {
        return url.replace(/t_[^/]+/, newSize);
    }

    function sortGamesByRating(games, covers) {
        const validGames = games.filter((game, index) => covers[index]);

        const sortedIndices = validGames
            .map((game, index) => ({
                index,
                rating: game.rating ?? -1,
            }))
            .sort((a, b) => b.rating - a.rating)
            .map(({ index }) => index);

        const sortedGames = sortedIndices.map((i) => validGames[i]);
        const sortedCovers = sortedIndices.map((i) => covers[i]);

        return { sortedGames, sortedCovers };
    }

    const fetchGames = async () => {
        try {
            if (search) {
                setLoader(true);

                const gameResponse = await fetchData(`games/search/name/?search_query=${search}`);

                console.log(gameResponse);

                if (gameResponse.success == true) {
                    const { sortedGames, sortedCovers } = sortGamesByRating(gameResponse.queryResult, gameResponse.coverResult);
                    setGamesList(sortedGames);
                    setGameCovers(sortedCovers);

                    console.log("sorted games: ", sortedGames);
                    console.log("sorted covers: ", sortedCovers);
                }

                setLoader(false);
            }

        } catch (error) {
            console.log("Error fetching games", error);
        }

    };



    useEffect(() => {
        fetchGames();
    }, [])


    return (
        <div className="mt-8">
            <div className="mb-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaSearch className="text-gray-500" />
                    </span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-[#DDD9FE] focus:outline-none focus:border-white"
                        placeholder="Search for games..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                fetchGames();
                            }
                        }}
                    />


                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {loader ? (<div className="loader-container">{loader && <div class="loader"></div>}</div>) : (gamesList && gamesList.map((game, index) => (
                    <div key={game.id} className="bg-[#1D1D1D] p-4 rounded-lg shadow">
                        <div className="mb-3">
                            <AspectRatio maxW="auto" ratio={4 / 5}>
                                <Image
                                    src={convertImageUrl(covers[index].url) || 'fallback_image_url.jpg'}
                                    borderTopRadius="10"
                                    alt={game.name}
                                />
                            </AspectRatio>
                        </div >
                        <h3 className="text-xl font-semibold mb-2 text-[#EDEDED]">{game.name}</h3>
                        <button className="bn3">
                            <FaPlus className="inline-block mr-2" /> Add to Store
                        </button>
                    </div>
                )))}:
            </div>
        </div>
    )
}

export default AddGame


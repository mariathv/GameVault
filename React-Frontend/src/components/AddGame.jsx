import { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { fetchData } from '../hooks/api/api-gamevault';
import { AspectRatio, Image } from "@chakra-ui/react";
import Modal from "./Modal";

function AddGame() {
    const [gamesList, setGamesList] = useState();
    const [covers, setGameCovers] = useState();
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [cover, setCover] = useState(null);
    const [isInStore, setinStore] = useState(null);
    const [lastSearchedQuery, setLastSearchedQuery] = useState("");


    const [isModalOpen, setIsModalOpen] = useState(false);

    const checkifAlready = async (id) => {
        const gData = await fetchData(`store/games/get?id=${id}`);
        if (gData.gameData) {

            console.log("Game in store", gData);
            return gData;
        } else {
            console.log("Game not in store");
            return false;
        }


    }

    const openModal = async (game, cover) => {
        const inStore = await checkifAlready(game.id);  // Await the checkifAlready function


        if (inStore) {
            console.log("in store");
            setSelectedGame(inStore.gameData);
            setinStore(true);
        } else {
            console.log("not in store");
            setSelectedGame(game);
            setinStore(false);
        }

        setIsModalOpen(true);
        setCover(cover);

    }
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedGame(false);
    }

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
        setGamesList(null);
        try {
            if (search) {
                setLoader(true);

                const gameResponse = await fetchData(`games/search/name/?search_query=${search}`);

                if (gameResponse.success === true) {
                    const { sortedGames, sortedCovers } = sortGamesByRating(gameResponse.queryResult, gameResponse.coverResult);
                    setGamesList(sortedGames);
                    setGameCovers(sortedCovers);

                    setLastSearchedQuery(search);
                }

                setLoader(false);
            }

        } catch (error) {
            console.log("Error fetching games", error);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <div className={`mt-8`}>
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
            {gamesList && !loader && lastSearchedQuery && (
                <h1 className="text-[#EDEDED] mb-3">Search result for "{lastSearchedQuery}"</h1>
            )}

            {loader ? (
                <div className="flex justify-center items-center min-h-[200px] w-full">
                    <div className="loader"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {
                            gamesList && gamesList.map((game, index) => (
                                <div key={game.id} className="bg-[#1D1D1D] p-4 rounded-lg shadow flex flex-col">
                                    <div className="mb-3">
                                        <AspectRatio maxW="auto" ratio={3 / 4}>
                                            <Image
                                                src={convertImageUrl(covers[index].url) || 'fallback_image_url.jpg'}
                                                borderTopRadius="10"
                                                alt={game.name}
                                            />
                                        </AspectRatio>
                                    </div>
                                    <h3 className="text-x font-semibold mb-2 text-[#EDEDED]">{game.name}</h3>
                                    <div className="flex-grow" />

                                    <button className="bn3" onClick={() => openModal(game, covers[index].url)}>
                                        <FaPlus className="inline-block mr-2" /> Add to Store
                                    </button>

                                    <Modal isOpen={isModalOpen} onClose={closeModal} gameInfo={selectedGame} setgameInfo={setSelectedGame} cover={cover} inStore={isInStore} setInStore={setinStore} fetchGamesFunc={null}>
                                    </Modal>
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div >
    );
}

export default AddGame;
{
    /*
    *** add a functionality -> (more) in search, which will fetch the next 20 games and so on
    *** possible data loading glitch ? see and fix
    *** search result (on every key input) ? + bug fix
    */
}

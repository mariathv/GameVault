"use client"

import { useState, useEffect } from "react"
import { FaSearch, FaPlus } from "react-icons/fa"
import { fetchData } from '../api/api-gamevault';
import { AspectRatio, Image } from "@chakra-ui/react";

import { Button, Modal, ModalBody, ModalContent, ModalOverlay, ModalHeader, ModalFooter, useDisclosure, ModalCloseButton } from "@chakra-ui/react";

function AddGame() {
    const [gamesList, setGamesList] = useState();
    const [covers, setGameCovers] = useState();
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()

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

                //console.log(gameResponse);

                if (gameResponse.success == true) {
                    const { sortedGames, sortedCovers } = sortGamesByRating(gameResponse.queryResult, gameResponse.coverResult);
                    setGamesList(sortedGames);
                    setGameCovers(sortedCovers);

                    //console.log("sorted games: ", sortedGames);
                    //console.log("sorted covers: ", sortedCovers);
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
            {gamesList && !loader && (
                <h1 className="text-[#EDEDED] mb-3">Search result for "{search}"</h1>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {loader ? (
                    <div className="loader-container">
                        {loader && <div className="loader"></div>}
                    </div>
                ) : (
                    <>
                        {
                            gamesList && gamesList.map((game, index) => (
                                <div key={game.id} className="bg-[#1D1D1D] p-4 rounded-lg shadow flex flex-col">
                                    <div className="mb-3">
                                        <AspectRatio maxW="auto" ratio={4 / 5}>
                                            <Image
                                                src={convertImageUrl(covers[index].url) || 'fallback_image_url.jpg'}
                                                borderTopRadius="10"
                                                alt={game.name}
                                            />
                                        </AspectRatio>
                                    </div>
                                    <h3 className="text-x font-semibold mb-2 text-[#EDEDED]">{game.name}</h3>
                                    {/* Content area */}
                                    <div className="flex-grow" /> {/* This takes available space and pushes the button down */}
                                    <button className="bn3">
                                        <FaPlus className="inline-block mr-2" /> Add to Store
                                    </button>
                                    <button className="btn" onClick={() => document.getElementById('my_modal_4').showModal()}>open modal</button>
                                    <dialog id="my_modal_4" className="modal">
                                        <div className="modal-box w-11/12 max-w-5xl">
                                            <h3 className="font-bold text-lg">Hello!</h3>
                                            <p className="py-4">Click the button below to close</p>
                                            <div className="modal-action">
                                                <form method="dialog">
                                                    {/* if there is a button, it will close the modal */}
                                                    <button className="btn">Close</button>
                                                </form>
                                            </div>
                                        </div>
                                    </dialog>
                                </div>
                            ))}
                    </>
                )}
            </div>

        </div >
    )
}

export default AddGame
{
    /*
    *** add a functionality -> (more) in search, which will fetch the next 20 games and so on
    *** possible data loading glitch ? see and fix
    *** search result (on every key input) ? + bug fix
    */
}


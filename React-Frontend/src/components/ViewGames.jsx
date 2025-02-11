import { useState, useEffect } from "react";
import { AspectRatio, Image } from "@chakra-ui/react";
import Modal from "./Modal";
import { fetchData } from "../api/api-gamevault";
import { FaSearch, FaPlus, FaEdit } from "react-icons/fa";

function ViewGames() {
    const [viewMode, setViewMode] = useState("compact");
    const [inStoreGames, setInStoreGames] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null); // Store selected game here
    const [search, setSearch] = useState(null);

    const fetchGames = async () => {
        const instoreGames = await fetchData("store/games/get-all/");

        if (instoreGames.success === "true") {
            console.log("no data fetched");
        } else {
            setInStoreGames(instoreGames.games);
            console.log(instoreGames);
        }
    };

    const searchGames = async () => {
        const instoreGames = await fetchData(`store/games?search=${search}`);
        //write the function
        if (instoreGames.success === "true") {
            console.log("no data fetched");
        } else {
            setInStoreGames(instoreGames.games);
            console.log(instoreGames);
        }
    }

    useEffect(() => {
        fetchGames();
    }, []);

    const toggleViewMode = () => {
        setViewMode(viewMode === "compact" ? "list" : "compact");
    };

    const openModal = (game) => {
        setSelectedGame(game); // Set the selected game
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = (isChange) => {
        if (isChange) {
            console.log("is change ", isChange, "refreshing");
            fetchGames();
        }
        setIsModalOpen(false);
        setSelectedGame(null); // Reset selected game when modal is closed
    };

    return (
        <div className="mt-8">
            <div className="flex justify-end mb-4 space-x-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaSearch className="text-gray-500" />
                    </span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-[#DDD9FE] focus:outline-none focus:border-white"
                        placeholder="Search store games ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                fetchGames();
                            }
                        }}
                    />
                </div>

                <div className="pl-2 pr-2 border-2 rounded-2xl border-[#5A5D5F]">
                    <button
                        onClick={() => toggleViewMode("compact")}
                        className={`p-2 rounded-2xl ${viewMode === "compact" ? "text-[#668389]" : "text-gray-50"}`}
                    >
                        <i className="fas fa-th"></i>
                    </button>

                    <button
                        onClick={() => toggleViewMode("list")}
                        className={`p-2 rounded-2xl ${viewMode === "list" ? "text-[#668389]" : "text-gray-50"}`}
                    >
                        <i className="fas fa-list"></i>
                    </button>
                </div>
            </div>

            <div className="list-view">
                {viewMode === "list" ? (
                    inStoreGames && inStoreGames.map((item) => (
                        <div
                            key={item.id}
                            className={`list-item ${viewMode === "compact" ? "compact" : "detailed"} bg-[#1D1D1D] p-4 rounded-lg shadow mb-3`}
                            style={{ listStyleType: 'none' }}  // Remove bullet points here
                        >
                            <div className="flex flex-row gap-10 ">
                                <div>
                                    <Image className="w-20"
                                        src={item.cover_url || 'fallback_image_url.jpg'}
                                        borderRadius="5"
                                        alt={item.name}
                                    />
                                </div>
                                <div className="m-4">
                                    <div className="flex justify-between items-center mb-4 font-bold text-[20px]">
                                        <h3 className="text-[#EDEDED] text-1xl">{item.name}</h3>
                                    </div>
                                    <button className="bn3" onClick={() => openModal(item)}>
                                        <FaEdit className="inline-block mr-2" /> Edit Details
                                    </button>
                                </div>
                                <div className="m-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[#EDEDED] text-1        xl"> Copies : {item.gameKeys.length}</h3>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[#EDEDED] text-1        xl"> Price : ${item.price}</h3>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[#EDEDED] text-1        xl"> Discount : none</h3>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                )

                    : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            {inStoreGames && inStoreGames.map((game) => (
                                <div key={game.id + game.name} className="bg-[#1D1D1D] p-4 rounded-lg shadow flex flex-col">
                                    <div className="mb-3">
                                        <AspectRatio maxW="auto" ratio={3 / 4}>
                                            <Image
                                                src={game.cover_url || 'fallback_image_url.jpg'}
                                                borderTopRadius="10"
                                                alt={game.name}
                                            />
                                        </AspectRatio>
                                    </div>
                                    <h3 className="text-x font-semibold mb-2 text-[#EDEDED]">{game.name}</h3>
                                    <div className="flex-grow" />

                                    <button className="bn3" onClick={() => openModal(game)}>
                                        <FaEdit className="text-[15px] inline-block mr-2" /> Edit Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
            </div>

            {/* Modal, only render when a game is selected and modal is open */}
            {selectedGame && isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    gameInfo={selectedGame}
                    setgameInfo={setSelectedGame}
                    cover={selectedGame.cover_url}
                    inStore={true}
                    setInStore={null}
                    fetchGamesFunc={fetchGames}
                />
            )}
        </div>
    );
}

export default ViewGames;

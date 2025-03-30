import { useState, useEffect } from "react";
import { Image } from "@chakra-ui/react";
import Modal from "./Modal";
import { fetchData } from "../hooks/api/api-gamevault";
import { FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Navigate, useNavigate } from "react-router-dom";
import { Edit, LayoutGrid, List, Search } from "lucide-react"
import { GameModal } from "./EditGameModal";

function ViewGames() {
    const [viewMode, setViewMode] = useState("compact");
    const [inStoreGames, setInStoreGames] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [loading, isLoading] = useState(true);

    const navigate = useNavigate();

    const fetchGames = async () => {
        isLoading(true);
        setIsSearching(true);
        try {
            const instoreGames = await fetchData("store/games/get-all/");

            if (instoreGames.success === "true") {
                console.log("no data fetched");
            } else {
                setInStoreGames(instoreGames.games);
                console.log("Fetched all games:", instoreGames);
            }
        } catch (error) {
            console.error("Error fetching games:", error);
        } finally {
            setIsSearching(false);
            isLoading(false);
        }
    };

    const searchGames = async () => {
        if (!search || search.trim() === "") {
            fetchGames();
            return;
        }

        setIsSearching(true);
        try {
            const searchQuery = encodeURIComponent(search.trim());
            const instoreGames = await fetchData(`store/games/search?q=${searchQuery}`);

            if (instoreGames.success === "true") {
                console.log("no search results found");
                setInStoreGames([]);
            } else {
                setInStoreGames(instoreGames.games);
                console.log("Search results:", instoreGames);
            }
        } catch (error) {
            console.error("Error searching games:", error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const toggleViewMode = () => {
        setViewMode(viewMode === "compact" ? "list" : "compact");
    };

    const openModal = (game) => {
        setSelectedGame(game);
        setIsModalOpen(true);
    };

    const closeModal = (isChange) => {
        if (isChange) {
            console.log("is change ", isChange, "refreshing");
            fetchGames();
        }
        setIsModalOpen(false);
        setSelectedGame(null);
    };

    const handleSearchInputChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchGames();
        }
    };

    const handleSearchClick = () => {
        searchGames();
    };

    return (
        <div className="mt-8">
            <div className="flex justify-end mb-4 space-x-4">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaSearch className="text-gray-500" />
                    </span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border-2 border-(--color-light-ed)/50 rounded-full text-[#DDD9FE] focus:outline-none "
                        placeholder="Search store games ..."
                        value={search}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <button
                        onClick={handleSearchClick}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white"
                        disabled={isSearching}
                    >
                        {isSearching ? "..." : "Search"}
                    </button>
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
            {loading ? (<div className="flex justify-center items-center min-h-[200px] w-full">
                <div className="loader border-t-4 border-white"></div>
            </div>) : (
                <div className="list-view">
                    {inStoreGames === null ? (
                        <div className="flex justify-center items-center min-h-[200px] w-full">
                            <div className="loader"></div>
                        </div>
                    ) : inStoreGames.length === 0 ? (
                        <div className="text-center py-10 text-[#EDEDED]">No games found</div>
                    ) : viewMode === "list" ? (
                        <div className="bg-(--color-background) shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200/50">
                                {inStoreGames.map((item) => (
                                    <li key={item.id}>
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0 h-20 w-20">
                                                    <img
                                                        className="h-20 w-20 rounded-lg object-cover"
                                                        src={item.cover_url}
                                                        alt={item.name}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between pt-2">
                                                        <div className="flex flex-col">
                                                            <p className="text-lg font-medium text-(--color-foreground) truncate">
                                                                {item.name}
                                                            </p>
                                                            <div className="flex pt-2">
                                                                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => openModal(item)}>
                                                                    Edit
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-2 pt-2">
                                                            <div className="ml-2 flex-shrink-0 flex">
                                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                    In Stock: {item.copies}
                                                                </p>

                                                            </div>
                                                            <div className="ml-2 flex-shrink-0 flex">
                                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-green-800">
                                                                    Price: ${item.price}
                                                                </p>

                                                            </div>
                                                            <div className="ml-2 flex-shrink-0 flex">
                                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-green-800">
                                                                    Discount: None
                                                                </p>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    ) : (
                        // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        //     {inStoreGames.map((game) => (
                        //         <div key={game.id + game.name} className="bg-(--color-background) p-4 rounded-lg shadow flex flex-col">
                        //             <div className="mb-3">
                        //                 <AspectRatio maxW="auto" ratio={3 / 4}>
                        //                     <Image
                        //                         src={game.cover_url || 'fallback_image_url.jpg'}
                        //                         borderTopRadius="10"
                        //                         alt={game.name}
                        //                     />
                        //                 </AspectRatio>
                        //             </div>
                        //             <h3 className="text-x font-semibold mb-2 text-[#EDEDED]">{game.name}</h3>
                        //             <div className="flex-grow" />

                        //             <button className="bn3" onClick={() => openModal(game)}>
                        //                 <FaEdit className="text-[15px] inline-block mr-2" /> Edit Details
                        //             </button>
                        //         </div>
                        //     ))}
                        // </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            {inStoreGames.map((game) => (
                                <Card key={game.id} className="bg-[#1D2127] border-[#2D3237] text-white overflow-hidden">
                                    <div className="p-2">
                                        <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-md">
                                            <img
                                                src={game.cover_url || "/placeholder.svg"}
                                                alt={game.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </AspectRatio>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold mb-2 line-clamp-1">{game.name}</h3>
                                        <div className="text-sm text-gray-400 mb-4">Price: ${game.price}</div>
                                        <Button className="w-full bg-(--color-accent)/100 hover:bg-(--color-accent)/50 " onClick={() => openModal(game)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                    )}
                </div>
            )}

            {selectedGame && isModalOpen && (
                // <Modal
                //     isOpen={isModalOpen}
                //     onClose={closeModal}
                //     gameInfo={selectedGame}
                //     setgameInfo={setSelectedGame}
                //     cover={selectedGame.cover_url}
                //     inStore={true}
                //     setInStore={null}
                //     fetchGamesFunc={fetchGames}
                // />
                <GameModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    game={selectedGame}
                    inStore={true}
                />
            )}
        </div>
    );
}

export default ViewGames;
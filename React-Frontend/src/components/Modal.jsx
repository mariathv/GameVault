import { useState, useEffect, useCallback } from "react";
import { AspectRatio, Image } from "@chakra-ui/react";
import { apiRequest, fetchData } from "../hooks/api/api-gamevault";
import { truncateTextWords } from "../utils/truncateText";


const Modal = ({ isOpen, onClose, gameInfo, setgameInfo, cover, inStore, setInStore, fetchGamesFunc }) => {

    const [isModalOpen, setIsModalOpen] = useState(isOpen);
    const [price, setPrice] = useState(null);

    const [gameKeys, setGameKeys] = useState(null);
    const [constGameKeys, setConstGameKeys] = useState(null);
    const [isShowMore, setShowMore] = useState(false);

    const [gameId, setGameId] = useState(gameInfo?._id || null);
    const [copies, setCopies] = useState(gameInfo?.gameKeys?.length || null);

    const [err, setErr] = useState(null);

    let isRemoveFromStore = false;

    useEffect(() => {
        setIsModalOpen(isOpen);
    }, [isOpen]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        onClose(isRemoveFromStore);
    }, [onClose]);

    const handleEscape = useCallback(
        (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        },
        [closeModal]
    );


    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split(/\r?\n/);
                const firstColumn = lines
                    .map((line) => line.split(",")[0])
                    .filter((value) => value.trim() !== "");
                if (firstColumn.length == 0) {
                    console.log("keys 0");
                    return;
                }
                setGameKeys(firstColumn);


            };

            reader.readAsText(file);
        }

    };

    const downloadCSV = () => {
        if (!gameInfo?.gameKeys || gameInfo?.gameKeys?.length === 0) {
            console.log("No keys available to download.");
            return;
        }

        const csvContent = "data:text/csv;charset=utf-8," + gameInfo.gameKeys.join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "game_keys.csv");

        document.body.appendChild(link);

        console.log("downloading");
        link.click();
        document.body.removeChild(link);
    };





    const addToStore = async () => {
        if (!validate()) {
            console.log("Missing fields!");
            return;
        }
        try {

            let pricenum = parseInt(price, 10);
            let coverImageURLHD = convertImageUrl(cover);
            let newGame = { ...gameInfo, cover_url: coverImageURLHD, gameKeys, price: pricenum, copies: gameKeys.length };



            const reqapi = await apiRequest("store/add-game/", { newGame });

            if (!reqapi.success) {
                console.log("Error: Failed to add game!");
                return;
            }

            console.log("Successfully added");

            newGame = { ...newGame, _id: reqapi.gameId };

            setConstGameKeys(gameKeys);
            setGameKeys(null);
            setInStore(true);
            setgameInfo(newGame);
            setGameId(reqapi.gameId);
            setCopies(gameKeys.length);
        } catch (error) {
            console.log("Error:", error);
            return;
        }
    };

    const removeStoreGame = async () => {
        try {
            let id = gameId;
            const reqapi = await apiRequest("store/game/delete/", { gameId: id }, "DELETE");
            if (!reqapi.success) {
                console.log("Error! Failed to remove game from store");
            } else {
                console.log("Successfully removed game from store");
                isRemoveFromStore = true;
                closeModal();
            }
        } catch (error) {
            console.log(error);
        }
    };


    const updateStoreGame = async () => {
        if (!gameKeys) {
            console.log("game keys not added");
            return;
        }

        try {
            console.log(gameInfo);
            let newGame = { ...gameInfo, _id: gameId };
            newGame.copies = gameKeys.length + (gameInfo.gameKeys?.length || 0);

            console.log("before", gameInfo.gameKeys?.length || 0)
            console.log("after", gameKeys.length);

            newGame.gameKeys = [...(newGame.gameKeys || []), ...gameKeys];

            console.log("sending update", newGame);
            const reqapi = await apiRequest("store/games/update/", { update: newGame });

            setCopies(newGame.gameKeys.length);

            if (!reqapi.success) {
                console.log("Error: Failed to update game!");
                return;
            }

            console.log("Successfully updated");

            setConstGameKeys(newGame.gameKeys);
            setGameKeys(null);
            if (fetchGamesFunc) {
                fetchGamesFunc();
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isModalOpen, handleEscape]);

    if (!isModalOpen) return null;


    function convertImageUrl(url, newSize = "t_1080p") {
        return url.replace(/t_[^/]+/, newSize);
    }

    function validate() {
        if (!price || !gameKeys) {
            return false;
        }

        return true;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-opacity-10 items-center flex justify-center">
            <div
                className="fixed inset-0 backdrop-blur-custom transition-opacity"
                onClick={closeModal}
            ></div>
            <div className="flex flex-row justify-center items-center w-full h-full ">

                <div className="relative bg-[#141B26] pl-5 pr-5 w-full max-w-4xl xl m-4 rounded-lg shadow-lg flex flex-row pt-3 pb-3  ">
                    {/* Image Section */}
                    <div className="justify-center items-center min-w-60 self-center">
                        <AspectRatio ratio={3 / 4} >
                            <Image
                                src={convertImageUrl(cover)}
                                borderRadius="10"
                                alt={gameInfo?.name}
                            />
                        </AspectRatio>
                    </div>


                    {/* Content Section */}
                    <div className="px-6 py-4  flex-grow">
                        <h2 id="modal-title" className="text-xl font-semibold mb-2 text-[#EDEDED]">
                            {gameInfo?.name}
                        </h2>
                        <p className="text-[#EDEDED] text-sm">
                            {!isShowMore ? truncateTextWords(gameInfo?.summary, 50) : truncateTextWords(gameInfo?.summary, 200)}

                            {gameInfo?.summary?.split(" ").length > 50 && (
                                <button className="pl-3 hover:text-[#474751]" onClick={() => setShowMore(!isShowMore)}>
                                    {isShowMore ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </p>

                        {inStore === false ? (
                            <>
                                <div className="flex flex-row gap-2">
                                    <div className="w-full max-w-[200px] min-w-[10px] mt-5">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                                placeholder="Price"
                                                onChange={(e) => setPrice(e.target.value)}
                                            />

                                            <i className="fas fa-dollar absolute w-5 h-5 top-2.5 right-2.5 text-slate-600"></i>
                                        </div>
                                    </div>





                                </div>
                                <div className="mt-3">
                                    <form>
                                        <label for="small-file-input" className="sr-only">Upload CSV File (Codes) </label>
                                        <input type="file" name="small-file-input" id="small-file-input" accept=".csv" onChange={handleFileUpload} className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 text-white
                                        file:bg-[#575757] file:border-0
                                            file:me-4
                                        file:py-2 file:px-4
                                         dark:file:text-black"/>
                                    </form>
                                </div>
                                <div className="mt-4 flex-grow justify-end space-x-2">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addToStore}
                                        className="px-4 py-2 bg-[#0D151D] text-white rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                                    >
                                        Add
                                    </button>
                                </div>
                            </>) : (<>
                                <h1 className="text-[#7471A4] mt-5 border-solid border-b-2 rounded-md p-1 pl-3"> Available in Store </h1>
                                <div className="flex flex-row gap-5">
                                    <div className="text-[#f1eded] mt-8  p-1 pl-3">
                                        <h1> Copies : {copies}</h1>
                                        <h1> Price : ${gameInfo?.price || price}</h1>
                                    </div>
                                    <div className="text-[#f1eded] mt-5 p-1 pl-3">
                                        <a className="text-sm pl-1 pb-1 text-[#EDEDED]"> Add More Copies / Keys</a>
                                        <div className="flex flex-row">
                                            <form>
                                                <label for="small-file-input" className="sr-only">Upload CSV File (Codes) </label>
                                                <input type="file" name="small-file-input" id="small-file-input" accept=".csv" onChange={handleFileUpload} className="block w-full border border-gray-200 shadow-sm rounded-lg focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 text-white
                                        file:bg-[#575757] file:border-0
                                            file:me-4
                                        file:py-2 file:px-4
                                         dark:file:text-black text-[12px]"/>
                                            </form>
                                            <button
                                                onClick={updateStoreGame}
                                                className="px-4 py-2 bg-[#0D151D] text-white rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm ml-2"
                                            >
                                                Add
                                            </button>
                                        </div>


                                    </div>

                                </div>
                                <div className="flex flex-row gap-4">
                                    <button
                                        onClick={removeStoreGame}
                                        className="px-2 py-1 mt-3 bg-[#0D151D] text-[#EDEDED] rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center gap-2 border-1 border-black "
                                    >
                                        <i className="fas fa-trash"></i> Remove Entry From Store
                                    </button>
                                    <button
                                        onClick={downloadCSV}
                                        className="px-2 py-1 mt-3 bg-[#1c2b3a] text-[#EDEDED] rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center gap-2"
                                    >
                                        <i className="fas fa-download"></i> Download Keys (.csv)
                                    </button>

                                </div>
                                {/** show warning pop up */}


                                {/*<div className="flex flex-row gap-2">
                                    <div className="w-full max-w-[200px] min-w-[10px] mt-5">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                                placeholder="Add Copies"
                                                onChange={(e) => setPrice(e.target.value)}
                                            />

                                            <i className="absolute w-5 h-5 top-2.5 right-2.5 text-slate-600"></i>
                                        </div>
                                    </div>
                                </div>*/}</>)
                        }

                    </div>
                </div>
            </div>
        </div >
    );
};

export default Modal;
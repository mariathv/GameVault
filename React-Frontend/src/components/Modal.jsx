"use client"

import { useState, useEffect, useCallback } from "react"
import { AspectRatio, Image } from "@chakra-ui/react"
import { apiRequest } from "../hooks/api/api-gamevault"
import { truncateTextWords } from "../utils/truncateText"
import { Download, Trash, DollarSign, X } from "lucide-react"

const Modal = ({ isOpen, onClose, gameInfo, setgameInfo, cover, inStore, setInStore, fetchGamesFunc }) => {
    const [isModalOpen, setIsModalOpen] = useState(isOpen)
    const [price, setPrice] = useState(null)
    const [gameKeys, setGameKeys] = useState(null)
    const [constGameKeys, setConstGameKeys] = useState(null)
    const [isShowMore, setShowMore] = useState(false)
    const [gameId, setGameId] = useState(gameInfo?._id || null)
    const [copies, setCopies] = useState(gameInfo?.gameKeys?.length || null)
    const [err, setErr] = useState(null)

    let isRemoveFromStore = false

    useEffect(() => {
        setIsModalOpen(isOpen)
    }, [isOpen])

    const closeModal = useCallback(() => {
        setIsModalOpen(false)
        onClose(isRemoveFromStore)
    }, [onClose])

    const handleEscape = useCallback(
        (event) => {
            if (event.key === "Escape") {
                closeModal()
            }
        },
        [closeModal],
    )

    const handleFileUpload = (event) => {
        const file = event.target.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target.result
                const lines = text.split(/\r?\n/)
                const firstColumn = lines.map((line) => line.split(",")[0]).filter((value) => value.trim() !== "")
                if (firstColumn.length == 0) {
                    console.log("keys 0")
                    return
                }
                setGameKeys(firstColumn)
            }

            reader.readAsText(file)
        }
    }

    const downloadCSV = () => {
        if (!gameInfo?.gameKeys || gameInfo?.gameKeys?.length === 0) {
            console.log("No keys available to download.")
            return
        }

        const csvContent = "data:text/csv;charset=utf-8," + gameInfo.gameKeys.join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "game_keys.csv")

        document.body.appendChild(link)

        console.log("downloading")
        link.click()
        document.body.removeChild(link)
    }

    const addToStore = async () => {
        if (!validate()) {
            console.log("Missing fields!")
            return
        }
        try {
            const pricenum = Number.parseInt(price, 10)
            const coverImageURLHD = convertImageUrl(cover)
            let newGame = { ...gameInfo, cover_url: coverImageURLHD, gameKeys, price: pricenum, copies: gameKeys.length }

            const reqapi = await apiRequest("store/add-game/", { newGame })

            if (!reqapi.success) {
                console.log("Error: Failed to add game!")
                return
            }

            console.log("Successfully added")

            newGame = { ...newGame, _id: reqapi.gameId }

            setConstGameKeys(gameKeys)
            setGameKeys(null)
            setInStore(true)
            setgameInfo(newGame)
            setGameId(reqapi.gameId)
            setCopies(gameKeys.length)
        } catch (error) {
            console.log("Error:", error)
            return
        }
    }

    const removeStoreGame = async () => {
        try {
            const id = gameId
            const reqapi = await apiRequest("store/game/delete/", { gameId: id }, "DELETE")
            if (!reqapi.success) {
                console.log("Error! Failed to remove game from store")
            } else {
                console.log("Successfully removed game from store")
                isRemoveFromStore = true
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateStoreGame = async () => {
        if (!gameKeys) {
            console.log("game keys not added")
            return
        }

        try {
            console.log(gameInfo)
            const newGame = { ...gameInfo, _id: gameId }
            newGame.copies = gameKeys.length + (gameInfo.gameKeys?.length || 0)

            console.log("before", gameInfo.gameKeys?.length || 0)
            console.log("after", gameKeys.length)

            newGame.gameKeys = [...(newGame.gameKeys || []), ...gameKeys]

            console.log("sending update", newGame)
            const reqapi = await apiRequest("store/games/update/", { update: newGame })

            setCopies(newGame.gameKeys.length)

            if (!reqapi.success) {
                console.log("Error: Failed to update game!")
                return
            }

            console.log("Successfully updated")

            setConstGameKeys(newGame.gameKeys)
            setGameKeys(null)
            if (fetchGamesFunc) {
                fetchGamesFunc()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
        }
    }, [isModalOpen, handleEscape])

    if (!isModalOpen) return null

    function convertImageUrl(url, newSize = "t_1080p") {
        return url.replace(/t_[^/]+/, newSize)
    }

    function validate() {
        if (!price || !gameKeys) {
            return false
        }

        return true
    }

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-opacity-10 items-center flex justify-center">
            <div className="fixed inset-0 backdrop-blur-custom transition-opacity" onClick={closeModal}></div>
            <div className="flex flex-row justify-center items-center w-full h-full p-4">
                <div className="relative bg-[#141B26] w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl rounded-lg shadow-lg flex flex-col md:flex-row overflow-auto max-h-[90vh]">
                    {/* Close button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white z-10 p-1"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Image Section */}
                    <div className="p-4 md:p-5 flex justify-center md:justify-start md:min-w-[200px] md:max-w-[250px]">
                        <div className="w-full max-w-[180px] md:w-full">
                            <AspectRatio ratio={3 / 4}>
                                <Image
                                    src={convertImageUrl(cover) || "/placeholder.svg"}
                                    borderRadius="10"
                                    alt={gameInfo?.name}
                                    className="object-cover"
                                />
                            </AspectRatio>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-4 pb-5 md:px-6 md:py-4 flex-grow">
                        <h2 id="modal-title" className="text-lg sm:text-xl font-semibold mb-2 text-[#EDEDED] pr-6">
                            {gameInfo?.name}
                        </h2>
                        <p className="text-[#EDEDED] text-xs sm:text-sm">
                            {!isShowMore ? truncateTextWords(gameInfo?.summary, 50) : truncateTextWords(gameInfo?.summary, 200)}

                            {gameInfo?.summary?.split(" ").length > 50 && (
                                <button
                                    className="pl-2 hover:text-[#474751] text-[#7471A4] text-xs sm:text-sm"
                                    onClick={() => setShowMore(!isShowMore)}
                                >
                                    {isShowMore ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </p>

                        {inStore === false ? (
                            <>
                                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                    <div className="w-full sm:max-w-[200px]">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-slate-400 text-slate-200 text-sm border border-slate-600 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-500 shadow-sm focus:shadow"
                                                placeholder="Price"
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                            <DollarSign className="absolute w-4 h-4 top-2.5 right-2.5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <form>
                                        <label htmlFor="file-input" className="block text-xs sm:text-sm text-[#EDEDED] mb-1">
                                            Upload CSV File (Game Keys)
                                        </label>
                                        <input
                                            type="file"
                                            name="file-input"
                                            id="file-input"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                            className="block w-full border border-gray-600 shadow-sm rounded-lg text-xs sm:text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white
                      file:bg-[#575757] file:border-0
                      file:me-4
                      file:py-1.5 file:px-3 sm:file:py-2 sm:file:px-4
                      file:text-white text-xs sm:text-sm"
                                        />
                                    </form>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={closeModal}
                                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-xs sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addToStore}
                                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0D151D] text-white rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-xs sm:text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-[#7471A4] mt-4 border-solid border-b-2 rounded-md p-1 pl-3 text-sm sm:text-base">
                                    Available in Store
                                </h1>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                                    <div className="text-[#f1eded] mt-3 sm:mt-4 p-1 pl-3">
                                        <h1 className="text-xs sm:text-sm">Copies: {copies}</h1>
                                        <h1 className="text-xs sm:text-sm">Price: ${gameInfo?.price || price}</h1>
                                    </div>
                                    <div className="text-[#f1eded] mt-2 sm:mt-3 p-1 pl-3">
                                        <p className="text-xs sm:text-sm pb-1 text-[#EDEDED]">Add More Copies / Keys</p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <form className="flex-grow">
                                                <label htmlFor="small-file-input" className="sr-only">
                                                    Upload CSV File (Codes)
                                                </label>
                                                <input
                                                    type="file"
                                                    name="small-file-input"
                                                    id="small-file-input"
                                                    accept=".csv"
                                                    onChange={handleFileUpload}
                                                    className="block w-full border border-gray-600 shadow-sm rounded-lg focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white
                          file:bg-[#575757] file:border-0
                          file:me-2 sm:file:me-4
                          file:py-1 file:px-2 sm:file:py-1.5 sm:file:px-3
                          file:text-white text-[10px] sm:text-xs"
                                                />
                                            </form>
                                            <button
                                                onClick={updateStoreGame}
                                                className="px-3 py-1.5 bg-[#0D151D] text-white rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-xs"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 mt-3">
                                    <button
                                        onClick={removeStoreGame}
                                        className="px-2 py-1.5 bg-[#0D151D] text-[#EDEDED] rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center justify-center xs:justify-start gap-2 text-xs"
                                    >
                                        <Trash className="h-3.5 w-3.5" /> Remove From Store
                                    </button>
                                    <button
                                        onClick={downloadCSV}
                                        className="px-2 py-1.5 bg-[#1c2b3a] text-[#EDEDED] rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center justify-center xs:justify-start gap-2 text-xs"
                                    >
                                        <Download className="h-3.5 w-3.5" /> Download Keys (.csv)
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal

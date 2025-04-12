"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCallback } from "react"
import { apiRequest } from "../hooks/api/api-gamevault"
import InputWithButton from "./ui/input-with-button"
import { setGameDiscount } from "../api/store"
import { Download, Trash } from "lucide-react"

export function GameModal({ isOpen, onClose, game, inStore }) {
    const [gameInfo, setGameInfo] = useState({
        ...game,
        price: game.price || 59.99,
        gameKeys: game.gameKeys || [],
        newKey: "",
    })
    const [gameKeys, setGameKeys] = useState(null)
    const [constGameKeys, setConstGameKeys] = useState(null)
    const [isFeatured, setIsFeatured] = useState(game.isFeatured || false)
    const [discountSet, setDiscountSet] = useState(false)
    const [discountSetLoading, setDiscountSetLoading] = useState(false)
    const [discountPrice, setDiscountPrice] = useState(null)

    const handleSetFeatured = async () => {
        try {
            const response = await apiRequest("store/set-featured", { gameId: gameInfo._id })
            if (response.success) {
                setIsFeatured(true)
                console.log("Game set as featured")
            } else {
                console.log("Failed to set game as featured")
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setGameInfo((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddKey = () => {
        if (gameInfo.newKey.trim()) {
            setGameInfo((prev) => ({
                ...prev,
                gameKeys: [...(prev.gameKeys || []), prev.newKey],
                newKey: "",
            }))
        }
    }

    const closeModal = useCallback(() => {
        onClose(isRemoveFromStore)
    }, [onClose])

    const handleSave = async () => {
        console.log("Saving game:", gameInfo)
        await updateStoreGame()
        onClose(true)
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

    let isRemoveFromStore = false

    const updateStoreGame = async () => {
        try {
            const updatedGame = {
                ...gameInfo,
                copies: gameInfo.gameKeys.length,
            }

            const response = await apiRequest("store/games/update/", { update: updatedGame })

            if (!response.success) {
                console.log("Error: Failed to update game!")
                return
            }

            console.log("Successfully updated game")
        } catch (error) {
            console.log(error)
        }
    }

    const removeStoreGame = async () => {
        try {
            const id = gameInfo?._id
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

    const handleFileUpload = (event) => {
        const file = event.target.files[0]

        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target.result
                const lines = text.split(/\r?\n/)
                const firstColumn = lines.map((line) => line.split(",")[0]).filter((value) => value.trim() !== "")

                if (firstColumn.length === 0) {
                    console.log("No keys found in CSV.")
                    return
                }

                setGameInfo((prev) => {
                    const existingKeys = Array.isArray(prev.gameKeys) ? prev.gameKeys : []
                    const mergedKeys = Array.from(new Set([...existingKeys, ...firstColumn]))
                    return {
                        ...prev,
                        gameKeys: mergedKeys,
                    }
                })

                event.target.value = null
            }

            reader.readAsText(file)
        }
    }

    const setDiscount = async (price) => {
        setDiscountSet(false)
        setDiscountSetLoading(true)
        const req = await setGameDiscount(game._id, price)
        console.log("disc req", req)
        setDiscountPrice(price)
        setDiscountSet(true)
        setDiscountSetLoading(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="bg-[#1D2127] text-white border-[#2D3237] max-w-[90vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[65vw] xl:max-w-4xl p-6 sm:p-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">{inStore ? "Edit Game" : "Add Game to Store"}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 py-2 sm:py-4">
                    <div className="w-full max-w-[200px] sm:max-w-none mx-auto md:mx-0">
                        <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-md">
                            <img src={game.cover_url || "/placeholder.svg"} alt={game.name} className="object-cover w-full h-full" />
                        </AspectRatio>
                    </div>

                    <div className="md:col-span-2">
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="bg-[#2D3237] w-full mb-2">
                                <TabsTrigger
                                    value="details"
                                    className="flex-1 data-[state=active]:bg-(--color-accent-alt) text-sm sm:text-base"
                                >
                                    Details
                                </TabsTrigger>
                                <TabsTrigger
                                    value="keys"
                                    className="flex-1 data-[state=active]:bg-(--color-accent-alt) text-sm sm:text-base"
                                >
                                    Game Keys
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-3 sm:space-y-4 mt-2 sm:mt-4">
                                <div className="space-y-1 sm:space-y-2">
                                    <Label className="font-bold text-base sm:text-lg line-clamp-2">{gameInfo.name}</Label>
                                </div>

                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="price" className="text-sm sm:text-base">
                                        Price ($)
                                    </Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={gameInfo.price}
                                        onChange={handleInputChange}
                                        className="bg-[#2D3237] border-[#3D4247] h-9 sm:h-10"
                                    />
                                </div>

                                <div className="text-sm sm:text-base">
                                    Current Discount Value: ${discountPrice || game.discountPercentage || 0}
                                </div>

                                <div className="w-full">
                                    <InputWithButton
                                        inputText="Enter Discount"
                                        buttonText="Set"
                                        confirmation="true"
                                        onButtonClick={setDiscount}
                                    />
                                </div>

                                {discountSetLoading && <div className="loader-dots ml-5 text-white"></div>}
                                {discountSet && <h3 className="text-xs text-green-600">Discount Set Successfully!</h3>}

                                <div className="space-y-1 sm:space-y-2">
                                    <Label htmlFor="keys-count" className="text-sm sm:text-base">
                                        No. of Keys: {gameInfo?.gameKeys?.length || 0}
                                    </Label>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                                    <Button
                                        onClick={removeStoreGame}
                                        variant="destructive"
                                        size="sm"
                                        className="text-xs sm:text-sm h-8 sm:h-9"
                                    >
                                        <Trash className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Remove From Store
                                    </Button>

                                    <Button
                                        onClick={handleSetFeatured}
                                        disabled={isFeatured}
                                        size="sm"
                                        className={`text-xs sm:text-sm h-8 sm:h-9 ${isFeatured
                                            ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                                            : "bg-(--color-accent-primary) hover:bg-(--color-accent-primary)/80"
                                            }`}
                                    >
                                        {isFeatured ? "Already Featured" : "Set Featured"}
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="keys" className="space-y-3 sm:space-y-4 mt-2 sm:mt-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm sm:text-base">Game Keys ({gameInfo.gameKeys?.length || 0})</Label>
                                    </div>
                                    <div className="max-h-[150px] sm:max-h-[200px] overflow-y-auto bg-[#2D3237] p-2 rounded-md">
                                        {gameInfo.gameKeys && gameInfo.gameKeys.length > 0 ? (
                                            <ul className="space-y-1">
                                                {gameInfo.gameKeys.map((key, index) => (
                                                    <li key={index} className="text-xs sm:text-sm font-mono bg-[#3D4247] p-1 rounded">
                                                        {key}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-400 text-xs sm:text-sm">No game keys added yet.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2">
                                    <Input
                                        placeholder="Add new game key"
                                        name="newKey"
                                        value={gameInfo.newKey}
                                        onChange={handleInputChange}
                                        className="bg-[#2D3237] border-[#3D4247] h-9 sm:h-10 flex-grow"
                                    />
                                    <Button
                                        onClick={handleAddKey}
                                        className="bg-(--color-accent-alt) hover:bg-(--color-accent-alt)/50 h-9 sm:h-10 text-xs sm:text-sm"
                                    >
                                        Add Key
                                    </Button>
                                </div>

                                <Button
                                    onClick={downloadCSV}
                                    className="bg-(--color-accent-alt) hover:bg-(--color-accent-alt)/50 w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
                                >
                                    <Download className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Download Keys (.csv)
                                </Button>

                                <div className="mt-2 sm:mt-3">
                                    <form>
                                        <label htmlFor="small-file-input" className="block text-xs sm:text-sm mb-1">
                                            Upload CSV File (Codes)
                                        </label>
                                        <input
                                            type="file"
                                            name="small-file-input"
                                            id="small-file-input"
                                            onChange={handleFileUpload}
                                            accept=".csv"
                                            className="block w-full border border-gray-200 shadow-sm rounded-lg text-xs sm:text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 text-white
                      file:bg-[#575757] file:border-0
                      file:me-4
                      file:py-1 file:px-3 sm:file:py-2 sm:file:px-4
                      dark:file:text-black"
                                        />
                                    </form>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4 sm:mt-0">
                    <Button
                        variant="outline"
                        onClick={() => onClose()}
                        className="border-[#3D4247] text-white hover:bg-[#2D3237] hover:text-white order-2 sm:order-1 w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-(--color-accent-alt) hover:bg-(--color-accent-alt)/50 order-1 sm:order-2 w-full sm:w-auto"
                    >
                        {inStore ? "Save Changes" : "Add to Store"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCallback } from "react"
import { apiRequest } from "../hooks/api/api-gamevault"
import InputWithButton from "./ui/input-with-button"
import ConfirmationModel from "./ui/confirmation-model"
import { setGameDiscount } from "../api/store"

export function GameModal({ isOpen, onClose, game, inStore }) {
    const [gameInfo, setGameInfo] = useState({
        ...game,
        price: game.price || 59.99,
        gameKeys: game.gameKeys || [],
        newKey: "",
    })
    const [gameKeys, setGameKeys] = useState(null);
    const [constGameKeys, setConstGameKeys] = useState(null);
    const [isFeatured, setIsFeatured] = useState(game.isFeatured || false);
    const [discountSet, setDiscountSet] = useState(false);
    const [discountSetLoading, setDiscountSetLoading] = useState(false);
    const [discountPrice, setDiscountPrice] = useState(null);

    const handleSetFeatured = async () => {
        try {
            const response = await apiRequest("store/set-featured", { gameId: gameInfo._id });
            if (response.success) {
                setIsFeatured(true);
                console.log("Game set as featured");
            } else {
                console.log("Failed to set game as featured");
            }
        } catch (error) {
            console.error(error);
        }
    };


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
        onClose(isRemoveFromStore);
    }, [onClose]);


    const handleSave = async () => {
        console.log("Saving game:", gameInfo)
        await updateStoreGame();
        onClose(true)
    }

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

    let isRemoveFromStore = false;

    const updateStoreGame = async () => {
        try {
            const updatedGame = {
                ...gameInfo,
                copies: gameInfo.gameKeys.length,
            };

            const response = await apiRequest("store/games/update/", { update: updatedGame });

            if (!response.success) {
                console.log("Error: Failed to update game!");
                return;
            }

            console.log("Successfully updated game");
        } catch (error) {
            console.log(error);
        }
    };


    const removeStoreGame = async () => {
        try {
            let id = gameInfo?._id;
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

                if (firstColumn.length === 0) {
                    console.log("No keys found in CSV.");
                    return;
                }

                setGameInfo((prev) => {
                    const existingKeys = Array.isArray(prev.gameKeys) ? prev.gameKeys : [];
                    const mergedKeys = Array.from(new Set([...existingKeys, ...firstColumn]));
                    return {
                        ...prev,
                        gameKeys: mergedKeys,
                    };
                });

                event.target.value = null;
            };

            reader.readAsText(file);
        }
    };

    const setDiscount = async (price) => {
        setDiscountSet(false);
        setDiscountSetLoading(true);
        const req = await setGameDiscount(game._id, price);
        console.log("disc req", req);
        setDiscountPrice(price);
        setDiscountSet(true);
        setDiscountSetLoading(false);
    }



    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="bg-[#1D2127] text-white border-[#2D3237] min-w-4xl">
                <DialogHeader>
                    <DialogTitle>{inStore ? "Edit Game" : "Add Game to Store"}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    <div>
                        <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-md">
                            <img src={game.cover_url || "/placeholder.svg"} alt={game.name} className="object-cover w-full h-full" />
                        </AspectRatio>
                    </div>

                    <div className="md:col-span-2 ">
                        <Tabs defaultValue="details">
                            <TabsList className="bg-[#2D3237]">
                                <TabsTrigger value="details" className="data-[state=active]:bg-(--color-accent-alt)">
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="keys" className="data-[state=active]:bg-(--color-accent-alt)">
                                    Game Keys
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-1xl"> {gameInfo.name}</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={gameInfo.price}
                                        onChange={handleInputChange}
                                        className="bg-[#2D3237] border-[#3D4247]"
                                    />
                                </div>
                                <div> Current Discount Value : ${discountPrice || game.discountPercentage || 0}</div>
                                <InputWithButton inputText="Enter Discount" buttonText="Set" confirmation="true" onButtonClick={setDiscount} />

                                {discountSetLoading && <div className="loader-dots ml-5 text-white"></div>}
                                {discountSet && <h3 className="text-xs text-green-600"> Discount Set Successfully!</h3>}

                                <div className="space-y-2">
                                    <Label htmlFor="price">No. of Keys : {gameInfo?.gameKeys?.length || 0}</Label>

                                </div>
                                <button
                                    onClick={removeStoreGame}
                                    className="px-2 py-1 mt-3 bg-[#0D151D] text-[#EDEDED] rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center gap-2 border-1 border-black text-sm "
                                >
                                    <i className="fas fa-trash"></i> Remove From Store
                                </button>
                                <button
                                    onClick={handleSetFeatured}
                                    disabled={isFeatured}
                                    className="px-2 py-1 mt-3 bg-(--color-accent-primary) text-[#EDEDED] rounded hover:bg-[#030404] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center gap-2 border-1 border-black text-sm "
                                >
                                    {isFeatured ? "Already Featured" : "Set Featured"}
                                </button>

                                {/* <div className="space-y-2">
                                    <Label className="font-bold text-sm">Discount / Sale:</Label>
                                </div> */}
                            </TabsContent>

                            <TabsContent value="keys" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <div className="flex flex-row">
                                        <Label>Game Keys ({gameInfo.gameKeys?.length || 0})</Label>
                                        <div className="flex flex-row gap-4">



                                        </div>
                                    </div>
                                    <div className="max-h-[200px] overflow-y-auto bg-[#2D3237] p-2 rounded-md">
                                        {gameInfo.gameKeys && gameInfo.gameKeys.length > 0 ? (
                                            <ul className="space-y-1">
                                                {gameInfo.gameKeys.map((key, index) => (
                                                    <li key={index} className="text-sm font-mono bg-[#3D4247] p-1 rounded">
                                                        {key}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-400 text-sm">No game keys added yet.</p>
                                        )}
                                    </div>
                                </div>



                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Add new game key"
                                        name="newKey"
                                        value={gameInfo.newKey}
                                        onChange={handleInputChange}
                                        className="bg-[#2D3237] border-[#3D4247]"
                                    />
                                    <Button onClick={handleAddKey} className="bg-(--color-accent-alt) hover:bg-(--color-accent-alt)/50">
                                        Add Key
                                    </Button>
                                    <Button onClick={downloadCSV} className="bg-(--color-accent-alt) hover:bg-(--color-accent-alt)/50">
                                        <i className="fas fa-download"></i> Download Keys (.csv)
                                    </Button>

                                </div>
                                <div className="mt-3">
                                    <form>
                                        <label for="small-file-input" className="sr-only">Upload CSV File (Codes) </label>
                                        <input type="file" name="small-file-input" id="small-file-input" onChange={handleFileUpload} accept=".csv" className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 text-white
                                        file:bg-[#575757] file:border-0
                                            file:me-4
                                        file:py-2 file:px-4
                                         dark:file:text-black"/>
                                    </form>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onClose()}
                        className="border-[#3D4247] text-white hover:bg-[#2D3237] hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-(--color-accent-alt) hover:bg-(--color-accent-alt)/50">
                        {inStore ? "Save Changes" : "Add to Store"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

/*
-> check if game featured, if its already featured, remove button and add simple text informing that already featured

*/
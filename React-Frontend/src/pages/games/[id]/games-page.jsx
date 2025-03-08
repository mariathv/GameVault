"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    Check,
    Info,
    Cpu,
    MemoryStickIcon as Memory,
    HardDrive,
    Monitor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/src/components/Header"
import { games } from "@/dummydata-lib/data"
import { useCart } from "@/src/contexts/cart-context"

export default function GamePage() {
    const { id } = useParams();
    const { addToCart } = useCart()
    const [activeTab, setActiveTab] = useState("overview")
    const [activeScreenshot, setActiveScreenshot] = useState(0)
    const gameId = Number.parseInt(id)
    const game = games.find((g) => g.id === gameId)

    if (!game) {
        return (
            <div className="min-h-screen bg-[#14202C] flex flex-col items-center justify-center text-[#EDEDED]">
                <h1 className="text-3xl font-bold mb-4">Game Not Found</h1>
                <p className="mb-6">The game you're looking for doesn't exist.</p>
                <Button onClick={() => navigate("/")} className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90">
                    Return to Home
                </Button>

            </div>
        )
    }

    const discountedPrice = game.onSale ? game.price * (1 - game.discount / 100) : game.price

    return (
        <div className="min-h-screen bg-[#14202C]">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column - Game Images */}
                    <div className="lg:col-span-2">
                        <div className="mb-4 overflow-hidden rounded-lg">
                            <img
                                src={activeScreenshot === 0 ? game.image : game.screenshots[activeScreenshot - 1]}
                                alt={game.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                            <button
                                onClick={() => setActiveScreenshot(0)}
                                className={`overflow-hidden rounded-md border-2 ${activeScreenshot === 0 ? "border-[#EDEDED]" : "border-transparent"}`}
                            >
                                <img
                                    src={game.image || "/placeholder.svg"}
                                    alt="Main"
                                    className="w-full h-auto object-cover aspect-video"
                                />
                            </button>

                            {game.screenshots.map((screenshot, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveScreenshot(index + 1)}
                                    className={`overflow-hidden rounded-md border-2 ${activeScreenshot === index + 1 ? "border-[#EDEDED]" : "border-transparent"}`}
                                >
                                    <img
                                        src={screenshot || "/placeholder.svg"}
                                        alt={`Screenshot ${index + 1}`}
                                        className="w-full h-auto object-cover aspect-video"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Game Info */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDEDED] mb-2">{game.title}</h1>

                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="border-[#EDEDED]/20 bg-[#EDEDED]/5">
                                <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                                {game.rating}
                            </Badge>
                            <Badge variant="outline" className="border-[#EDEDED]/20 bg-[#EDEDED]/5">
                                {game.genre}
                            </Badge>
                        </div>

                        <p className="text-[#EDEDED]/80 mb-6">{game.description}</p>

                        <div className="mb-6">
                            {game.onSale ? (
                                <div className="mb-2">
                                    <span className="text-2xl font-bold text-green-400">${discountedPrice.toFixed(2)}</span>
                                    <span className="ml-2 text-lg line-through text-[#EDEDED]/60">${game.price.toFixed(2)}</span>
                                    <Badge className="ml-2 bg-green-500">{game.discount}% OFF</Badge>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold text-[#EDEDED] mb-2">${game.price.toFixed(2)}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 mb-6">
                            <Button
                                className="w-full bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90"
                                onClick={() => addToCart(game.id)}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                            </Button>

                            <Button variant="outline" className="w-full border-[#EDEDED]/10 text-[#EDEDED] hover:bg-[#EDEDED]/10">
                                <Heart className="mr-2 h-4 w-4" />
                                Add to Wishlist
                            </Button>

                            <Button variant="outline" className="w-full border-[#EDEDED]/10 text-[#EDEDED] hover:bg-[#EDEDED]/10">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12">
                    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-[#EDEDED]/5 border-b border-[#EDEDED]/10">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-[#EDEDED]/10">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="features" className="data-[state=active]:bg-[#EDEDED]/10">
                                Features
                            </TabsTrigger>
                            <TabsTrigger value="system" className="data-[state=active]:bg-[#EDEDED]/10">
                                System Requirements
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="pt-6">
                            <p className="text-[#EDEDED]/80 whitespace-pre-line">{game.longDescription}</p>
                        </TabsContent>

                        <TabsContent value="features" className="pt-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                {game.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-400 mt-0.5" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="system" className="pt-6">
                            <p className="text-[#EDEDED]/80">Minimum: {game.systemRequirements.minimum.os}</p>
                            <p className="text-[#EDEDED]/80">Recommended: {game.systemRequirements.recommended.os}</p>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}

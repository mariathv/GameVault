"use client"

import { useState } from "react"
import { Search, ShoppingCart, Star, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for genres and games
const genres = ["Action", "Adventure", "RPG", "Strategy", "Sports", "Racing", "Simulation", "Indie"]

const featuredGames = [
    {
        id: 1,
        title: "Cyber Adventures 2077",
        description: "An epic open-world adventure in a dystopian future",
        price: 59.99,
        rating: 4.5,
        genre: "Action",
        image: "https://timelinecovers.pro/facebook-cover/download/video-game-cyberpunk-2077-facebook-cover.jpg",
    },
    {
        id: 2,
        title: "Medieval Kingdom",
        description: "Build your empire in this strategic medieval simulation",
        price: 49.99,
        rating: 4.8,
        genre: "Strategy",
        image: "/placeholder.svg?height=300&width=400",
    },
    {
        id: 3,
        title: "Space Explorer",
        description: "Explore the vast universe in this sci-fi adventure",
        price: 39.99,
        rating: 4.2,
        genre: "Adventure",
        image: "/placeholder.svg?height=300&width=400",
    },
    {
        id: 4,
        title: "Racing Champions",
        description: "Experience high-speed racing action",
        price: 44.99,
        rating: 4.6,
        genre: "Racing",
        image: "/placeholder.svg?height=300&width=400",
    },
    {
        id: 5,
        title: "Fantasy Quest",
        description: "Embark on an epic journey in a magical realm",
        price: 54.99,
        rating: 4.7,
        genre: "RPG",
        image: "/placeholder.svg?height=300&width=400",
    },
    {
        id: 6,
        title: "City Builder Pro",
        description: "Create and manage your own metropolis",
        price: 34.99,
        rating: 4.4,
        genre: "Simulation",
        image: "/placeholder.svg?height=300&width=400",
    },
]

export default function HomeGameStore() {
    const [selectedGenre, setSelectedGenre] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredGames = featuredGames.filter((game) => {
        const matchesGenre = selectedGenre === "All" || game.genre === selectedGenre
        return matchesGenre
    })

    return (
        <div className="min-h-screen bg-[#14202C]">
            <header className="border-b border-[#EDEDED]/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold text-[#EDEDED]">Game Store</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 md:min-w-[300px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#EDEDED]/60" />
                                <Input
                                    placeholder="Search games..."
                                    className="bg-[#EDEDED]/10 pl-10 text-[#EDEDED]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-[#EDEDED]/10 bg-transparent text-[#EDEDED] hover:bg-[#EDEDED]/10 hover:text-[#EDEDED]"
                            >
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-[#EDEDED]/10 bg-transparent text-[#EDEDED] hover:bg-[#EDEDED]/10 hover:text-[#EDEDED]"
                            >
                                <User className="h-5 w-5" />

                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <section className="relative h-[500px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://timelinecovers.pro/facebook-cover/download/video-game-cyberpunk-2077-facebook-cover.jpg')`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14202C] to-transparent" />
                </div>
                <div className="container relative mx-auto h-full px-4">
                    <div className="flex h-full flex-col justify-end pb-16">
                        <Badge className="mb-4 w-fit bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90">Featured Game</Badge>
                        <h2 className="mb-2 text-4xl font-bold text-[#EDEDED] md:text-5xl lg:text-6xl">Cyber Adventures 2077</h2>
                        <p className="mb-6 max-w-2xl text-lg text-[#EDEDED]/80">
                            Experience the future in this groundbreaking open-world adventure. Customize your character, explore vast
                            cityscapes, and shape your own destiny.
                        </p>
                        <Button className="w-fit bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90">Learn More</Button>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h3 className="mb-4 text-lg font-semibold text-[#EDEDED]">Browse by Genre</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedGenre === "All" ? "default" : "outline"}
                            onClick={() => setSelectedGenre("All")}
                            className={
                                selectedGenre === "All"
                                    ? "bg-[#0F161E] text-[#EDEDED] hover:bg-[#EDEDED]/90  border-1"
                                    : "border-[#EDEDED]/10  text-[#030404] hover:bg-[#EDEDED]/10"
                            }
                        >
                            All Games
                        </Button>
                        {genres.map((genre) => (
                            <Button
                                key={genre}
                                variant={selectedGenre === genre ? "default" : "outline"}
                                onClick={() => setSelectedGenre(genre)}
                                className={
                                    selectedGenre === genre
                                        ? "bg-[#0F161E] text-[#EDEDED] hover:bg-[#EDEDED]/90 border-1"
                                        : "border-[#EDEDED]/10  text-[#030404] hover:bg-[#EDEDED]/10"
                                }
                            >
                                {genre}
                            </Button>
                        ))}
                    </div>
                </div>
                <h1 className="text-[#EDEDED] text-4xl font-bold mb-6"> Popular </h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGames.map((game) => (
                        <Card key={game.id} className="overflow-hidden border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED]">
                            <div className="aspect-video w-full overflow-hidden">
                                <img
                                    src={game.image || "/placeholder.svg"}
                                    alt={game.title}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{game.title}</CardTitle>
                                        <CardDescription className="text-[#EDEDED]/60">{game.genre}</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="border-[#EDEDED]/20 bg-[#EDEDED]/5">
                                        <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                                        {game.rating}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-[#EDEDED]/80">{game.description}</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between">
                                <span className="text-lg font-bold">${game.price}</span>
                                <Button className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90">Add to Cart</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <h1 className="text-[#EDEDED] text-4xl font-bold mb-6 mt-5"> Recently Added </h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGames.map((game) => (
                        <Card key={game.id} className="overflow-hidden border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED]">
                            <div className="aspect-video w-full overflow-hidden">
                                <img
                                    src={game.image || "/placeholder.svg"}
                                    alt={game.title}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{game.title}</CardTitle>
                                        <CardDescription className="text-[#EDEDED]/60">{game.genre}</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="border-[#EDEDED]/20 bg-[#EDEDED]/5">
                                        <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                                        {game.rating}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-[#EDEDED]/80">{game.description}</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between">
                                <span className="text-lg font-bold">${game.price}</span>
                                <Button className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90">Add to Cart</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}


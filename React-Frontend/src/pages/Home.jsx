"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import Header from "../components/Header"
import { games, genres } from "@/dummydata-lib/data"

export default function HomePage() {
    const [selectedGenre, setSelectedGenre] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredGames = games.filter((game) => {
        const matchesGenre = selectedGenre === "All" || game.genre === selectedGenre
        return matchesGenre
    })

    return (
        <div className="min-h-screen bg-[#14202C]">
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <section className="relative h-[500px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2FLNgx4Xjys3cUgn74ezZiwhii6hi2ElO9y7b5uDN-tvCspz84x60QkuZYgntvdYgPMj8_xg7smq8QbSSzJ6EpNFDmsRyDY3IUVOgzJ4jqgwO-2Xqh0Ns2KMK6GMYQlBBtiu2o0o0FHaT/w1920-h1080-c/cyberpunk-2077-v-car-quadra-v-tech-uhdpaper.com-4K-60.jpg')`,
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
                        <Link to="/games/1">
                            <Button className="w-fit bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90">Learn More</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-[#EDEDED] text-4xl font-bold mb-6">Popular</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGames.slice(0, 6).map((game) => (
                        <Card key={game.id} className="overflow-hidden border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED]">
                            <Link href={`/games/${game.id}`}>
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={game.image || "/placeholder.svg"}
                                        alt={game.title}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </Link>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Link href={`/games/${game.id}`}>
                                            <CardTitle className="text-xl hover:text-[#EDEDED]/80 transition-colors">{game.title}</CardTitle>
                                        </Link>
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
                                <Button
                                    className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        window.location.href = `/cart?add=${game.id}`
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <h1 className="text-[#EDEDED] text-4xl font-bold mb-6 mt-12">Recently Added</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGames.slice(3, 9).map((game) => (
                        <Card
                            key={`recent-${game.id}`}
                            className="overflow-hidden border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED]"
                        >
                            <Link href={`/games/${game.id}`}>
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={game.image || "/placeholder.svg"}
                                        alt={game.title}
                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            </Link>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Link href={`/games/${game.id}`}>
                                            <CardTitle className="text-xl hover:text-[#EDEDED]/80 transition-colors">{game.title}</CardTitle>
                                        </Link>
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
                                <Button
                                    className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        window.location.href = `/cart?add=${game.id}`
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mb-8 mt-12">
                    <h3 className="mb-4 text-lg font-semibold text-[#EDEDED]">Browse by Genre</h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedGenre === "All" ? "default" : "outline"}
                            onClick={() => setSelectedGenre("All")}
                            className={
                                selectedGenre === "All"
                                    ? "bg-[#0F161E] text-[#EDEDED] hover:bg-[#EDEDED]/90 border-1"
                                    : "border-[#EDEDED]/10 text-[#EDEDED] hover:bg-[#EDEDED]/10"
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
                                        : "border-[#EDEDED]/10 text-[#EDEDED] hover:bg-[#EDEDED]/10"
                                }
                            >
                                {genre}
                            </Button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}


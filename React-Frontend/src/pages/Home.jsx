"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import Header from "../components/Header"
import { games, genres } from "@/dummydata-lib/data"
import { fetchData } from '../hooks/api/api-gamevault';
import GamesGrid from "../components/GamesGrid"



export default function HomePage() {
    const [selectedGenre, setSelectedGenre] = useState("Action")
    const [searchQuery, setSearchQuery] = useState("")
    const [popularGames, setPopularGames] = useState(null);
    const [recentlyAdded, setRecentlyAdded] = useState(null);


    const filteredGames = games.filter((game) => {
        const matchesGenre = selectedGenre === "All" || game.genre === selectedGenre
        return matchesGenre
    })
    const fetchPopularGames = async () => {

        let fetch = await fetchData("store/games/get-all/?sortBy=hypes&limit=5");
        console.log("fetched pop", fetch);
        setPopularGames(fetch.games);
    }

    const fetchRecentlyAdded = async () => {
        let fetch = await fetchData("store/games/get-all/?sortBy=createdAt&limit=5");

        setRecentlyAdded(fetch.games);
    }




    useEffect(() => {
        console.log("gonna fetch");
        if (popularGames == null || !popularGames)
            fetchPopularGames();
        if (recentlyAdded == null || !recentlyAdded)
            fetchRecentlyAdded()
    }, [])


    return (
        <div className="min-h-screen bg-(--color-background)">

            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <section className="relative h-[500px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2FLNgx4Xjys3cUgn74ezZiwhii6hi2ElO9y7b5uDN-tvCspz84x60QkuZYgntvdYgPMj8_xg7smq8QbSSzJ6EpNFDmsRyDY3IUVOgzJ4jqgwO-2Xqh0Ns2KMK6GMYQlBBtiu2o0o0FHaT/w1920-h1080-c/cyberpunk-2077-v-car-quadra-v-tech-uhdpaper.com-4K-60.jpg')`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-(--color-background) to-transparent" />
                </div>
                <div className="container relative mx-auto h-full px-4">
                    <div className="flex h-full flex-col justify-end pb-16">
                        <Badge className="mb-4 w-fit bg-(--color-secondary-background) text-(--color-alt-foreground)">Featured Game</Badge>
                        <h2 className="mb-2 text-4xl font-bold text-(--color-foreground) md:text-5xl lg:text-6xl">Cyber Adventures 2077</h2>
                        <p className="mb-6 max-w-2xl text-lg text-(--color-foreground)/80">
                            Experience the future in this groundbreaking open-world adventure. Customize your character, explore vast
                            cityscapes, and shape your own destiny.
                        </p>
                        <Link to="/games/1877">
                            <Button className="w-fit bg-(--color-secondary-background) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90">Learn More</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-(--color-foreground) text-4xl font-bold mb-6">Popular</h1>
                {popularGames &&
                    <GamesGrid filteredGames={popularGames} gridCol={5} limit={5} />
                }
                <h1 className="text-(--color-foreground) text-4xl font-bold mb-6 mt-12">Recently Added</h1>
                {recentlyAdded &&
                    <GamesGrid filteredGames={recentlyAdded} gridCol={4} limit={3} variant={"wide"} />
                }



                <div className="mb-8 mt-12">
                    <h3 className="mb-4 text-lg font-semibold text-(--color-foreground)">Browse by Genre</h3>
                    <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                            <Button
                                key={genre}
                                variant={selectedGenre === genre ? "default" : "outline"}
                                onClick={() => setSelectedGenre(genre)}
                                className={
                                    selectedGenre === genre
                                        ? "bg-[#0F161E] text-[#EDEDED] border-1"
                                        : "border-(--color-foreground)/10 text-(--color-foreground)     hover:bg-(--color-light-ed)/10"
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

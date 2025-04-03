import React, { useEffect, useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import Header from "../components/Header"
import { fetchData } from '../hooks/api/api-gamevault';
import GamesGrid from "../components/GamesGrid"
import { getFeatured, getGamesByGenre, getMostPopular } from "../api/store"
import GameCard from "../components/GameCard"
import CarouselSlider from "../components/CarouselSlider"
import GameCardExtended from "../components/GameCardExtended"
import { getGameArtworks } from "../api/game"

export default function HomePage() {
    const [selectedGenre, setSelectedGenre] = useState("Shooter")
    const [searchQuery, setSearchQuery] = useState("")
    const [popularGames, setPopularGames] = useState(null);
    const [recentlyAdded, setRecentlyAdded] = useState(null);
    const [genreGames, setGenreGames] = useState(null);
    const [isGenreLoading, setIsGenreLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [topRated, setTopRated] = useState(null);
    const genres = ["Shooter", "Adventure", "RPG", "Strategy", "Sports", "Racing", "Simulation", "Indie"]
    const [featuredGame, setFeatured] = useState(null);
    const [featuredArtwork, setFeaturedArtwork] = useState(null);
    const [mostPopular, setMostPopular] = useState([]);

    const reverseGenreMapping = {
        Shooter: 5,
        Adventure: 31,
        RPG: 12,
        Strategy: 15,
        Sports: 14,
        Racing: 10,
        Simulation: 13,
        Indie: 32
    };





    const fetchPopularGames = async () => {
        let fetch = await fetchData("store/games/get-all/?sortBy=hypes&limit=5");
        setPopularGames(fetch.games);
    }

    const fetchOnlyArtworks = async (artworkss) => {
        const fetch = await getGameArtworks(artworkss);
        return fetch.queryResult;
    };



    const fetchRecentlyAdded = async () => {
        try {
            let success = false;
            while (!success) {
                if (!recentlyAdded) {
                    let fetch = await fetchData("store/games/get-all/?sortBy=createdAt&limit=3");
                    const games = fetch.games;

                    const gamesWithArtworks = await Promise.all(games.map(async (game) => {
                        const artworks_extracted = await fetchOnlyArtworks(game.artworks);
                        return { ...game, artworks_extracted };
                    }));

                    setRecentlyAdded(gamesWithArtworks);
                    success = true;
                }
            }
        } catch (error) {
            console.error("Error fetching recently added games with artworks:", error);
        }
    };



    const fetchTopRated = async () => {
        let fetch = await fetchData("store/games/get-all/?sortBy=rating&limit=10");
        setTopRated(fetch.games);
    }

    const fetchFeatured = async () => {
        const fetch = await getFeatured();
        setFeatured(fetch.game);
        fetchArtworks(fetch.game.artworks);
    }

    const fetchArtworks = async (artworkss) => {
        const fetch = await getGameArtworks(artworkss);
        setFeaturedArtwork(fetch.queryResult);

    }



    const fetchGenreGames = async () => {
        const genreId = reverseGenreMapping[selectedGenre];
        if (!genreId) return;

        setIsGenreLoading(true);

        try {
            const fetch = await getGamesByGenre(genreId, 5);
            setTimeout(() => {
                setGenreGames(fetch.games);
                setIsGenreLoading(false);
            }, 500);
        } catch (error) {
            setIsGenreLoading(false);
            console.error("Genre fetch failed:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!popularGames) {
                    await fetchPopularGames();
                }
                if (!featuredGame) {
                    await fetchFeatured();
                }
                if (!recentlyAdded) {
                    await fetchRecentlyAdded();
                }
                if (!topRated) {
                    await fetchTopRated();
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetchGenreGames();
    }, [selectedGenre]);

    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;
    }

    return (
        <div className="min-h-screen bg-(--color-background)">
            {/*later make this dynamiccc*/}
            <section className="relative h-[500px] overflow-hidden">
                {
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2FLNgx4Xjys3cUgn74ezZiwhii6hi2ElO9y7b5uDN-tvCspz84x60QkuZYgntvdYgPMj8_xg7smq8QbSSzJ6EpNFDmsRyDY3IUVOgzJ4jqgwO-2Xqh0Ns2KMK6GMYQlBBtiu2o0o0FHaT/w1920-h1080-c/cyberpunk-2077-v-car-quadra-v-tech-uhdpaper.com-4K-60.jpg')`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-(--color-background) to-transparent" />
                    </div>
                }

                <div className="flex container relative mx-auto h-full px-4">
                    <div className="flex h-full flex-col justify-end pb-16">
                        <div>
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
                    <div className="flex h-full flex-col ml-auto py-16  ">{popularGames &&
                        <img
                            src={popularGames[0].cover_url || "/placeholder.svg"}
                            alt={popularGames[0].name || popularGames[0].title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-101 rounded-2xl"
                        />
                    }
                    </div>



                </div>

            </section >

            <main className="container mx-auto px-4 py-8">
                {topRated ? (
                    <>

                        <CarouselSlider mapItems={topRated} />
                    </>) : (<div className="flex justify-center items-center w-full py-8"><div className="loader-dots text-(--color-light-ed)"></div></div>)
                }
                {
                    (featuredGame && featuredArtwork) ? (
                        <GameCardExtended featuredGame={featuredGame} featuredArtwork={featuredArtwork} />) : (<div className="flex justify-center items-center w-full py-8"><div className="loader-dots text-(--color-light-ed)"></div></div>)
                }


                <h1 className="text-(--color-foreground) text-4xl font-bold mb-6">Popular</h1>
                {popularGames ? (
                    <GamesGrid filteredGames={popularGames} gridCol={5} limit={5} />
                ) : (
                    <div className="flex justify-center items-center w-full py-8">
                        <div className="loader-dots text-(--color-foreground)"></div>
                    </div>
                )}

                <h1 className="text-(--color-foreground) text-4xl font-bold mb-6 mt-12">Recently Added</h1>
                {recentlyAdded ? (
                    <GamesGrid filteredGames={recentlyAdded} gridCol={4} limit={3} variant={"wide"} />
                ) : (
                    <div className="flex justify-center items-center w-full py-8">
                        <div className="loader-dots text-(--color-foreground)"></div>
                    </div>
                )}

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
                                        : "border-(--color-foreground)/10 text-(--color-foreground) hover:bg-(--color-light-ed)/10"
                                }
                            >
                                {genre}
                            </Button>
                        ))}
                    </div>
                </div>

                {isGenreLoading ? (
                    <div className="flex justify-center items-center w-full py-8">
                        <div className="loader-dots text-(--color-foreground)"></div>
                    </div>
                ) : genreGames && genreGames.length > 0 ? (
                    <GamesGrid filteredGames={genreGames} gridCol={5} limit={5} />
                ) : (
                    <div className="text-center text-(--color-light-ed) text-sm italic py-6">
                        No games found in this genre.
                    </div>
                )}
            </main>
        </div >
    )
}
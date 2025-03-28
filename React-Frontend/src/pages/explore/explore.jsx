import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Flame, Tag, Clock, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/src/components/Header';
import GamesGrid from '@/src/components/GamesGrid';
import { fetchData } from '@/src/hooks/api/api-gamevault';
import { getGamesByGenre } from '@/src/api/store';

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [games, setGames] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [selectedSort, setSelectedSort] = useState("popularity");

    const genres = ["All", "Shooter", "Adventure", "RPG", "Strategy", "Sports", "Racing", "Simulation", "Indie"];

    const sortOptions = [
        { id: "popularity", label: "Most Popular", icon: Flame },
        { id: "price-low", label: "Price: Low to High", icon: Tag },
        { id: "price-high", label: "Price: High to Low", icon: Tag },
        { id: "rating", label: "Highest Rated", icon: Star },
        { id: "newest", label: "Recently Added", icon: Clock },
    ];

    const filters = [
        { id: "all", label: "All Games" },
        { id: "on-sale", label: "On Sale" },
        { id: "under-20", label: "Under $20" },
        { id: "new-releases", label: "New Releases" },
        { id: "top-rated", label: "Top Rated" },
    ];

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

    const fetchGames = async () => {
        setIsLoading(true);
        let fetch;

        if (selectedGenre === "All") {
            //will change this if data seems to be TO MUCH
            fetch = await fetchData("store/games/get-all/");
        } else {
            const genreId = reverseGenreMapping[selectedGenre];
            fetch = await getGamesByGenre(genreId, 20);
        }

        // Apply filters and sorting
        let filteredGames = fetch.games;

        // Apply active filter
        switch (activeFilter) {
            case "on-sale":
                filteredGames = filteredGames.filter(game => game.discount > 0);
                break;
            case "under-20":
                filteredGames = filteredGames.filter(game => game.price < 20);
                break;
            case "top-rated":
                filteredGames = filteredGames.filter(game => game.rating >= 4);
                break;
            case "new-releases":
                filteredGames = filteredGames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
        }

        // Apply sorting
        switch (selectedSort) {
            case "price-low":
                filteredGames.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filteredGames.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                filteredGames.sort((a, b) => b.rating - a.rating);
                break;
            case "newest":
                filteredGames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
        }

        setTimeout(() => {
            setGames(filteredGames);
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchGames();
    }, [selectedGenre, activeFilter, selectedSort]);

    return (
        <div className="min-h-screen bg-(--color-background)">
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-bold text-(--color-foreground)">Explore Games</h1>
                        <div className="flex items-center space-x-2">
                            <SlidersHorizontal className="h-5 w-5 text-(--color-foreground)" />
                            <span className="text-(--color-foreground)">Sort by:</span>
                            <div className="flex space-x-2">
                                {sortOptions.map(({ id, label, icon: Icon }) => (
                                    <Button
                                        key={id}
                                        variant={selectedSort === id ? "default" : "outline"}
                                        onClick={() => setSelectedSort(id)}
                                        className={
                                            selectedSort === id
                                                ? "bg-(--color-foreground) text-(--color-background)"
                                                : "border-(--color-foreground)/10 text-(--color-foreground) hover:bg-(--color-light-ed)/10"
                                        }
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {filters.map(filter => (
                            <Button
                                key={filter.id}
                                variant={activeFilter === filter.id ? "default" : "outline"}
                                onClick={() => setActiveFilter(filter.id)}
                                className={
                                    activeFilter === filter.id
                                        ? "bg-[#0F161E] text-[#EDEDED]"
                                        : "border-(--color-foreground)/10 text-(--color-foreground) hover:bg-(--color-light-ed)/10"
                                }
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                            <Button
                                key={genre}
                                variant={selectedGenre === genre ? "default" : "outline"}
                                onClick={() => setSelectedGenre(genre)}
                                className={
                                    selectedGenre === genre
                                        ? "bg-[#0F161E] text-[#EDEDED]"
                                        : "border-(--color-foreground)/10 text-(--color-foreground) hover:bg-(--color-light-ed)/10"
                                }
                            >
                                {genre}
                            </Button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center w-full py-8">
                            <div className="loader-dots"></div>
                        </div>
                    ) : games && games.length > 0 ? (
                        <GamesGrid filteredGames={games} gridCol={4} />
                    ) : (
                        <div className="text-center text-(--color-light-ed) text-sm italic py-6">
                            No games found with the selected filters.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
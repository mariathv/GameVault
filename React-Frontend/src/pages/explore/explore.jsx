import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { fetchData } from '@/src/hooks/api/api-gamevault';
import { getFeatured, getGamesByGenre, getMostPopular } from '@/src/api/store';
import Header from '@/src/components/Header';
import { Link } from 'react-router-dom';
import { getGameArtworks } from '@/src/api/game';
import GameCardWide from '@/src/components/wide-game-card';

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState(200);
    const [games, setGames] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [featured, setFeatured] = useState(null);
    const [featuredArtwork, setFeaturedArtwork] = useState(null);
    const [initLoading, setInitLoading] = useState(true);
    const [popularGames, setPopularGames] = useState(null);




    const categories = [
        { id: "all", label: "All" }, // adventure
        { id: "31", label: "Adventure/Quest" }, // adventure
        { id: "12", label: "RPG" }, // RPG
        { id: "15", label: "Strategy" }, // strategy
        { id: "14", label: "Sport" }, // sport
        { id: "10", label: "Racing" }, // racing
        { id: "13", label: "Simulator" }, // simulator
        { id: "32", label: "Indie" }, // indie
    ];


    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;
    }

    const fetchGames = async () => {
        setIsLoading(true);

        const genreId = categories.find(cat => cat.label === selectedCategory)?.id;

        const genreParam = genreId ? `?genre=${genreId}` : "";

        console.log(genreParam, "gn", selectedCategory);
        let fetch;
        if (!searchQuery && genreParam != "?genre=all")
            fetch = await fetchData(`store/games/get-all${genreParam}`);
        else
            fetch = await fetchData(`store/games/get-all`);


        let filteredGames = fetch.games.filter(game =>
            game.price <= priceRange
        );

        if (searchQuery) {
            filteredGames = filteredGames.filter(game =>
                game.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setGames(filteredGames);
        setIsLoading(false);
    };

    const fetchPromisedData = async () => {
        try {
            const fetch = await getFeatured();
            setFeatured(fetch.game);
            await fetchArtworks(fetch.game.artworks); // Ensure artwork fetch completes

            const fetch1 = await fetchData(`store/games/get-all?sortBy=hypes`);
            setPopularGames(fetch1.games);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchArtworks = async (artworks) => {
        try {
            const fetch = await getGameArtworks(artworks);
            setFeaturedArtwork(fetch.queryResult);
        } catch (error) {
            console.error("Error fetching artworks:", error);
        }
    };

    const fetchMostPopular = async () => {
        setInitLoading(true);
        await fetchPromisedData();
        setInitLoading(false);
    };

    useEffect(() => {
        fetchMostPopular();
    }, []);


    useEffect(() => {
        fetchGames();
    }, [selectedCategory, priceRange, searchQuery]);

    if (initLoading) {
        return (
            <div className="min-h-screen bg-(--color-background) flex flex-col items-center justify-center text-(--color-foreground)">
                <div className="loader border-t-4 border-(--color-foreground)"></div> {/* Loader */}
            </div>
        );
    }



    return (
        <div
            className="min-h-screen bg-(--color-background) bg-cover bg-center bg-no-repeat bg-image-dark"
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://i.ibb.co/Wv97xg0d/514-2880x1800-desktop-hd-assassins-creed-wallpaper.jpg)`, backgroundAttachment: 'fixed', }}
        >
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <h1 className="text-3xl font-bold text-white mb-8">CATALOG</h1>

                        {/* Price Range */}
                        <div className="mb-6 bg-(--color-background)/50 p-4 rounded-lg">
                            <h3 className="text-(--color-foreground) mb-4 ">Price</h3>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full accent-blue-500"
                            />
                            <div className="flex justify-between text-(--color-foreground)/80 mt-2">
                                <span>0$</span>
                                <span>{priceRange}$</span>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-1">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.label)}
                                    className={`w-full text-left px-4 py-2 rounded-r-full transition-colors ${selectedCategory === category.label
                                        ? 'bg-(--color-accent-primary) text-white'
                                        : 'text-gray-400 hover:bg-[#1A1F2E]'
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                        <div className=' bg-(--color-background)/50 rounded-xl mt-2'>
                            <h1 className='text-white font-bold pl-4 pt-4'> Popular 🔥</h1>
                            {popularGames && popularGames.slice(0, 8).map((game, ids) => (
                                <Link to={`/games/${game.id}`}>
                                    <GameCardWide key={game.id} id={ids + 1} game={game} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search Bar */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-(--color-background) text-(--color-foreground) pl-10 pr-4 py-2 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Featured Game */}
                        {!searchQuery && featured &&
                            <div className="mb-8 relative rounded-lg overflow-hidden">
                                <img
                                    src={featuredArtwork && featuredArtwork.length > 0
                                        && createImageUrl(featuredArtwork[0]?.image_id)}

                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-4xl font-bold text-white mb-4">{featured.name}</h2>
                                            <p className="text-2xl font-bold text-white">{featured.price}$</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <Link to={`/games/${featured.id}`}>
                                                <Button className="bg-[#2563EB] hover:bg-[#1E40AF] text-white px-8">
                                                    Buy now
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2">

                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                                        FEATURED
                                    </span>
                                </div>

                            </div>
                        }

                        {/* Games Grid */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="loader-dots text-white"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-6">
                                {games?.map(game => (
                                    <Link to={`/games/${game.id}`}>
                                        <div key={game.id} className="group cursor-pointer">
                                            <div className="relative">
                                                <img
                                                    src={game.image || game.cover_url}
                                                    alt={game.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 pb-4 flex flex-col gap-2">
                                                    <div className="flex items-center">
                                                        <span className="bg-[#1A1F2E] text-white px-4 py-1 rounded-r-full">
                                                            {game.price}$
                                                        </span>
                                                    </div>
                                                    <h3 className="text-white font-bold pl-2">{game.name}</h3>
                                                </div>
                                                {game.isNew && (
                                                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                                        NEW
                                                    </span>
                                                )}
                                                {game.onSale && (
                                                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                                        SALE
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        )}

                        {/* Pagination */}
                        <div className="flex justify-center mt-8 gap-2">
                            {[1, 2, 3, '...', 21].map((page, index) => (
                                <button
                                    key={index}
                                    className={`w-8 h-8 rounded-full ${page === 1
                                        ? 'bg-[#2563EB] text-white'
                                        : 'bg-[#1A1F2E] text-gray-400 hover:bg-[#2563EB]/50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
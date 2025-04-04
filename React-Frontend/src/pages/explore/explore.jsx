"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchData } from "@/src/hooks/api/api-gamevault"
import { getFeatured } from "@/src/api/store"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import { getGameArtworks } from "@/src/api/game"
import GameCardWide from "@/src/components/wide-game-card"

export default function ExplorePage() {
    const { id, type } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const initialMount = useRef(true)

    const pathParts = location.pathname.split("/")
    const filterType = pathParts[2]
    console.log("change");

    const [searchQuery, setSearchQuery] = useState("")
    // const [selectedCategory, setSelectedCategory] = useState({
    //     id: "all",
    //     type: "none",
    //     label: "All"
    // })
    const [priceRange, setPriceRange] = useState(200)
    const [games, setGames] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [featured, setFeatured] = useState(null)
    const [featuredArtwork, setFeaturedArtwork] = useState(null)
    const [initLoading, setInitLoading] = useState(true)
    const [popularGames, setPopularGames] = useState(null)
    const [expandedSection, setExpandedSection] = useState("genres") // "genres", "themes", or null
    const [fetchDataFlag, setFetchDataFlag] = useState(null);

    const genres = [
        { id: "all", label: "All" },
        { id: "2", label: "Point-and-click" },
        { id: "4", label: "Fighting" },
        { id: "5", label: "Shooter" },
        { id: "7", label: "Music" },
        { id: "8", label: "Platform" },
        { id: "9", label: "Puzzle" },
        { id: "10", label: "Racing" },
        { id: "11", label: "Real Time Strategy (RTS)" },
        { id: "12", label: "Role-playing (RPG)" },
        { id: "13", label: "Simulator" },
        { id: "14", label: "Sport" },
        { id: "15", label: "Strategy" },
        { id: "16", label: "Turn-based strategy (TBS)" },
        { id: "24", label: "Tactical" },
        { id: "26", label: "Quiz/Trivia" },
        { id: "30", label: "Pinball" },
        { id: "31", label: "Adventure" },
        { id: "32", label: "Indie" },
        { id: "33", label: "Arcade" },
        { id: "34", label: "Visual Novel" },
        { id: "35", label: "Card & Board Game" },
        { id: "36", label: "MOBA" },
    ];

    const themes = [
        { id: "1", label: "Action" },
        { id: "17", label: "Fantasy" },
        { id: "18", label: "Science fiction" },
        { id: "19", label: "Horror" },
        { id: "20", label: "Thriller" },
        { id: "21", label: "Survival" },
        { id: "22", label: "Historical" },
        { id: "23", label: "Stealth" },
        { id: "27", label: "Comedy" },
        { id: "28", label: "Business" },
        { id: "31", label: "Drama" },
        { id: "32", label: "Non-fiction" },
        { id: "33", label: "Sandbox" },
        { id: "34", label: "Educational" },
        { id: "35", label: "Kids" },
        { id: "38", label: "Open-World" },
        { id: "39", label: "Warfare" },
        { id: "40", label: "Party" },
        { id: "41", label: "4X" },
        { id: "43", label: "Mystery" },
    ]

    const [selectedCategory, setSelectedCategory] = useState(() => {
        // Default category, if no valid URL info
        const defaultCategory = { id: "all", type: "none", label: "All" };

        // Parse the URL path
        const pathParts = location.pathname.split("/");

        // If we have at least 4 parts and a valid filter type and id in the path
        if (pathParts.length >= 4 && pathParts[2] && pathParts[3]) {
            const filterType = pathParts[2];
            const filterId = pathParts[3];

            // If the filter type is "genres"
            if (filterType === "genres") {
                const genre = genres.find((g) => g.id === filterId);
                if (genre) {
                    return { id: genre.id, type: "genre", label: genre.label };
                }
            }
            // If the filter type is "themes"
            else if (filterType === "themes") {
                const theme = themes.find((t) => t.id === filterId);
                if (theme) {
                    return { id: theme.id, type: "theme", label: theme.label };
                }
            }
        }

        // Return default category if no match
        return defaultCategory;
    });


    useEffect(() => {
        const pathParts = location.pathname.split("/")

        console.log(pathParts);

        if (pathParts.length >= 4 && pathParts[2] && pathParts[3]) {
            const filterType = pathParts[2]
            const filterId = pathParts[3]

            if (filterType === "genres") {
                console.log("on genre url")
                const genre = genres.find((g) => g.id === filterId)
                if (genre) {
                    setSelectedCategory({
                        id: genre.id,
                        type: "genre",
                        label: genre.label
                    })
                    setExpandedSection("genres")
                }
            } else if (filterType === "themes") {
                console.log("on theme url")
                const theme = themes.find((t) => t.id === filterId)
                console.log("found theme", theme)
                if (theme) {
                    setSelectedCategory({
                        id: theme.id,
                        type: "theme",
                        label: theme.label
                    })
                    setExpandedSection("themes")
                }
            }
        }

        initialMount.current = false
    }, [location.pathname])

    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`
    }

    const fetchGames = async () => {
        console.log("fetching games with category:", selectedCategory)
        setIsLoading(true)

        const queryParams = []

        if (selectedCategory.type === "genre" && selectedCategory.id !== "all") {
            queryParams.push(`genre=${selectedCategory.id}`)
        } else if (selectedCategory.type === "theme" && selectedCategory.id !== "all") {
            queryParams.push(`theme=${selectedCategory.id}`)
        }

        const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : ""

        let fetch
        if (!searchQuery && queryString) {
            fetch = await fetchData(`store/games/get-all${queryString}`)
        } else {
            fetch = await fetchData(`store/games/get-all?limit=100`)
        }

        let filteredGames = fetch.games.filter((game) => game.price <= priceRange)

        if (searchQuery) {
            filteredGames = filteredGames.filter(game =>
                game.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        console.log(filteredGames);

        setGames(filteredGames)
        setIsLoading(false)
    }

    const fetchPromisedData = async () => {
        try {
            const fetch = await getFeatured()
            setFeatured(fetch.game)
            await fetchArtworks(fetch.game.artworks) // Ensure artwork fetch completes

            const fetch1 = await fetchData(`store/games/get-all?sortBy=hypes`)
            setPopularGames(fetch1.games)
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    const fetchArtworks = async (artworks) => {
        try {
            const fetch = await getGameArtworks(artworks)
            setFeaturedArtwork(fetch.queryResult)
        } catch (error) {
            console.error("Error fetching artworks:", error)
        }
    }

    const fetchMostPopular = async () => {
        setInitLoading(true)
        await fetchPromisedData()
        setInitLoading(false)
    }

    useEffect(() => {
        fetchMostPopular()
    }, [])

    useEffect(() => {
        fetchGames()
    }, [selectedCategory, searchQuery])

    useEffect(() => {
        if (initialMount.current) {
            return
        }

        if (selectedCategory.type === "genre" && selectedCategory.id !== "all") {
            navigate(`/explore/genres/${selectedCategory.id}/${encodeURIComponent(selectedCategory.label)}`)
        } else if (selectedCategory.type === "theme" && selectedCategory.id !== "all") {
            navigate(`/explore/themes/${selectedCategory.id}/${encodeURIComponent(selectedCategory.label)}`)
        } else {
            const pathParts = location.pathname.split("/")
            if (pathParts.length > 2) {
                navigate("/explore")
            }
        }
    }, [selectedCategory, navigate, location.pathname])

    if (initLoading) {
        return (
            <div className="min-h-screen bg-(--color-background) flex flex-col items-center justify-center text-(--color-foreground)">
                <div className="loader border-t-4 border-(--color-foreground)"></div> {/* Loader */}
            </div>
        )
    }

    const toggleGenres = () => {
        setExpandedSection(expandedSection === "genres" ? null : "genres")
    }

    const toggleThemes = () => {
        setExpandedSection(expandedSection === "themes" ? null : "themes")
    }

    const handleCategorySelect = (categoryId, categoryType, categoryLabel) => {
        if (categoryId === "all") {
            setSelectedCategory({
                id: "all",
                type: "none",
                label: "All"
            })
            navigate("/explore")
        } else {
            setSelectedCategory({
                id: categoryId,
                type: categoryType,
                label: categoryLabel
            })
        }
    }

    return (
        <div
            className="min-h-screen bg-(--color-background) bg-cover bg-center bg-no-repeat bg-image-dark"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://i.ibb.co/Wv97xg0d/514-2880x1800-desktop-hd-assassins-creed-wallpaper.jpg)`,
                backgroundAttachment: "fixed",
            }}
        >
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <h1 className="text-3xl font-bold text-white mb-8">CATALOG</h1>

                        {/* Active Filters Display */}
                        {(selectedCategory.id !== "all") && (
                            <div className="mb-4 bg-(--color-background)/50 p-3 rounded-lg">
                                <h3 className="text-(--color-foreground) text-sm mb-2">Active Filters:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCategory.type === "genre" && selectedCategory.id !== "all" && (
                                        <div className="bg-(--color-accent-primary) text-white text-xs px-2 py-1 rounded-md flex items-center">
                                            Genre: {selectedCategory.label}
                                            <button className="ml-1.5 hover:text-white/80" onClick={() =>
                                                handleCategorySelect("all", "none", "All")}>
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                    {selectedCategory.type === "theme" && selectedCategory.id !== "all" && (
                                        <div className="bg-(--color-accent-primary) text-white text-xs px-2 py-1 rounded-md flex items-center">
                                            Theme: {selectedCategory.label}
                                            <button className="ml-1.5 hover:text-white/80" onClick={() =>
                                                handleCategorySelect("all", "none", "All")}>
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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

                        {/* Genres Dropdown */}
                        <div className="mb-4 bg-(--color-background) rounded-lg overflow-hidden">
                            <button
                                onClick={toggleGenres}
                                className="w-full flex items-center justify-between p-4 text-(--color-foreground) font-medium"
                            >
                                <span>Genres</span>
                                {expandedSection === "genres" ? (
                                    <ChevronDown className="h-5 w-5" />
                                ) : (
                                    <ChevronRight className="h-5 w-5" />
                                )}
                            </button>

                            {expandedSection === "genres" && (
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-2 pb-3">
                                    {genres.map((genre) => (
                                        <button
                                            key={genre.id}
                                            onClick={() => handleCategorySelect(genre.id, "genre", genre.label)}
                                            className={`text-left px-3 py-1.5 rounded-md transition-colors text-sm ${selectedCategory.type === "genre" && selectedCategory.id === genre.id
                                                ? "bg-(--color-accent-primary) text-white"
                                                : "text-gray-400 hover:bg-[#1A1F2E]"
                                                }`}
                                        >
                                            {genre.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Themes Dropdown */}
                        <div className="mb-4 bg-(--color-background) rounded-lg overflow-hidden">
                            <button
                                onClick={toggleThemes}
                                className="w-full flex items-center justify-between p-4 text-(--color-foreground) font-medium"
                            >
                                <span>Themes</span>
                                {expandedSection === "themes" ? (
                                    <ChevronDown className="h-5 w-5" />
                                ) : (
                                    <ChevronRight className="h-5 w-5" />
                                )}
                            </button>

                            {expandedSection === "themes" && (
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-2 pb-3 max-h-[500px] overflow-y-auto">
                                    <button
                                        key="theme-all"
                                        onClick={() => handleCategorySelect("all", "none", "All")}
                                        className={`text-left px-3 py-1.5 rounded-md transition-colors text-sm ${selectedCategory.id === "all"
                                            ? "bg-(--color-accent-primary) text-white"
                                            : "text-gray-400 hover:bg-[#1A1F2E]"
                                            }`}
                                    >
                                        All
                                    </button>
                                    {themes.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => handleCategorySelect(theme.id, "theme", theme.label)}
                                            className={`text-left px-3 py-1.5 rounded-md transition-colors text-sm ${selectedCategory.type === "theme" && selectedCategory.id === theme.id
                                                ? "bg-(--color-accent-primary) text-white"
                                                : "text-gray-400 hover:bg-[#1A1F2E]"
                                                }`}
                                        >
                                            {theme.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-(--color-background)/50 rounded-xl mt-2 px-2">
                            <h1 className="text-white font-bold pl-4 pt-4"> Popular 🔥</h1>
                            {popularGames &&
                                popularGames.slice(0, 8).map((game, ids) => (
                                    <Link to={`/games/${game.id}`} key={game.id}>
                                        <GameCardWide id={ids + 1} game={game} />
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
                        {!searchQuery && featured && (
                            <div className="mb-8 relative rounded-lg overflow-hidden">
                                <img
                                    src={featuredArtwork && featuredArtwork.length > 0 && createImageUrl(featuredArtwork[0]?.image_id)}
                                    alt={featured.name}
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
                                                <Button className="bg-[#2563EB] hover:bg-[#1E40AF] text-white px-8">Buy now</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">FEATURED</span>
                                </div>
                            </div>
                        )}

                        {/* Games Grid */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="loader-dots text-white"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-6">
                                {games?.map((game) => (
                                    <Link to={`/games/${game.id}`} key={game.id}>
                                        <div className="group cursor-pointer">
                                            <div className="relative">
                                                <img
                                                    src={game.image || game.cover_url}
                                                    alt={game.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 pb-4 flex flex-col gap-2">
                                                    <div className="flex items-center">
                                                        <span className="bg-[#1A1F2E] text-white px-4 py-1 rounded-r-full">{game.price}$</span>
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
                            {[1, 2, 3, "...", 21].map((page, index) => (
                                <button
                                    key={index}
                                    className={`w-8 h-8 rounded-full ${page === 1
                                        ? "bg-[#2563EB] text-white"
                                        : "bg-[#1A1F2E] text-gray-400 hover:bg-[#2563EB]/50"
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
    )
}
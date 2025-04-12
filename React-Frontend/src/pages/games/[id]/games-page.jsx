"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchData } from "@/src/hooks/api/api-gamevault"
import YouTubeVideo from "@/src/components/VideoPlayer"
import { Star, ShoppingCart, Heart, Share2, Check, TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/src/contexts/cart-context"
import { SiStockx } from "react-icons/si"
import { useAuth } from "@/src/contexts/auth-context"
import { addToWishlist, removeFromWishlist, getWishlist, isGameInWishlist } from "@/src/hooks/useWishlist"
import { toast } from 'sonner';
export default function GamePage() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState("overview")
    const [activeScreenshot, setActiveScreenshot] = useState(0)
    const gameId = Number.parseInt(id)
    const [game, setGame] = useState(null)
    const navigate = useNavigate()
    const [artworks, setArtworks] = useState(null)
    const [screenshots, setScreenshots] = useState(null)
    const [genres, setGenres] = useState(null)
    const [videos, setVideos] = useState(null)
    const [gameFeatures, setFeatures] = useState(null)
    const [companies, setCompanies] = useState(null)
    const [themes, setThemes] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const [wishlistData, setWishlistData] = useState({ wishlist: { games: [] } })
    const [notification, setNotification] = useState(null)

    const showNotification = (message, type = "info") => {
        setNotification({ message, type })
        // Auto-hide notification after 3 seconds
        setTimeout(() => setNotification(null), 3000)
    }

    // Fetch wishlist data
    useEffect(() => {
        const fetchWishlistData = async () => {
            if (!user) return

            try {
                console.log("Fetching wishlist for user:", user._id)
                const data = await getWishlist(user._id)
                console.log("Wishlist data received:", data)
                setWishlistData(data)
            } catch (error) {
                console.error("Failed to fetch wishlist:", error)
            }
        }

        fetchWishlistData()
    }, [user])

    useEffect(() => {
        const checkWishlist = async () => {
            if (!user || !game) return

            try {
                console.log("Checking wishlist for game:", {
                    gameId: game._id,
                    gameNumId: game.id,
                    userId: user._id,
                })

                const response = await getWishlist(user._id)
                console.log("Wishlist data received:", response)

                if (response && response.status === "success" && response.wishlist && response.wishlist.games) {
                    const isInList = isGameInWishlist(response.wishlist.games, game)
                    console.log("Game in wishlist check result:", isInList)
                    setIsInWishlist(isInList)
                }
            } catch (error) {
                console.error("Failed to check wishlist:", error)
            }
        }

        checkWishlist()
    }, [user, game])

    const fetchGameData = async () => {
        try {
            setLoading(true) // Start loading

            const fetch = await fetchData(`store/games/get?id=${gameId}`)
            const gameData = fetch.gameData
            setGame(gameData)

            const promises = [
                fetchGameArtworks(gameData.artworks),
                fetchGameScreenshots(gameData.screenshots),
                fetchGameGenres(gameData.genres),
                fetchGameVideos(gameData.videos),
                fetchGameCompanies(gameData.involved_companies),
                fetchGameThemes(gameData.themes),
            ]

            setFeatures(extractFeaturesFromGame(gameData))

            await Promise.all(promises)

            setLoading(false)
        } catch (err) {
            console.error("Game fetch error:", err)
            setLoading(false)
        }
    }

    const fetchGameArtworks = async (artworks) => {
        const fetch = await fetchData(`games/get/artworks?ids=${artworks}`)
        setArtworks(fetch.queryResult)
        console.log(fetch.queryResult)
    }

    const fetchGameScreenshots = async (screenshots) => {
        const fetch = await fetchData(`games/get/screenshots?ids=${screenshots}`)
        setScreenshots(fetch.queryResult)
    }
    const fetchGameGenres = async (genres) => {
        const fetch = await fetchData(`games/get/genres?ids=${genres}`)
        setGenres(fetch.queryResult)
    }

    const fetchGameVideos = async (videos) => {
        const fetch = await fetchData(`games/get/videos?ids=${videos}`)
        setVideos(fetch.queryResult)
    }

    const fetchGameCompanies = async (cmps) => {
        const fetch = await fetchData(`games/get/devpubs?ids=${cmps}`)
        console.log("compsss", fetch)
        setCompanies(fetch.queryResult)
    }

    const fetchGameThemes = async (thms) => {
        const fetch = await fetchData(`games/get/themes?ids=${thms}`)
        setThemes(fetch.queryResult)
    }

    const handleWishlistAction = async () => {
        if (!user) {
            // Redirect to login if user is not logged in
            navigate("/login")
            return
        }

        setWishlistLoading(true)
        try {
            if (isInWishlist) {
                // Remove from wishlist
                console.log("Removing game from wishlist:", game._id)
                await removeFromWishlist(user._id, game._id)

                // Update local state
                setIsInWishlist(false)
                showNotification(`${game.name} has been removed from your wishlist.`, "success")
            } else {
                // Add to wishlist
                console.log("Adding game to wishlist:", game._id)
                const response = await addToWishlist(user._id, game._id)
                console.log("Add to wishlist response:", response)

                // Update local state
                setIsInWishlist(true)
                toast.success("Added to wishlist!")
                // Navigate to wishlist page after adding
                navigate("/wishlist")
            }
        } catch (error) {
            console.error("Wishlist operation failed:", error)
            toast.error("Failed to update wishlist.")
        } finally {
            setWishlistLoading(false)
        }
    }

    useEffect(() => {
        if (game == null || !game) fetchGameData()
    }, [])

    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`
    }

    const extractFeaturesFromGame = (game) => {
        const features = []

        if (game.game_modes?.includes(1)) features.push("Single-player")
        if (game.game_modes?.includes(2) || game.multiplayer_modes?.length > 0) features.push("Multiplayer")

        if (game.storyline) features.push("Story-rich")
        if (game.themes?.length > 0) features.push("Thematic")
        if (game.rating && game.rating > 85) features.push("High Rating")

        if (game.category === 0 || game.genres?.includes(31)) features.push("Open World")

        if (game.hasSteamAchievements) features.push("Steam Achievements")
        if (game.hasSteamWorkshop) features.push("Steam Workshop")
        if (game.controllerSupport) features.push("Controller Support")

        return features
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-(--color-background) flex flex-col items-center justify-center text-(--color-foreground)">
                <div className="loader border-t-4 border-(--color-foreground)"></div> {/* Loader */}
            </div>
        )
    }

    if (!game) {
        return (
            <div className="min-h-screen bg-(--color-background) flex flex-col items-center justify-center text-(--color-foreground)">
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
        <div className="min-h-screen bg-(--color-background)">
            {notification && (
                <div
                    className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${notification.type === "error" ? "bg-red-500" : "bg-green-500"
                        } text-white`}
                >
                    {notification.message}
                </div>
            )}
            {artworks && (
                <div
                    className="bg-image-dark bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${createImageUrl(artworks[0]?.image_id)})`,
                    }}
                >
                    <div className="container mx-auto px-4 py-8 md:py-16 lg:py-24">
                        <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16 items-center">
                            <div className="relative mb-6 md:mb-0">
                                <img
                                    src={game.cover_url || "/placeholder.svg"}
                                    alt={game.name.toUpperCase()}
                                    className="h-[200px] sm:h-[250px] md:h-[300px] object-cover shadow-lg rounded-md"
                                />
                                {game.isDiscount && (
                                    <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full transform rotate-12 font-bold shadow-lg text-sm">
                                        SALE!
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">{game.name.toUpperCase()}</h1>
                                <p className="text-white/80 line-clamp-3 text-sm pt-2 max-w-2xl">{game.storyline}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                                    {themes && themes.length > 0 ? (
                                        themes.slice(0, 3).map((theme, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="border-(--color-light-ed)/20 bg-[#EDEDED]/5 text-white/80"
                                            >
                                                {theme.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="mt-5 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center md:justify-start">
                                    <div className="bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center">
                                        <span className="text-black font-bold">{game.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        {game.isDiscount ? (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-white font-bold text-3xl sm:text-4xl">
                                                        ${(game.price * (1 - game.discountPercentage / 100)).toFixed(2)}
                                                    </span>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-400 line-through text-lg">${game.price.toFixed(2)}</span>
                                                        <span className="text-green-400 font-bold">-{game.discountPercentage}%</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <TagIcon className="w-4 h-4 text-green-400" />
                                                    <span className="text-green-400 text-sm">Special Offer!</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-white font-bold text-3xl sm:text-4xl">${game.price.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-5">
                                    {game.copies > 0 ? (
                                        <button
                                            className="text-white border border-white px-6 sm:px-10 rounded-full text-sm py-1 transform transition duration-300 hover:scale-105"
                                            onClick={() => addToCart(game)}
                                        >
                                            BUY
                                        </button>
                                    ) : (
                                        <div className="font-bold text-red-400"> Out of Stock</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column - Game Images */}
                    <div className="lg:col-span-2">
                        <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                            <img
                                src={
                                    activeScreenshot === 0 && artworks && artworks.length > 0
                                        ? createImageUrl(artworks[1]?.image_id || artworks[0]?.image_id)
                                        : screenshots && screenshots.length > 0
                                            ? createImageUrl(screenshots[activeScreenshot - 1]?.image_id)
                                            : "/placeholder.svg" // Fallback image if screenshots are null or empty
                                }
                                alt={game.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            <button
                                onClick={() => setActiveScreenshot(0)}
                                className={`overflow-hidden rounded-md border-2 ${activeScreenshot === 0 ? "border-(--color-foreground)" : "border-transparent"}`}
                            >
                                <img
                                    src={
                                        (artworks && createImageUrl(artworks[1]?.image_id || artworks[0]?.image_id)) || "/placeholder.svg"
                                    }
                                    alt="Main"
                                    className="w-full h-auto object-cover aspect-video"
                                />
                            </button>

                            {screenshots &&
                                screenshots.length > 0 &&
                                screenshots?.slice(0, 4)?.map((screenshot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveScreenshot(index + 1)}
                                        className={`overflow-hidden rounded-md border-2 ${activeScreenshot === index + 1 ? "border-(--color-foreground)" : "border-transparent"}`}
                                    >
                                        <img
                                            src={createImageUrl(screenshot.image_id) || "/placeholder.svg"}
                                            alt={`Screenshot ${index + 1}`}
                                            className="w-full h-auto object-cover aspect-video"
                                        />
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Right Column - Game Info */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-(--color-foreground) mb-2">{game.name}</h1>

                        <div className="flex flex-wrap items-center gap-2 mb-4 text-(--color-foreground)">
                            <Badge variant="outline" className="border-(--color-light-ed)/20 bg-[#EDEDED]/5">
                                <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                                {game.rating ? game.rating.toFixed(1) : "-"}
                            </Badge>
                            <div className="flex flex-wrap gap-2">
                                {genres && genres.length > 0 ? (
                                    genres.slice(0, 3).map((genre, index) => (
                                        <Badge key={index} variant="outline" className="border-(--color-light-ed)/20 bg-[#EDEDED]/5">
                                            {genre.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge variant="outline" className="border-(--color-light-ed)/20 bg-[#EDEDED]/5">
                                        No Genre
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <p className="text-(--color-light-ed)/80 mb-6">{game.summary}</p>

                        <div className="mb-6">
                            <div className="mb-6">
                                {game.isDiscount ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl sm:text-2xl font-bold text-green-400">
                                                ${(game.price * (1 - game.discountPercentage / 100)).toFixed(2)}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="text-md sm:text-lg line-through text-[#EDEDED]/60">
                                                    ${game.price.toFixed(2)}
                                                </span>
                                                <Badge className="bg-green-500">{game.discountPercentage}% OFF</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-400 text-sm">
                                            <TagIcon className="w-4 h-4" />
                                            <span>Limited Time Offer!</span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-xl sm:text-2xl font-bold text-(--color-light-ed)">
                                        ${game.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mb-6">
                            {game.copies > 0 ? (
                                <Button
                                    className="w-full bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-[#EDEDED]/90"
                                    onClick={() => addToCart(game)}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Add to Cart
                                </Button>
                            ) : (
                                <Button className="w-full bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-[#EDEDED]/90">
                                    <SiStockx className="mr-2 h-4 w-4" />
                                    Out Of Stock
                                </Button>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className={`w-full border-(--color-light-ed)/10 text-(--color-light-ed) hover:bg-[#EDEDED]/10 ${isInWishlist ? "bg-[#EDEDED]/10" : ""
                                        }`}
                                    onClick={handleWishlistAction}
                                    disabled={wishlistLoading}
                                >
                                    <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
                                    {wishlistLoading ? "..." : isInWishlist ? "Wishlisted" : "Wishlist"}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full border-(--color-light-ed)/10 text-(--color-light-ed) hover:bg-(--color-light-ed)/10"
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm text-(--color-foreground)">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="font-bold">Developer:</span>
                                <span className="text-(--color-light-ed) mt-1 sm:mt-0">
                                    {companies
                                        ?.filter((c) => c.role === "Developer")
                                        .map((c) => c.companyName)
                                        .join(", ") || "Unknown"}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="font-bold">Publisher:</span>
                                <span className="text-(--color-light-ed) mt-1 sm:mt-0">
                                    {companies
                                        ?.filter((c) => c.role === "Publisher")
                                        .map((c) => c.companyName)
                                        .join(", ") || "Unknown"}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="font-bold">Release Date:</span>
                                <span className="text-(--color-light-ed) mt-1 sm:mt-0">{game.release_dates}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="font-bold">Platforms:</span>
                                <span className="text-(--color-light-ed) mt-1 sm:mt-0">{game.platforms.join(", ")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12">
                    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                        <div className="overflow-x-auto">
                            <TabsList className="bg-(--color-light-ed)/5 border-b border-(--color-light-ed)/10 text-(--color-light-ed) w-full">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-(--color-light-ed)/10">
                                    Overview
                                </TabsTrigger>

                                <TabsTrigger value="features" className="data-[state=active]:bg-(--color-light-ed)/10">
                                    Features
                                </TabsTrigger>
                                <TabsTrigger value="system" className="data-[state=active]:bg-(--color-light-ed)/10">
                                    System Requirements
                                </TabsTrigger>

                                <TabsTrigger value="trailer" className="data-[state=active]:bg-(--color-light-ed)/10">
                                    Trailer
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="overview" className="pt-6">
                            <p className="text-(--color-light-ed)/80 whitespace-pre-line">{game.storyline || game.summary}</p>
                        </TabsContent>

                        <TabsContent value="trailer" className="pt-6">
                            <div className="w-full max-w-4xl mx-auto">
                                {videos && <YouTubeVideo videoId={videos[0].video_id} title={`${game.name} - Official Trailer`} />}
                            </div>
                        </TabsContent>

                        <TabsContent value="features" className="pt-6">
                            <div className="grid gap-3 sm:grid-cols-2">
                                {gameFeatures && gameFeatures.length > 0 ? (
                                    gameFeatures.map((feature) => (
                                        <div key={feature} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-(--color-light-ed)/80">{feature}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted">No specific features listed for this game.</p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="system" className="pt-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg text-(--color-light-ed)">Minimum Requirements</h3>
                                    <p className="text-(--color-light-ed)/80">{game.systemRequirements?.minimum.os}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg text-(--color-light-ed)">Recommended Requirements</h3>
                                    <p className="text-(--color-light-ed)/80">{game.systemRequirements?.recommended.os}</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}

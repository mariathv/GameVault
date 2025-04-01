import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData } from '@/src/hooks/api/api-gamevault';
import YouTubeVideo from "@/src/components/VideoPlayer";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/src/components/Header";
import { games } from "@/dummydata-lib/data";
import { useCart } from "@/src/contexts/cart-context";
import { SiStockx } from "react-icons/si";


export default function GamePage() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [activeTab, setActiveTab] = useState("overview");
    const [activeScreenshot, setActiveScreenshot] = useState(0);
    const gameId = Number.parseInt(id);
    const [game, setGame] = useState(null);
    const navigate = useNavigate();
    const [artworks, setArtworks] = useState(null);
    const [screenshots, setScreenshots] = useState(null);
    const [genres, setGenres] = useState(null);
    const [videos, setVideos] = useState(null);
    const [gameFeatures, setFeatures] = useState(null);
    const [companies, setCompanies] = useState(null);
    const [themes, setThemes] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchGameData = async () => {
        try {
            setLoading(true); // Start loading

            const fetch = await fetchData(`store/games/get?id=${gameId}`);
            const gameData = fetch.gameData;
            setGame(gameData);

            const promises = [
                fetchGameArtworks(gameData.artworks),
                fetchGameScreenshots(gameData.screenshots),
                fetchGameGenres(gameData.genres),
                fetchGameVideos(gameData.videos),
                fetchGameCompanies(gameData.involved_companies),
                fetchGameThemes(gameData.themes)
            ];

            setFeatures(extractFeaturesFromGame(gameData));

            await Promise.all(promises);

            setLoading(false);
        } catch (err) {
            console.error("Game fetch error:", err);
            setLoading(false);
        }
    };


    const fetchGameArtworks = async (artworks) => {
        let fetch = await fetchData(`games/get/artworks?ids=${artworks}`);
        setArtworks(fetch.queryResult);
        console.log(fetch.queryResult);
    };

    const fetchGameScreenshots = async (screenshots) => {
        let fetch = await fetchData(`games/get/screenshots?ids=${screenshots}`);
        setScreenshots(fetch.queryResult);
    };
    const fetchGameGenres = async (genres) => {
        let fetch = await fetchData(`games/get/genres?ids=${genres}`);
        setGenres(fetch.queryResult);
    };

    const fetchGameVideos = async (videos) => {
        let fetch = await fetchData(`games/get/videos?ids=${videos}`);
        setVideos(fetch.queryResult);
    };

    const fetchGameCompanies = async (cmps) => {
        let fetch = await fetchData(`games/get/devpubs?ids=${cmps}`);
        console.log("compsss", fetch)
        setCompanies(fetch.queryResult);
    }

    const fetchGameThemes = async (thms) => {
        let fetch = await fetchData(`games/get/themes?ids=${thms}`);
        setThemes(fetch.queryResult);
    }

    useEffect(() => {
        if (game == null || !game) fetchGameData();
    }, []);

    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;
    }

    const extractFeaturesFromGame = (game) => {
        const features = [];

        if (game.game_modes?.includes(1)) features.push("Single-player");
        if (game.game_modes?.includes(2) || game.multiplayer_modes?.length > 0) features.push("Multiplayer");

        if (game.storyline) features.push("Story-rich");
        if (game.themes?.length > 0) features.push("Thematic");
        if (game.rating && game.rating > 85) features.push("High Rating");

        if (game.category === 0 || game.genres?.includes(31)) features.push("Open World");

        if (game.hasSteamAchievements) features.push("Steam Achievements");
        if (game.hasSteamWorkshop) features.push("Steam Workshop");
        if (game.controllerSupport) features.push("Controller Support");

        return features;
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-(--color-background) flex flex-col items-center justify-center text-(--color-foreground)">
                <div className="loader border-t-4 border-(--color-foreground)"></div> {/* Loader */}
            </div>
        );
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
        );
    }

    const discountedPrice = game.onSale ? game.price * (1 - game.discount / 100) : game.price;

    return (
        <div className="min-h-screen bg-(--color-background)">
            <Header />
            {artworks &&
                <div className="h-150 bg-image-dark" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${createImageUrl(artworks[0]?.image_id)})` }}>
                    <div className="flex gap-20 justify-center items-center py-30">
                        <img src={game.cover_url} alt={game.name.toUpperCase()} className="h-[320px] object-cover" />
                        <div className="flex-row flex-1 max-w-lg">
                            <h1 className="text-white font-bold text-3xl">{game.name.toUpperCase()}</h1>
                            <p className="text-white/80 line-clamp-3 text-sm pt-2">
                                {game.storyline}
                            </p>
                            {themes && themes.length > 0 ? (
                                themes.slice(0, 3).map((theme, index) => (
                                    <Badge key={index} variant="outline" className="border-(--color-light-ed)/20 bg-[#EDEDED]/5 mr-2 text-white/80 mt-2">
                                        {theme.name}
                                    </Badge>
                                ))
                            ) : (<></>
                            )}
                            <div className="mt-5 flex gap-10">
                                <div className="bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center mr-2">
                                    <span className="text-black font-bold">{game.rating.toFixed(1)}</span>
                                </div>
                                <div className="text-white font-bold text-5xl">
                                    {game.price} $
                                </div>
                            </div>
                            <div>
                                {
                                    game.copies > 0 ? (
                                        <button className="text-white border border-white px-10 rounded-full text-sm mt-5 py-1 transform transition duration-300 hover:scale-105" onClick={() => addToCart(game)}>
                                            BUY
                                        </button>
                                    ) : (<div className=" mt-5 font-bold text-red-400"> Out of Stock</div>)
                                }

                            </div>
                        </div>


                    </div>

                </div>
            }

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

                        <div className="grid grid-cols-5 gap-2">
                            <button
                                onClick={() => setActiveScreenshot(0)}
                                className={`overflow-hidden rounded-md border-2 ${activeScreenshot === 0 ? "border-(--color-foreground)" : "border-transparent"}`}
                            >
                                <img
                                    src={artworks && createImageUrl(artworks[1]?.image_id || artworks[0]?.image_id) || "/placeholder.svg"}
                                    alt="Main"
                                    className="w-full h-auto object-cover aspect-video"
                                />
                            </button>

                            {screenshots && screenshots.length > 0 && screenshots?.slice(0, 4)?.map((screenshot, index) => (
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
                        <h1 className="text-3xl font-bold text-(--color-foreground) mb-2">{game.name}</h1>

                        <div className="flex items-center gap-2 mb-4 text-(--color-foreground)">
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
                            {game.onSale ? (
                                <div className="mb-2">
                                    <span className="text-2xl font-bold text-green-400">${discountedPrice.toFixed(2)}</span>
                                    <span className="ml-2 text-lg line-through text-[#EDEDED]/60">${game.price.toFixed(2)}</span>
                                    <Badge className="ml-2 bg-green-500">{game.discount}% OFF</Badge>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold text-(--color-light-ed) mb-2">${game.price.toFixed(2)}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 mb-6">
                            {game.copies > 0 ? (<Button
                                className="w-full bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-[#EDEDED]/90"
                                onClick={() => addToCart(game)}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                            </Button>) : (<Button
                                className="w-full bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-[#EDEDED]/90"
                            >
                                <SiStockx className="mr-2 h-4 w-4" />
                                Out Of Stock
                            </Button>)}

                            <Button
                                variant="outline"
                                className="w-full border-(--color-light-ed)/10 text-(--color-light-ed) hover:bg-[#EDEDED]/10"
                                onClick={() => {
                                    // Here you would add the game to wishlist in localStorage or context
                                    // For example:
                                    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
                                    if (!wishlist.includes(game.id)) {
                                        wishlist.push(game.id);
                                        localStorage.setItem('wishlist', JSON.stringify(wishlist));
                                    }

                                    // Then navigate to wishlist page
                                    navigate('/wishlist');
                                }}
                            >
                                <Heart className="mr-2 h-4 w-4" />
                                Add to Wishlist
                            </Button>

                            <Button variant="outline" className="w-full border-(--color-light-ed)/10 text-(--color-light-ed) hover:bg-(--color-light-ed)/10">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                        </div>
                        <div className="space-y-4 text-sm text-[#EDEDED]/80">
                            <div className="flex justify-between">
                                <span>Developer:</span>
                                <span className="text-[#EDEDED]">
                                    {
                                        companies?.filter(c => c.role === "Developer").map(c => c.companyName).join(", ") || "Unknown"
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Publisher:</span>
                                <span className="text-[#EDEDED]">
                                    {
                                        companies?.filter(c => c.role === "Publisher").map(c => c.companyName).join(", ") || "Unknown"
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Release Date:</span>
                                <span className="text-[#EDEDED]">{game.release_dates}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platforms:</span>
                                <span className="text-[#EDEDED]">{game.platforms.join(", ")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12">
                    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="bg-(--color-light-ed)/5 border-b border-(--color-light-ed)/10 text-(--color-light-ed)">
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

                        <TabsContent value="overview" className="pt-6">
                            <p className="text-(--color-light-ed)/80 whitespace-pre-line">{game.storyline || game.summary}</p>
                        </TabsContent>

                        <TabsContent value="trailer" className="pt-6">
                            <div className="max-w-4xl mt-10">
                                {videos && <YouTubeVideo videoId={videos[0].video_id} title={`${game.name} - Official Trailer`} />}
                            </div>
                        </TabsContent>

                        <TabsContent value="features" className="pt-6">
                            <TabsContent value="features" className="pt-6">
                                <div className="grid gap-3 md:grid-cols-2">
                                    {gameFeatures.length > 0 ? (
                                        gameFeatures.map((feature) => (
                                            <div key={feature} className="flex items-start gap-2">
                                                <Check className="h-5 w-5 text-green-400 mt-0.5" />
                                                <span className="text-(--color-light-ed)/80">{feature}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted">No specific features listed for this game.</p>
                                    )}
                                </div>
                            </TabsContent>

                        </TabsContent>

                        <TabsContent value="system" className="pt-6">
                            <p className="text-(--color-light-ed)/80">Minimum: {game.systemRequirements?.minimum.os}</p>
                            <p className="text-(--color-light-ed)/80">Recommended: {game.systemRequirements?.recommended.os}</p>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

/*
    show platforms -> using icons
    display release date 
    display themes -> like genres (maybe in the overview tab)



*/

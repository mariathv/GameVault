import { useState, useEffect } from "react";
import { getGameThemes } from "../api/game";
import { Link } from "react-router-dom";
import { themes as allThemes } from "@/lib/game-themes";
import { toSlug } from "../utils/slugconverter";
import { useCurrency } from "../contexts/currency-context";

function GameCardExtended({
    featuredGame, featuredArtwork
}) {
    const [themes, setThemes] = useState(null);
    const { currency, convertPrice } = useCurrency()

    const fetchThemes = () => {
        console.log("fetching themes", themes);

        if (featuredGame.themes) {
            const filteredThemes = featuredGame.themes
                .filter(id => allThemes[id])
                .map(id => ({ name: allThemes[id] }));

            setThemes(filteredThemes);
            console.log(filteredThemes);
        }
    };

    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;
    }

    useEffect(() => {
        fetchThemes();
    }, [featuredGame])

    const renderStars = () => {
        const stars = []
        const fullStars = Math.floor(featuredGame.rating)
        const hasHalfStar = featuredGame.rating % 1 >= 0.5

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="text-cyan-400 text-base sm:text-lg">
                        ★
                    </span>,
                )
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-cyan-400 text-base sm:text-lg">
                        ★
                    </span>,
                )
            } else {
                stars.push(
                    <span key={i} className="text-gray-500 text-base sm:text-lg">
                        ☆
                    </span>,
                )
            }
        }

        return stars
    }

    return (
        <div
            className="flex items-center justify-center flex-col md:flex-row bg-gray-900 rounded-xl overflow-hidden w-full shadow-lg mb-8 md:mb-20 bg-image-card"
            style={{
                backgroundImage: `url(${featuredArtwork && featuredArtwork.length > 0
                    && createImageUrl(featuredArtwork[0]?.image_id)})`
            }}
        >
            {/* Left side with image and price */}
            <div className="relative w-full md:w-1/3 h-48 sm:h-64 md:h-auto">
                <img
                    src={featuredGame.cover_url || "/placeholder.svg"}
                    alt="featured"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-25 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-2 left-2 bg-yellow-400 px-2 py-1 rounded">
                    <span className="font-bold text-black text-xs sm:text-sm">{convertPrice(featuredGame.price)}</span>
                </div>
                <div className="absolute bottom-12 left-2">
                    <span className="text-yellow-400 text-base sm:text-lg md:text-xl font-bold italic">{featuredGame.name}</span>
                </div>
            </div>

            {/* Right side with details */}
            <div className="w-full md:w-2/3 p-4">
                <div className="w-full md:w-2/3 px-0 sm:px-4 md:px-8">
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                        <span className="text-white/80 mr-2 font-bold text-xs sm:text-sm">RATING</span>
                        <div className="bg-cyan-500 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center mr-2">
                            <span className="text-white font-bold text-xs sm:text-sm">{featuredGame.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex">{renderStars()}</div>
                    </div>
                </div>

                <div className="px-0 sm:px-4 md:px-8">
                    {/* Title */}
                    <h2 className="text-white text-lg sm:text-xl font-bold mb-1">{featuredGame.name}</h2>

                    {/* Description */}
                    <p className="text-white/80 text-xs sm:text-sm mb-4 line-clamp-2 sm:line-clamp-3">{featuredGame.summary}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap mb-4">
                        {themes && themes.length > 0 && themes.map((theme, themetag) => (
                            <div key={themetag} className="bg-gray-800/80 rounded-full px-2 sm:px-3 py-1 mr-2 mb-2">
                                <div className="text-white text-xs">{theme.name}</div>
                            </div>
                        ))}
                    </div>

                    {/* More Info Button */}
                    <Link to={`/games/${featuredGame.id}/${featuredGame.slug || toSlug(featuredGame.name)}`}>
                        <button className="bg-(--color-accent-primary) hover:bg-cyan-600 transition-colors rounded-full px-3 sm:px-4 py-1 sm:py-2 text-white text-xs sm:text-sm font-medium">
                            More Info
                        </button>
                    </Link>
                </div>
            </div>
        </div>

    )
}

export default GameCardExtended

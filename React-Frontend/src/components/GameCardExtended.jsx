import { useState, useEffect } from "react";
import { getGameThemes } from "../api/game";
import { Link } from "react-router-dom";

function GameCardExtended({
    featuredGame, featuredArtwork
}) {

    const [themes, setThemes] = useState(null);


    const fetchThemes = async () => {
        const fetch = await getGameThemes(featuredGame.themes);
        setThemes(fetch.queryResult);
        console.log(fetch.queryResult);

    }
    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;
    }

    useEffect(() => {
        fetchThemes();
    }, [])

    // Generate star rating
    const renderStars = () => {
        const stars = []
        const fullStars = Math.floor(featuredGame.rating)
        const hasHalfStar = featuredGame.rating % 1 >= 0.5

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="text-cyan-400 text-lg">
                        ★
                    </span>,
                )
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-cyan-400 text-lg">
                        ★
                    </span>,
                )
            } else {
                stars.push(
                    <span key={i} className="text-gray-500 text-lg">
                        ☆
                    </span>,
                )
            }
        }

        return stars
    }

    return (
        <div className="flex bg-gray-900 rounded-xl overflow-hidden w-full shadow-lg mb-20 bg-image-card" style={{
            backgroundImage: ` url(${featuredArtwork && featuredArtwork.length > 0
                && createImageUrl(featuredArtwork[0]?.image_id)})`
        }}>

            {/* Left side with image and price */}
            <div className="relative w-1/3">
                <img
                    src={featuredGame.cover_url}
                    alt="featured"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-yellow-400 px-2 py-1 rounded">
                    <span className="font-bold text-black">{featuredGame.price}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-25    bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-12 left-2">
                    <span className="text-yellow-400 text-xl font-bold italic">{featuredGame.name}</span>
                </div>
            </div>

            {/* Right side with details */}
            <div className="w-2/3">
                <div className="w-2/3 p-4">
                    <div className="w-2/3 p-4 ">
                        {/* Rating */}
                        <div className="flex items-center mb-4 ">
                            <span className="text-white/80 mr-2 font-bold">RATING</span>
                            <div className="bg-cyan-500 rounded-full w-10 h-10 flex items-center justify-center mr-2">
                                <span className="text-white font-bold">{featuredGame.rating.toFixed(1)}</span>
                            </div>
                            <div className="flex">{renderStars()}</div>
                        </div>

                    </div>
                </div>
                <div>
                    <div

                        className="px-8 "
                    >

                        {/* Title */}
                        <h2 className="text-white text-xl font-bold mb-1">{featuredGame.name}</h2>

                        {/* Description */}
                        <p className="text-white/80 text-sm mb-4 line-clamp-3">{featuredGame.summary}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap mb-4">
                            {themes && themes.length > 0 && themes.map((theme, themetag) => (
                                <div key={themetag} className="bg-gray-800/80 rounded-full px-3 py-1 mr-2 mb-2">
                                    <span className="text-white text-xs">{theme.name}</span>
                                </div>
                            ))}



                        </div>

                        {/* More Info Button */}

                        <Link to={`/games/${featuredGame.id}`}>
                            <button className="bg-(--color-accent-primary) hover:bg-cyan-600 transition-colors rounded-full px-4 py-2 text-white font-medium">
                                More Info
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameCardExtended


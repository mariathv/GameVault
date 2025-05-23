import React, { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { getGameThemes } from '../api/game'
import { Link } from 'react-router-dom';
import { themes as allThemes } from "@/lib/game-themes"
import { toSlug } from '../utils/slugconverter';
import { useCurrency } from '../contexts/currency-context';

export default function GameCard({ game }) {
    const [themes, setThemes] = useState(null);
    const { currency, convertPrice } = useCurrency()

    const fetchThemes = () => {
        if (!themes) {
            const filteredThemes = game.themes
                .filter(id => allThemes[id]) // Ensure valid IDs
                .map(id => ({ name: allThemes[id] })); // Map to array of objects

            setThemes(filteredThemes);
        }
    };




    useEffect(() => {
        fetchThemes();
    }, [themes])


    return (
        <Link to={`/games/${game.id}/${toSlug(game.name)}`}>
            <div key={game.id} className="min-w-[240px] bg-(--color-light-ed)/5 rounded-lg overflow-hidden">
                <div className="relative">
                    <img src={game.cover_url} alt={game.name} className="w-full h-[320px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                    <div className="absolute top-2 left-2 flex gap-2">
                        {themes && themes.length > 1 && themes.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} className={`bg-(--color-background)/50 text-white`}>
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                    <div className=" absolute bottom-3 left-3 rounded text-white font-bold">
                        {convertPrice(game.price)}
                    </div>
                    <div className=" absolute bottom-3 bg-blue-500/50 px-2 right-3 rounded text-white font-bold">
                        {game.rating.toFixed(1)}
                    </div>

                </div>
            </div>
        </Link>
    )
}

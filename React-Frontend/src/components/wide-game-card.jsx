"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { themes as allThemes } from "@/lib/game-themes"

export default function GameCardWide({ id, game }) {
    const [isLoading, setIsLoading] = useState(false)
    const [themes, setThemes] = useState(null)

    const fetchThemes = () => {
        if (game.themes) {
            const filteredThemes = game.themes.filter((id) => allThemes[id]).map((id) => ({ name: allThemes[id] }))

            setThemes(filteredThemes)
        }
    }

    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`
    }

    useEffect(() => {
        fetchThemes()
    }, [])

    return (
        <div className="relative h-16 sm:h-20 md:h-24 w-full overflow-hidden rounded-lg bg-black/20 mt-2 cursor-pointer transition-transform duration-300 ease-out hover:scale-105 hover:shadow-lg">

            <div className="absolute right-0 top-0 h-full w-1/3">
                <img
                    src={game.cover_url || "/placeholder.svg"}
                    alt={game.name}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"
                        }
          [mask-image:linear-gradient(to_right,transparent_0%,black_20%)]
          brightness-60`}
                    onLoad={() => setIsLoading(false)}
                />
            </div>
            <div className="flex items-center gap-1 h-full">
                <div className="relative ml-2 sm:ml-4 z-20 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/80 text-xs sm:text-sm font-medium text-white">
                    {id}
                </div>


                <div className="flex relative z-10 flex-col p-2 sm:p-4">
                    <h3 className="mb-1 sm:mb-2 line-clamp-1 text-[10px] sm:text-[12px] font-bold text-white">{game.name}</h3>
                    <div className="flex">
                        <Badge
                            variant="outline"
                            className="border-(--color-light-ed)/20 bg-[#EDEDED]/5 text-white/80 mt-1 sm:mt-2 text-[8px] sm:text-xs"
                        >
                            {themes && themes[0]?.name}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

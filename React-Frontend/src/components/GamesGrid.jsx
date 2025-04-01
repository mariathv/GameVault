import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { truncateTextWords } from '../utils/truncateText'
import { useCart } from "@/src/contexts/cart-context"


const GamesGrid = ({ filteredGames, gridCol = 4, variant = "default", start = 0, end, limit }) => {
    const navigate = useNavigate()
    const { addToCart } = useCart()

    const getGridClass = () => {
        if (variant === "wide") {
            return "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        }
        switch (gridCol) {
            case 3: return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
            case 4: return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
            case 5: return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5'
            case 6: return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6'
            default: return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
        }
    }

    const getCardImageClass = () => {
        return variant === "wide" ? "aspect-video w-full overflow-hidden" : "aspect-[4/4] w-full overflow-hidden"
    }
    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;
    }


    return (
        <div className={getGridClass()}>
            {filteredGames.slice(0, limit).map((game, index) => (
                <Card
                    key={game.id || `game-${index}`}
                    className="flex flex-col pt-0 overflow-hidden border-(--color-light-ed)/10 bg-(--color-light-ed)/5 text-(--color-foreground)"
                >
                    {variant != "wide" ? (
                        <Link to={`/games/${game.id}`}>
                            <div className={getCardImageClass()}>
                                <img
                                    src={game.cover_url || game.image || "/placeholder.svg"}
                                    alt={game.name || game.title}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        </Link>) : (<Link to={`/games/${game.id}`}>
                            <div className={getCardImageClass()}>
                                <img
                                    src={(game.artworks_extracted && game.artworks_extracted.length > 0 && createImageUrl(game.artworks_extracted[0]?.image_id)) || "/placeholder.svg"}
                                    alt={game.name || game.title}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        </Link>)
                    }

                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <Link to={`/games/${game.id}`}>
                                    <CardTitle className={`hover:text-[#EDEDED]/80 transition-colors ${variant === "wide" ? "text-xl" : "text-1xl pr-2"}`}>
                                        {game.name || game.title}
                                    </CardTitle>
                                </Link>
                                <CardDescription className="text-(--color-light-ed)/60">{game.genre} </CardDescription>
                            </div>
                            <Badge variant="outline" className="border-(--color-light-ed)/20 bg-(--color-foreground)/5">
                                <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                                {(game.rating && game.rating.toFixed) ? game.rating.toFixed(1) : game.rating || "-"}
                            </Badge>
                        </div>
                    </CardHeader>

                    {variant == "wide" && <CardContent className="flex-grow">
                        <p className="text-sm text-(--color-foreground)/80">
                            {truncateTextWords(game.summary || game.description || "", 20)}
                        </p>
                    </CardContent>}

                    <div className="flex-grow" />


                    <CardFooter className="flex items-center justify-between">
                        <span className="text-lg font-bold">${game.price}</span>
                        <Button
                            className="bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-[#EDEDED]/90"
                            onClick={(e) => {
                                e.preventDefault()
                                addToCart(game)
                                navigate(`/games/${game.id}`)
                            }}
                        >
                            Buy
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default GamesGrid

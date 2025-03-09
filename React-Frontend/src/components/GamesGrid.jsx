import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { truncateTextWords } from '../utils/truncateText'
import { useCart } from "@/src/contexts/cart-context"

const GamesGrid = ({ filteredGames, gridCol = 4, variant = "default", start = 0, end }) => {
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



    return (
        <div className={getGridClass()}>
            {filteredGames.map((game, index) => (
                <Card
                    key={game.id || `game-${index}`}
                    className="pt-0 overflow-hidden border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED]"
                >
                    <Link to={`/games/${game.id}`}>
                        <div className={getCardImageClass()}>
                            <img
                                src={game.cover_url || game.image || "/placeholder.svg"}
                                alt={game.name || game.title}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    </Link>

                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <Link to={`/games/${game.id}`}>
                                    <CardTitle className={`hover:text-[#EDEDED]/80 transition-colors ${variant === "wide" ? "text-xl" : "text-1xl pr-10"}`}>
                                        {game.name || game.title}
                                    </CardTitle>
                                </Link>
                                <CardDescription className="text-[#EDEDED]/60">{game.genre}</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-[#EDEDED]/20 bg-[#EDEDED]/5">
                                <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                                {(game.rating && game.rating.toFixed) ? game.rating.toFixed(1) : game.rating || "-"}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <p className="text-sm text-[#EDEDED]/80">
                            {truncateTextWords(game.summary || game.description || "", 15)}
                        </p>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between">
                        <span className="text-lg font-bold">${game.price}</span>
                        <Button
                            className="bg-[#EDEDED] text-[#030404] hover:bg-[#EDEDED]/90"
                            onClick={(e) => {
                                e.preventDefault()
                                addToCart(game)
                                navigate("/cart")
                            }}
                        >
                            Add to Cart
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

export default GamesGrid

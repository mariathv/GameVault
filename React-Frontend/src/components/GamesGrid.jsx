"use client"
import { useNavigate } from "react-router-dom"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { truncateTextWords } from "../utils/truncateText"
import { useCart } from "@/src/contexts/cart-context"
import { getDiscountedPrice } from "../utils/funcs"
import { toSlug } from "../utils/slugconverter"
import { useCurrency } from "../contexts/currency-context"

const GamesGrid = ({ filteredGames, gridCol = 4, variant = "default", start = 0, end, limit }) => {
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const { currency, convertPrice } = useCurrency()

    const getGridClass = () => {
        if (variant === "wide") {
            return "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        }
        switch (gridCol) {
            case 3:
                return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            case 4:
                return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            case 5:
                return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            case 6:
                return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
            default:
                return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        }
    }

    const getCardImageClass = () => {
        return variant === "wide" ? "aspect-video w-full overflow-hidden" : "aspect-[4/4] w-full overflow-hidden"
    }

    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`
    }

    return (
        <div className={getGridClass()}>
            {filteredGames.slice(0, limit).map((game, index) => (
                <Card
                    key={game.id || `game-${index}`}
                    className="flex flex-col pt-0 overflow-hidden border-(--color-light-ed)/10 bg-(--color-light-ed)/5 text-(--color-foreground)"
                >
                    {variant != "wide" ? (
                        <Link to={`/games/${game.id}/${game.slug || toSlug(game.name)}`}>
                            <div className={`${getCardImageClass()} relative`}>
                                <img
                                    src={game.cover_url || game.image || "/placeholder.svg"}
                                    alt={game.name || game.title}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                                {game.isDiscount && (
                                    <div className="absolute w-max top-2 -right-6 bg-red-600/75 text-white px-6 py-1 text-xs font-bold border-white border-1 transform rotate-45 shadow-lg">
                                        ON SALE
                                    </div>
                                )}
                            </div>
                        </Link>
                    ) : (
                        <Link to={`/games/${game.id}/${game.slug || toSlug(game.name)}`}>
                            <div className={`${getCardImageClass()} relative`}>
                                <img
                                    src={
                                        (game.artworks_extracted &&
                                            game.artworks_extracted.length > 0 &&
                                            createImageUrl(game.artworks_extracted[0]?.image_id)) ||
                                        "/placeholder.svg"
                                    }
                                    alt={game.name || game.title}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                                {game.isDiscount && (
                                    <div className="absolute top-2 right-2 flex items-center bg-red-600/75 text-white px-2 sm:px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 10h3M3 6h3m-3 8h3M3 18h3m4-8h3m-3 4h3m-3 4h3M14 6h3m-3 4h3m-3 4h3m-3 4h3"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">ON SALE</span> {game.discountPercentage}% OFF
                                    </div>
                                )}
                            </div>
                        </Link>
                    )}

                    <CardHeader >
                        <div className="flex items-start justify-between">
                            <div>
                                <Link to={`/games/${game.id}`}>
                                    <CardTitle
                                        className={`hover:text-(--color-light-ed)/80 transition-colors ${variant === "wide" ? "text-base sm:text-lg md:text-xl" : "text-sm sm:text-base md:text-lg pr-2"}`}
                                    >
                                        {game.name || game.title}
                                    </CardTitle>
                                </Link>
                                <CardDescription className="text-(--color-light-ed)/60 text-xs sm:text-sm">
                                    {game.genre}{" "}
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="border-(--color-light-ed)/20 bg-(--color-foreground)/5 text-xs">
                                <Star className="mr-1 h-2 w-2 sm:h-3 sm:w-3 fill-current text-yellow-500" />
                                {game.rating && game.rating.toFixed ? game.rating.toFixed(1) : game.rating || "-"}
                            </Badge>
                        </div>
                    </CardHeader>


                    {variant == "wide" && (
                        <CardContent className="flex-grow p-3 sm:p-4 md:p-6 pt-0">
                            <p className="text-xs sm:text-sm text-(--color-foreground)/80">
                                {truncateTextWords(game.summary || game.description || "", 20)}
                            </p>
                        </CardContent>
                    )}

                    <div className="flex-grow" />

                    <CardFooter className="flex items-center justify-between px-4 sm:px-4 md:px-6">
                        <div className="flex items-center flex-wrap">
                            <span
                                className={`text-sm sm:text-base md:text-[16px] font-bold ${game.isDiscount ? "line-through text-gray-500" : ""}`}
                            >
                                {convertPrice(game.price, 1)}
                            </span>
                            {game.isDiscount && (
                                <span className="flex-1 text-sm sm:text-base md:text-[16px] font-bold ml-2 pr-2 sm:pr-4">
                                    {convertPrice(getDiscountedPrice(game.price, game.discountPercentage), 1)}
                                </span>
                            )}
                        </div>


                        <Button
                            className="bg-(--color-light-ed) text-(--color-alt-foreground) hover:bg-(--color-light-ed)/90 text-xs sm:text-sm"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault()
                                addToCart(game)
                                navigate(`/games/${game.id}/${game.slug || toSlug(game.name)}`)
                            }}
                        >
                            Buy
                        </Button>
                    </CardFooter>

                </Card>
            ))
            }
        </div >
    )
}

export default GamesGrid

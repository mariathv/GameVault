
import React from 'react'


import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { truncateTextWords } from '../utils/truncateText'
import { useCart } from "@/src/contexts/cart-context"
import { useNavigate } from 'react-router-dom'
const GamesGrid = ({ filteredGames }) => {
    const navigate = useNavigate()
    const { addToCart } = useCart()
    console.log(filteredGames);
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredGames.slice(0, 6).map((game) => (
                <Card key={game.id} className="max-w-80 mx-auto overflow-hidden border-[#EDEDED]/10 bg-[#EDEDED]/5 text-[#EDEDED]">
                    <Link to={`/games/${game.id}`}>
                        <div className="aspect-[4/4] w-full overflow-hidden">
                            <img
                                src={game.cover_url || "/placeholder.svg"}
                                alt={game.name}
                                className="w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    </Link>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <Link to={`/games/${game.id}`}>
                                    <CardTitle className="text-1xl hover:text-[#EDEDED]/80 transition-colors pr-10">{game.name}</CardTitle>
                                </Link>
                                <CardDescription className="text-[#EDEDED]/60">{game.genre}</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-[#EDEDED]/20 bg-[#EDEDED]/5">
                                <Star className="mr-1 h-3 w-3 fill-current text-yellow-500" />
                                {game.rating ? game.rating.toFixed(1) : "-"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-[#EDEDED]/80">{truncateTextWords(game.summary, 15)}</p>
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
import React from 'react'
import { getDiscountedPrice } from "@/src/utils/funcs"
import { Tag } from 'lucide-react'
import { useCurrency } from '../contexts/currency-context'

function ExploreGameCard({ game }) {
    const { currency, convertPrice } = useCurrency()

    return (
        <div className="group cursor-pointer">
            <div className="relative">
                <img
                    src={game.cover_url}
                    alt={game.title}
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 pb-4 flex flex-col gap-2">
                    <div className="flex items-center">
                        <span className={`bg-[#1A1F2E] px-4 py-1 rounded-r-full text-sm`}>
                            <span className={` ${game.isDiscount ? "line-through text-gray-500" : "text-white"}`}>

                                {convertPrice(game.price)}
                            </span>
                            {game.isDiscount &&
                                <span className=" text-sm sm:text-sm md:text-sm font-bold ml-2 pr-2 sm:pr-4 text-white">
                                    {convertPrice(getDiscountedPrice(game.price, game.discountPercentage))}
                                </span>
                            }
                        </span>

                    </div>
                    <h3 className="text-white font-bold pl-2 text-sm sm:text-base line-clamp-1">{game.name}</h3>
                </div>
                {game.isNew && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        NEW
                    </span>
                )}
                {game.isDiscount && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        ON SALE
                        <Tag className="ml-1 w-3 h-3" />
                    </span>

                )}
            </div>
        </div>
    )
}

export default ExploreGameCard
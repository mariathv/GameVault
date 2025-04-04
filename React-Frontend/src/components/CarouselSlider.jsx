import React from 'react'
import GameCard from './GameCard'
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from "lucide-react"



export default function CarouselSlider({ mapItems }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => {
            console.log(prev);
            if (prev == 5)
                return (1 % mapItems.length)
            return (prev + 1) % mapItems.length;
        });
    };


    const prevSlide = () => {
        setCurrentSlide((prev) => {
            console.log(prev);
            if (prev == 0) {
                return (mapItems.length - 5)
            }
            return prev === 0 ? mapItems.length - 1 : prev - 1;
        });
    };

    return (
        <section className="mb-12">
            {/* <h2 className="text-2xl font-bold mb-6 text-(--color-foreground)">GAME EXPLORER</h2> */}
            <div className="relative">
                <div className="flex gap-4 overflow-hidden">
                    <div
                        className="flex gap-4 transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * (240 + 16)}px)` }}
                    >
                        {mapItems && mapItems.map((game, index) => (
                            <GameCard game={game} />))}
                    </div>
                </div>
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-r text-white hover:bg-black/70"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-l text-white hover:bg-black/70"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </section>
    )
}

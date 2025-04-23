import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../contexts/currency-context';

const GameCarousel = ({ games, autoSlideInterval = 5000, className = '' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { currency, convertPrice } = useCurrency()

    const navigate = useNavigate();

    const prevSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? games.length - 1 : prevIndex - 1
        );
        setTimeout(() => setIsTransitioning(false), 500);
    }, [games.length, isTransitioning]);

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) =>
            prevIndex === games.length - 1 ? 0 : prevIndex + 1
        );
        setTimeout(() => setIsTransitioning(false), 500);
    }, [games.length, isTransitioning]);

    useEffect(() => {
        let intervalId;
        if (isAutoPlaying && games.length > 1) {
            intervalId = window.setInterval(nextSlide, autoSlideInterval);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isAutoPlaying, nextSlide, autoSlideInterval, games.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [prevSlide, nextSlide]);

    if (!games || games.length === 0) return null;

    const currentGame = games[currentIndex];

    function createImageUrl(id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`
    }

    return (
        <div
            className={`relative overflow-hidden ${className} my-12 rounded-lg`}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[500px]">
                {/* Background Image with Parallax Effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform scale-110"
                    style={{
                        backgroundImage: `url('${currentGame.artworks_extracted?.length > 0
                            ? createImageUrl(currentGame.artworks_extracted[0]?.image_id)
                            : "/placeholder.svg"
                            }')`,
                        opacity: isTransitioning ? 0.7 : 1,
                        transform: `scale(${isTransitioning ? 1.18 : 1.1})`,
                    }}

                >
                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                </div>

                {/* Game Content Container */}
                <div className="relative h-full flex items-end p-8 sm:p-10 md:p-12 lg:p-16 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-8 w-full">
                        {/* Game Cover Image */}
                        <div className={`hidden md:block w-64 lg:w-72 flex-shrink-0 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
                            }`}>
                            <div className="relative group">
                                <img
                                    src={currentGame.cover_url}
                                    alt={currentGame.name}
                                    className="rounded-lg shadow-2xl transform transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>

                        {/* Game Info */}
                        <div className={`flex-1 transition-all duration-500 ${isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                            }`}>
                            {/* Genre Badge */}
                            <div className="text-lg font-bold inline-block bg-black/80 backdrop-blur-md px-3 py-1 rounded-full mb-4">
                                <span className="text-white/90 text-md font-bold">{convertPrice(currentGame.price)}</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
                                {currentGame.name}
                            </h2>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="text-yellow-400 font-semibold">{currentGame.rating.toFixed(2)}</span>
                            </div>

                            <p className="text-sm text-white/80 mb-6 max-w-2xl leading-relaxed">
                                {currentGame.summary}
                            </p>

                            <button
                                className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 backdrop-blur-md hover:shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5"
                                onClick={() => navigate(`/games/${currentGame.id}/${currentGame.slug}`)}
                            >
                                View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md hover:scale-110 z-10"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md hover:scale-110 z-10"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Enhanced Progress Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                    {games.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setIsTransitioning(true);
                                setCurrentIndex(index);
                                setTimeout(() => setIsTransitioning(false), 500);
                            }}
                            className={`relative h-1.5 transition-all duration-300 rounded-full ${index === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div >
    );
};

export default GameCarousel;
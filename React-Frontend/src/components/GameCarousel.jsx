import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../contexts/currency-context';

const GameCarousel = ({ games, autoSlideInterval = 5000, className = '' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const { currency, convertPrice } = useCurrency();

    const navigate = useNavigate();

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const prevSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? games.length - 1 : prevIndex - 1
        );
        setTimeout(() => setIsTransitioning(false), 500);
    }, [games?.length, isTransitioning]);

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) =>
            prevIndex === games.length - 1 ? 0 : prevIndex + 1
        );
        setTimeout(() => setIsTransitioning(false), 500);
    }, [games?.length, isTransitioning]);

    // Handle touch events for swipe functionality
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isSwipe = Math.abs(distance) > minSwipeDistance;

        if (isSwipe) {
            if (distance > 0) {
                nextSlide(); // Left swipe
            } else {
                prevSlide(); // Right swipe
            }
        }
    };

    useEffect(() => {
        let intervalId;
        if (isAutoPlaying && games?.length > 1) {
            intervalId = window.setInterval(nextSlide, autoSlideInterval);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isAutoPlaying, nextSlide, autoSlideInterval, games?.length]);

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
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;
    }

    return (
        <div
            className={`relative overflow-hidden ${className} my-6 md:my-8 lg:my-12 rounded-lg`}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform scale-110"
                    style={{
                        backgroundImage: `url('${
                            currentGame.artworks_extracted?.length > 0
                                ? createImageUrl(currentGame.artworks_extracted[0]?.image_id)
                                : "/placeholder.svg"
                        }')`,
                        opacity: isTransitioning ? 0.7 : 1,
                        transform: `scale(${isTransitioning ? 1.18 : 1.1})`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                </div>

                <div className="relative h-full flex items-end p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
                    <div className="flex flex-col items-start gap-4 md:gap-6 lg:gap-8 w-full">
                        {/* Mobile game cover - shown only on small screens */}
                        <div className={`block md:hidden w-20 sm:w-24 absolute top-4 right-4 transition-all duration-500 ${
                            isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                        }`}>
                            <div className="relative">
                                <img
                                    src={currentGame.cover_url}
                                    alt={currentGame.name}
                                    className="rounded-md shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Desktop game cover - hidden on small screens */}
                        <div className={`hidden md:block w-48 lg:w-64 xl:w-72 flex-shrink-0 transition-all duration-500 ${
                            isTransitioning ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
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

                        <div className={`flex-1 transition-all duration-500 ${
                            isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                        }`}>
                            <div className="text-sm sm:text-base font-bold inline-block bg-black/80 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full mb-2 md:mb-4">
                                <span className="text-white/90 font-bold">{convertPrice(currentGame.price)}</span>
                            </div>

                            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 line-clamp-2">
                                {currentGame.name}
                            </h2>

                            <div className="flex items-center gap-2 mb-2 sm:mb-4">
                                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                                <span className="text-yellow-400 font-semibold text-sm sm:text-base">{currentGame.rating.toFixed(1)}</span>
                            </div>

                            <p className="text-xs sm:text-sm text-white/80 mb-4 sm:mb-6 max-w-2xl leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
                                {currentGame.summary}
                            </p>

                            <button
                                className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 sm:py-3 sm:px-8 rounded-lg transition-all duration-300 backdrop-blur-md hover:shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5 text-sm sm:text-base"
                                onClick={() => navigate(`/games/${currentGame.id}/${currentGame.slug}`)}
                            >
                                View Game
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation buttons - made smaller on mobile */}
                <button
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-md hover:scale-110 z-10 shadow-lg"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-md hover:scale-110 z-10 shadow-lg"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Indicators - optimized for mobile */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {games.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setIsTransitioning(true);
                                setCurrentIndex(index);
                                setTimeout(() => setIsTransitioning(false), 500);
                            }}
                            className={`relative h-1 sm:h-1.5 transition-all duration-300 rounded-full ${
                                index === currentIndex ? 'w-6 sm:w-8 bg-white' : 'w-3 sm:w-4 bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameCarousel;
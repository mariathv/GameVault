import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../contexts/currency-context";

const GameCarousel = ({ games, autoSlideInterval = 5000, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const { convertPrice } = useCurrency();
  const navigate = useNavigate();
  const minSwipeDistance = 50;

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [games.length, isTransitioning]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [games.length, isTransitioning]);

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
    if (Math.abs(distance) > minSwipeDistance) {
      distance > 0 ? nextSlide() : prevSlide();
    }
  };

  useEffect(() => {
    let intervalId;
    if (isAutoPlaying && games?.length > 1) {
      intervalId = window.setInterval(nextSlide, autoSlideInterval);
    }
    return () => clearInterval(intervalId);
  }, [isAutoPlaying, nextSlide, autoSlideInterval, games.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      else if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  if (!games || games.length === 0) return null;

  const currentGame = games[currentIndex];

  const createImageUrl = (id) =>
    `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;

  return (
    <div
      className={`relative overflow-hidden ${className} my-4 sm:my-6 md:my-8 lg:my-10 xl:my-12 rounded-lg`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px]">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform"
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

        {/* Content */}
        <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-start gap-4 md:gap-8 pt-6 pb-10 md:pt-0 md:pb-0">
          {/* Mobile Cover */}
          {/* Mobile Cover (inline) */}
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

          {/* Desktop Cover */}
          <div
            className={`hidden md:block transition-all duration-500 w-auto max-w-[280px] lg:max-w-[320px] xl:max-w-[360px] ${
              isTransitioning
                ? "opacity-0 -translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="relative group">
              <img
                src={currentGame.cover_url}
                alt={currentGame.name}
                className="rounded-lg shadow-2xl transition-transform transform group-hover:scale-105 w-full h-auto"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Text */}
          <div
            className={`flex-1 transition-all duration-500 md:pl-4 lg:pl-6 max-w-full md:max-w-[60%] lg:max-w-[70%] ${
              isTransitioning
                ? "opacity-0 -translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="text-sm sm:text-base bg-black/80 text-white px-3 py-1 rounded-full mb-2 sm:mb-3 md:mb-4 inline-block">
              {convertPrice(currentGame.price)}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 line-clamp-2">
              {currentGame.name}
            </h2>
            <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                {currentGame.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-5 md:mb-6 max-w-full sm:max-w-2xl leading-relaxed line-clamp-4 sm:line-clamp-5 md:line-clamp-6 lg:line-clamp-none">
              {currentGame.summary}
            </p>
            <button
              className="bg-white/10 hover:bg-white/20 text-white py-2 px-5 sm:py-2.5 sm:px-6 md:py-3 md:px-8 rounded-lg backdrop-blur-md transition-all hover:shadow-lg hover:translate-y-[-2px]"
              onClick={() =>
                navigate(`/games/${currentGame.id}/${currentGame.slug}`)
              }
            >
              View Game
            </button>
          </div>
        </div>

        {/* Nav Buttons */}
        <button
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition hover:scale-110 z-10 shadow"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-3 rounded-full backdrop-blur-md transition hover:scale-110 z-10 shadow"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-4 bg-white/40 hover:bg-white/60"
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

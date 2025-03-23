import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingCart, Share2, Moon, User } from 'lucide-react';
import Header from "@/src/components/Header";


// Dummy data for the wishlist
const dummyWishlistGames = [
  {
    id: 1,
    name: "Cyberpunk 2077",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rft.jpg",
    price: 38.00,
    rating: 81.6,
    genres: ["Shooter", "Role-playing (RPG)", "Adventure"],
    description: "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality."
  },
  {
    id: 2,
    name: "Red Dead Redemption 2",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q9f.jpg",
    price: 56.00,
    rating: 93.0,
    genres: ["Action", "Adventure", "Open World"],
    description: "Red Dead Redemption 2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age."
  },
  {
    id: 3,
    name: "Cities: Skylines II",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qkl.jpg",
    price: 29.00,
    rating: 62.6,
    genres: ["Simulation", "Strategy"],
    description: "Create and manage your own city without restrictions. Offering a deep simulation and a living economy, Cities: Skylines II will challenge your decision-making skills and creativity."
  }
];

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(dummyWishlistGames);

  const removeFromWishlist = (gameId) => {
    setWishlistItems(prev => prev.filter(game => game.id !== gameId));
  };

  const handleAddToCart = (game) => {
    // In a real implementation, this would add to cart
    console.log("Adding to cart:", game.name);
    // You would call your cart context method here
  };

  return (
    <div className="min-h-screen bg-[#0f1623]">
      {/* Header */}
      <Header />
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="h-16 w-16 text-gray-700 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-white">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Add games to your wishlist to keep track of what you want to play next
            </p>
            <button 
              onClick={() => navigate("/")} 
              className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wishlistItems.map((game) => (
              <div 
                key={game.id} 
                className="bg-[#1c2536] rounded-lg overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 lg:w-1/4">
                    <img 
                      src={game.image || "/placeholder.svg"} 
                      alt={game.name}
                      className="w-full h-full object-cover aspect-[16/9] md:aspect-auto"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h2 className="text-xl font-bold text-white">{game.name}</h2>
                          <div className="ml-3 flex items-center bg-[#1a1f2b] px-2 py-1 rounded-md">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-sm font-medium text-white">{game.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {game.genres.map((genre, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 text-sm bg-[#2a3349] rounded-full text-white"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-400 mb-4 line-clamp-2 md:line-clamp-3">
                          {game.description}
                        </p>
                      </div>
                      <div className="text-2xl font-bold text-white self-start md:self-end">
                        ${game.price.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => handleAddToCart(game)}
                        className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition flex items-center justify-center"
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => removeFromWishlist(game.id)}
                        className="px-6 py-3 bg-transparent border border-gray-600 text-white font-medium rounded-md hover:bg-[#2a3349] transition flex items-center justify-center"
                      >
                        <Heart className="h-5 w-5 mr-2 fill-white" />
                        Remove from Wishlist
                      </button>
                      <button className="px-6 py-3 bg-transparent border border-gray-600 text-white font-medium rounded-md hover:bg-[#2a3349] transition flex items-center justify-center sm:ml-auto">
                        <Share2 className="h-5 w-5 mr-2" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, Share2, ShoppingCart } from "lucide-react"
import Header from "@/src/components/Header"
import { useAuth } from "@/src/contexts/auth-context"
import { getWishlist, removeFromWishlist } from "@/src/hooks/useWishlist"
import { useCart } from "@/src/contexts/cart-context"

export default function WishlistPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)

  // Show notification function
  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    // Auto-hide notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log("Fetching wishlist for user:", user._id)
        const response = await getWishlist(user._id)
        console.log("Wishlist data received:", response)

        // Check if response has the expected structure
        if (response && response.status === "success" && response.wishlist) {
          // Extract games from the wishlist response
          const wishlistGames = response.wishlist.games || []

          // Map the games to extract game objects
          const games = wishlistGames
            .map((item) => {
              // Handle both cases: when gameId is an object or just an ID
              return typeof item.gameId === "object" ? item.gameId : item
            })
            .filter((game) => game) // Filter out any undefined/null items

          console.log("Processed wishlist games:", games)
          setWishlistItems(games)
        } else {
          console.error("Unexpected wishlist data structure:", response)
          setError("Failed to load wishlist data. Please try again later.")
          setWishlistItems([])
        }
        setLoading(false)
      } catch (err) {
        console.error("Error fetching wishlist:", err)
        setError("Failed to load wishlist. Please try again later.")
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user])

  const handleRemoveFromWishlist = async (gameId) => {
    if (!user) return

    try {
      console.log("Removing game from wishlist:", gameId)
      await removeFromWishlist(user._id, gameId)
      // Update local state to reflect the removal
      setWishlistItems((prev) => prev.filter((game) => game._id !== gameId))
      showNotification("Game removed from wishlist", "success")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      showNotification("Failed to remove game from wishlist", "error")
    }
  }

  const handleAddToCart = (game) => {
    addToCart(game)
    showNotification(`${game.name} added to cart`, "success")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f1623]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Wishlist</h1>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="h-16 w-16 text-gray-700 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-white">Please log in to view your wishlist</h2>
            <p className="text-gray-400 mb-6 max-w-md">You need to be logged in to manage your wishlist</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition"
            >
              Log In
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1623]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Wishlist</h1>
          <div className="flex justify-center items-center py-20">
            <div className="loader border-t-4 border-white"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1623]">
      {/* Simple notification component */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Wishlist</h1>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-md mb-6">{error}</div>}

        {wishlistItems.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="h-16 w-16 text-gray-500 mb-4" />
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
          <div className="space-y-6">
            {wishlistItems.map((game) => (
              <div key={game._id || game.id} className="bg-[#1a2234] rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-64 flex-shrink-0">
                    <img
                      src={game.cover_url || "/placeholder.svg"}
                      alt={game.name}
                      className="w-full h-full object-cover"
                      onClick={() => navigate(`/games/${game.id}`)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div>
                      <div className="flex items-center mb-2">
                        <h2
                          className="text-xl font-bold text-white hover:text-gray-300 cursor-pointer"
                          onClick={() => navigate(`/games/${game.id}`)}
                        >
                          {game.name}
                        </h2>
                        <div className="ml-3 flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="text-sm font-medium text-white">{game.rating?.toFixed(1) || "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {game.genres?.map((genre, index) => (
                          <span key={index} className="px-3 py-1 text-sm bg-[#2a3349] rounded-full text-white">
                            {typeof genre === "object" ? genre.name : genre}
                          </span>
                        ))}
                      </div>

                      <p className="text-gray-400 mb-6 line-clamp-2">
                        {game.summary || game.description || "No description available."}
                      </p>

                      <div className="text-2xl font-bold text-white mb-6">${game.price?.toFixed(2) || "N/A"}</div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAddToCart(game)}
                          className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2 inline-block" />
                          Add to Cart
                        </button>

                        <button
                          onClick={() => handleRemoveFromWishlist(game._id)}
                          className="px-4 py-2 bg-transparent border border-gray-600 text-white font-medium rounded-md hover:bg-[#2a3349] transition flex items-center justify-center"
                        >
                          <Heart className="h-4 w-4 mr-2 fill-white" />
                          Remove
                        </button>

                        <button className="px-4 py-2 bg-transparent border border-gray-600 text-white font-medium rounded-md hover:bg-[#2a3349] transition flex items-center justify-center">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}


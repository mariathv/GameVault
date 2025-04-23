import { fetchData, apiRequest } from "./api/api-gamevault"

/**
 * Get wishlist for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The wishlist data
 */
export const getWishlist = async (userId) => {
  try {
    const response = await fetchData(`wishlist/${userId}`, {
      method: "GET",
    })

    console.log("Wishlist API response:", response) // Debug log

    // Return the entire response object from the API
    return response
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    // Return empty wishlist on error to prevent UI crashes
    return { status: "error", wishlist: { games: [] } }
  }
}

/**
 * Add a game to wishlist
 * @param {string} userId - The user ID
 * @param {string} gameId - The game ID
 * @returns {Promise<Object>} - The response data
 */
export const addToWishlist = async (userId, gameId) => {
  try {
    console.log("Adding to wishlist:", { userId, gameId }) // Debug log

    const response = await apiRequest("wishlist/add", { userId, gameId }, "POST")

    console.log("Add to wishlist response:", response) // Debug log

    return response
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw error
  }
}

/**
 * Remove a game from wishlist
 * @param {string} userId - The user ID
 * @param {string} gameId - The game ID
 * @returns {Promise<Object>} - The response data
 */
export const removeFromWishlist = async (userId, gameId) => {
  try {
    console.log("Removing from wishlist:", { userId, gameId }) // Debug log

    const response = await apiRequest("wishlist/remove", { userId, gameId }, "POST")

    console.log("Remove from wishlist response:", response) // Debug log

    return response
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    throw error
  }
}

// Update the isGameInWishlist function to better handle different data structures
export const isGameInWishlist = (wishlistGames, game) => {
  if (!wishlistGames || !game) return false

  console.log("Checking if game is in wishlist:", {
    gameId: game._id || game.id,
    wishlistGames: wishlistGames.map((g) => {
      return {
        gameId: g.gameId?._id || g.gameId,
        gameIdObj: g.gameId?.id,
        type: typeof g.gameId,
      }
    }),
  })

  const result = wishlistGames.some((item) => {
    // Handle different possible structures of wishlist items
    const itemGameId = item.gameId?._id || item.gameId
    const gameIdToCheck = game._id || game.id

    // Check for direct ID match
    if (itemGameId === gameIdToCheck) {
      console.log("Direct ID match found:", { itemGameId, gameIdToCheck })
      return true
    }

    // Check for ID match in nested object
    if (item.gameId?.id && item.gameId.id === gameIdToCheck) {
      console.log("Nested ID match found:", { nestedId: item.gameId.id, gameIdToCheck })
      return true
    }

    // Check for ID match when gameId is an object with id property
    if (typeof itemGameId === "object" && itemGameId.id === gameIdToCheck) {
      console.log("Object ID match found:", { objectId: itemGameId.id, gameIdToCheck })
      return true
    }

    // Check for string ID match
    if (
      typeof itemGameId === "string" &&
      typeof gameIdToCheck === "string" &&
      itemGameId.toString() === gameIdToCheck.toString()
    ) {
      console.log("String ID match found:", { itemGameId, gameIdToCheck })
      return true
    }

    // Check for numeric ID match
    if (typeof itemGameId === "number" && typeof gameIdToCheck === "number" && itemGameId === gameIdToCheck) {
      console.log("Numeric ID match found:", { itemGameId, gameIdToCheck })
      return true
    }

    return false
  })

  console.log("Game in wishlist result:", result)
  return result
}


const Wishlist = require("../models/wishlist")
const Store = require("../models/store") // Using store.js instead of store-games.model

exports.addToWishlist = async (req, res) => {
  try {
    const { userId, gameId } = req.body
    console.log("Add to wishlist request:", { userId, gameId })

    // Find existing wishlist or create a new one
    let wishlist = await Wishlist.findOne({ userId })

    if (!wishlist) {
      console.log("Creating new wishlist for user:", userId)
      wishlist = new Wishlist({
        userId,
        games: [],
      })
    }

    // Check if game is already in wishlist
    const gameExists = wishlist.games.some((item) => item.gameId.toString() === gameId.toString())

    if (!gameExists) {
      console.log("Adding game to wishlist:", gameId)
      wishlist.games.push({ gameId })
      await wishlist.save()
      console.log("Game added to wishlist successfully")
    } else {
      console.log("Game already in wishlist")
    }

    // Populate game details for response
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate("games.gameId")

    return res.status(200).json({
      status: "success",
      message: "Game added to wishlist",
      wishlist: populatedWishlist,
    })
  } catch (error) {
    console.error("Add to wishlist error:", error)
    return res.status(500).json({
      status: "error",
      message: "Failed to add game to wishlist",
      error: error.message,
    })
  }
}

exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, gameId } = req.body
    console.log("Remove from wishlist request:", { userId, gameId })

    // Find wishlist
    const wishlist = await Wishlist.findOne({ userId })

    if (!wishlist) {
      console.log("Wishlist not found for user:", userId)
      return res.status(404).json({
        status: "error",
        message: "Wishlist not found",
      })
    }

    // Remove game from wishlist
    const initialLength = wishlist.games.length
    wishlist.games = wishlist.games.filter((item) => item.gameId.toString() !== gameId.toString())

    if (wishlist.games.length === initialLength) {
      console.log("Game not found in wishlist:", gameId)
    } else {
      console.log("Game removed from wishlist:", gameId)
    }

    await wishlist.save()

    // Populate game details for response
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate("games.gameId")

    return res.status(200).json({
      status: "success",
      message: "Game removed from wishlist",
      wishlist: populatedWishlist,
    })
  } catch (error) {
    console.error("Remove from wishlist error:", error)
    return res.status(500).json({
      status: "error",
      message: "Failed to remove game from wishlist",
      error: error.message,
    })
  }
}

exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params
    console.log("Get wishlist request for user:", userId)

    // Find wishlist and populate game details
    let wishlist = await Wishlist.findOne({ userId }).populate("games.gameId")

    // If no wishlist exists, create an empty one
    if (!wishlist) {
      console.log("No wishlist found, creating new one for user:", userId)
      wishlist = new Wishlist({
        userId,
        games: [],
      })
      await wishlist.save()
    } else {
      console.log("Wishlist found with", wishlist.games.length, "games")
    }

    return res.status(200).json({
      status: "success",
      wishlist,
    })
  } catch (error) {
    console.error("Get wishlist error:", error)
    return res.status(500).json({
      status: "error",
      message: "Failed to get wishlist",
      error: error.message,
    })
  }
}


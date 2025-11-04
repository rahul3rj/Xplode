const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const favorites = require("../models/favorites");



router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const favoriteGames = await favorites.find({ user: userId }).sort({ addedAt: -1 });
    res.status(200).json(favoriteGames);
  } catch (err) {
    console.error("Error fetching favorite games:", err.message);
    res.status(500).json({ message: "Failed to fetch favorite games", error: err.message });
  }
});

// routes/favorite.js (continued from your existing code)
router.post("/add", verifyToken, async (req, res) => {

  try {
    const userId = req.user.id;
    const { steam_appid, name, portrait_image, hero_image, developers, publishers, categories, movies } = req.body;

    // Check if game already exists in user's favorite
    const existingGame = await favorites.findOne({ user: userId, steam_appid });
    if (existingGame) {
      return res.status(400).json({ message: "Game already exists in your favorite" });
    }

    // Create new favorite entry
    const newfavoriteGame = new favorites({
      steam_appid,
      name,
      portrait_image: portrait_image || "/default-game-cover.jpg",
      hero_image,
      developers,
      publishers,
      categories,
      movies,
      user: userId
    });

    await newfavoriteGame.save();
    res.status(201).json({ message: "Game added to favorite", game: newfavoriteGame });
  } catch (err) {
    console.error("Error adding game to favorite:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Game already exists in your favorite" });
    }
    res.status(500).json({ message: "Failed to add game to favorite", error: err.message });
  }
});

router.post("/remove/:steamAppId", verifyToken, async (req, res) => {

  console.log("route hit")

  try {
    const userId = req.user.id;
    const { steamAppId } = req.params;
    console.log(steamAppId)

    // Delete the game
    const result = await favorites.findOneAndDelete({ 
      steam_appid: steamAppId, 
      user: userId 
    });
    
    if (!result) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Explicitly JSON response bhejo
    res.status(200).json({ message: "Game removed from favorite", success: true });
  } catch (err) {
    console.error("Error removing game:", err.message);
    // Error mein bhi JSON response bhejo
    res.status(500).json({ message: "Failed to remove game", error: err.message });
  }
});

// Verify game route - POST method
router.post("/verify/:steamAppId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { steamAppId } = req.params;

    console.log("Verifying game:", steamAppId, "for user:", userId);

    // Update verified status to true
    const updatedGame = await favorites.findOneAndUpdate(
      { steam_appid: steamAppId, user: userId },
      { verified: true },
      { new: true }
    );

    if (!updatedGame) {
      return res.status(404).json({ 
        success: false,
        message: "Game not found in your favorite" 
      });
    }

    console.log("Game verified successfully:", updatedGame.name);
    
    res.status(200).json({ 
      message: "Game verified successfully", 
      game: updatedGame,
      success: true
    });
  } catch (err) {
    console.error("Error verifying game:", err.message);
    res.status(500).json({ 
      message: "Failed to verify game", 
      error: err.message,
      success: false
    });
  }
});


module.exports = router;
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const librarys = require("../models/librarys");

router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const libraryGames = await librarys.find({ user: userId }).sort({ addedAt: -1 });
    res.status(200).json(libraryGames);
  } catch (err) {
    console.error("Error fetching library games:", err.message);
    res.status(500).json({ message: "Failed to fetch library games", error: err.message });
  }
});

// routes/Library.js (continued from your existing code)
router.post("/add", verifyToken, async (req, res) => {

  try {
    const userId = req.user.id;
    const { steam_appid, name, portrait_image, hero_image, developers, publishers, categories, movies } = req.body;

    // Check if game already exists in user's library
    const existingGame = await librarys.findOne({ user: userId, steam_appid });
    if (existingGame) {
      return res.status(400).json({ message: "Game already exists in your library" });
    }

    // Create new library entry
    const newLibraryGame = new librarys({
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

    await newLibraryGame.save();
    res.status(201).json({ message: "Game added to library", game: newLibraryGame });
  } catch (err) {
    console.error("Error adding game to library:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Game already exists in your library" });
    }
    res.status(500).json({ message: "Failed to add game to library", error: err.message });
  }
});

router.post("/remove/:steamAppId", verifyToken, async (req, res) => {

  console.log("route hit")

  try {
    const userId = req.user.id;
    const { steamAppId } = req.params;
    console.log(steamAppId)

    // Delete the game
    const result = await librarys.findOneAndDelete({ 
      steam_appid: steamAppId, 
      user: userId 
    });
    
    if (!result) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Explicitly JSON response bhejo
    res.status(200).json({ message: "Game removed from library", success: true });
  } catch (err) {
    console.error("Error removing game:", err.message);
    // Error mein bhi JSON response bhejo
    res.status(500).json({ message: "Failed to remove game", error: err.message });
  }
});


module.exports = router;
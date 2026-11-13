const express = require("express");
const router = express.Router();
const CommunityGame = require("../models/CommunityGames");

// ✅ Get all community games
router.get("/", async (req, res) => {
    try {
        const communityGames = await CommunityGame.find({ category: 'community' }).sort({ lastUpdated: -1 });
        res.status(200).json(communityGames);
    } catch (error) {
        console.error("Error fetching community games:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get specific community game by appid
router.get("/:appid", async (req, res) => {
    try {
        const appid = parseInt(req.params.appid, 10);
        if (isNaN(appid)) {
            return res.status(400).json({ message: "Invalid appid" });
        }

        const game = await CommunityGame.findOne({ 
            steam_appid: appid 
        });
        
        if (!game) {
            return res.status(404).json({ message: "Community game not found" });
        }

        res.status(200).json(game);
    } catch (error) {
        console.error("Error fetching community game:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Trigger route
router.get("/trigger/trigger", (req, res) => {
    res.send("COMMUNITY TRIGGER ROUTE");
});

// ✅ Game name route
router.post("/:name", (req, res) => {
    res.send("community of the game: " + req.params.name);
});

module.exports = router;
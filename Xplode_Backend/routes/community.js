const express = require("express");
const router = express.Router();
const CommunityGame = require("../models/CommunityGames");
const SearchGames = require("../models/SearchGames");
const GameComment = require("../models/GameComment");

// ✅ Get community reviews (optional ?appid=&limit=)
router.get("/reviews", async (req, res) => {
    try {
        const { appid, limit = 25, page = 1 } = req.query;
        const filter = {};
        if (appid && !isNaN(parseInt(appid, 10))) {
            filter.steam_appid = parseInt(appid, 10);
        }

        const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 25));
        const parsedPage = Math.max(1, parseInt(page, 10) || 1);

        const reviews = await GameComment.find(filter)
            .populate("user_id", "name username profilePic")
            .sort({ createdAt: -1 })
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit)
            .lean();

        // Unique appids in this set to batch-lookup game names
        const appids = [...new Set(reviews.map((r) => r.steam_appid))];
        const [commGames, searchGames] = await Promise.all([
            CommunityGame.find({ steam_appid: { $in: appids } }).select("steam_appid title").lean(),
            SearchGames.find({ steam_appid: { $in: appids } }).select("steam_appid name title").lean(),
        ]);

        const gameNameMap = new Map();
        commGames.forEach((g) => gameNameMap.set(g.steam_appid, g.title));
        searchGames.forEach((g) => {
            if (!gameNameMap.has(g.steam_appid)) {
                gameNameMap.set(g.steam_appid, g.name || g.title);
            }
        });

        const mapped = reviews.map((r) => {
            const u = r.user_id || {};
            return {
                _id: r._id,
                steam_appid: r.steam_appid,
                gameName: gameNameMap.get(r.steam_appid) || `Game ${r.steam_appid}`,
                rating: r.rating,
                comment: r.comment,
                likes: r.likes || 0,
                dislikes: r.dislikes || 0,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                user: {
                    _id: u._id,
                    name: u.name,
                    username: u.username,
                    profilePic: u.profilePic?.data
                        ? {
                            data: u.profilePic.data.toString("base64"),
                            contentType: u.profilePic.contentType,
                        }
                        : null,
                },
            };
        });

        res.status(200).json(mapped);
    } catch (error) {
        console.error("Error fetching community reviews:", error.message);
        res.status(500).json({ error: error.message });
    }
});

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
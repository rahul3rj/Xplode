const express = require("express");
const router = express.Router();
const axios = require("axios");
const HomeGame = require("../models/HomeGames");
const { updateGamesInDB } = require("../scripts/updateHomeGames");
const { updateSearchGamesInDB, fetchAndSaveGameToDB } = require("../scripts/updateSearchGames");
const { updateCommunityGamesInDB } = require("../scripts/updateCommunityGames");
const SearchGames = require("../models/SearchGames");
const GameComment = require("../models/GameComment");
const verifyToken = require("../middlewares/verifyToken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Cache configuration
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
let gameCache = {
  rawGames: [],
  processedGames: [],
  lastFetched: null,
};

// Axios instance with defaults
const steamAPI = axios.create({
  timeout: 5000,
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
});

// Utility function to chunk array
const chunkArray = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (i) =>
    arr.slice(i * size, i * size + size)
  );
};

router.post("/fetch", async (req, res) => {
  try {
    // Check cache validity
    if (
      gameCache.processedGames.length &&
      gameCache.lastFetched &&
      Date.now() - gameCache.lastFetched < CACHE_DURATION
    ) {
      return res.status(200).json(gameCache.processedGames);
    }

    const response = await steamAPI.get(
      `https://api.steampowered.com/ISteamApps/GetAppList/v2/`
    );

    if (!response.data?.applist?.apps) {
      throw new Error("Invalid Steam API response");
    }

    gameCache.rawGames = response.data.applist.apps;
    const allGames = response.data.applist.apps.slice(38, 100);

    // Process games in chunks of 10 to avoid rate limiting
    const chunks = chunkArray(allGames, 10);
    const processedGames = [];

    for (const chunk of chunks) {
      const promises = chunk.map(async (game) => {
        try {
          const detailsRes = await steamAPI.get(
            `https://store.steampowered.com/api/appdetails?appids=${game.appid}&key=${process.env.STEAM_API_KEY}`
          );

          const gameDetails = detailsRes.data[game.appid]?.data;
          if (!gameDetails) return null;

          return {
            appid: game.appid,
            name: gameDetails.name || "Unknown Title",
            description:
              gameDetails.short_description || "No description available",
            release_date: gameDetails.release_date?.date || "Unknown",
            price: gameDetails.price_overview?.final_formatted || "Free",
            platforms: gameDetails.platforms || {},
            genres: gameDetails.genres?.map((g) => g.description) || [
              "No genre",
            ],
            header_image: gameDetails.header_image || "/default-game-cover.jpg",
            background: gameDetails.background || "/default-game-cover.jpg",
            background_raw:
              gameDetails.background_raw || "/default-game-cover.jpg",
            capsule_image:
              gameDetails.capsule_image || "/default-game-cover.jpg",
            supported_languages: gameDetails.supported_languages || "Unknown",
            website: gameDetails.website || "No website available",
            about_the_game:
              gameDetails.about_the_game || "No details available",
            pc_requirements: gameDetails.pc_requirements || {},
            mac_requirements: gameDetails.mac_requirements || {},
          };
        } catch (err) {
          console.error(
            `Failed to fetch details for appid ${game.appid}:`,
            err.message
          );
          return null;
        }
      });

      const chunkResults = (await Promise.all(promises)).filter(Boolean);
      processedGames.push(...chunkResults);

      // Add delay between chunks to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Update cache
    gameCache.processedGames = processedGames;
    gameCache.lastFetched = Date.now();

    res.status(200).json(processedGames);
  } catch (err) {
    console.error("Error fetching games:", err.message);
    res
      .status(500)
      .json({ message: "Failed to fetch games", error: err.message });
  }
});

// updateCommunityGamesInDB();
// updateGamesInDB();
// updateSearchGamesInDB();


router.get("/home", async (req, res) => {
  try {
    const games = await HomeGame.find().sort({ lastUpdated: -1 });
    res.status(200).json(games);
  } catch (err) {
    console.error("Error fetching home games:", err.message);
    res
      .status(500)
      .json({ message: "Failed to fetch home games", error: err.message });
  }
});

// Search Steam for games matching query (raw data from Steam)
async function searchSteamRawGames(query, existingAppIds = new Set(), limit = 8) {
  const rawResults = [];
  const seenIds = new Set(existingAppIds);

  // 1. First try Steam Store Search API (instant results from Steam store)
  try {
    const storeRes = await axios.get(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`,
      {
        timeout: 4000,
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      }
    );
    const items = storeRes.data?.items || [];
    for (const item of items) {
      const id = Number(item.id);
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        rawResults.push({
          appid: id,
          name: item.name,
          header_image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/header.jpg`,
          capsule_image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/capsule_616x353.jpg`,
          portrait_image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/library_600x900.jpg`,
          hero_image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/library_hero.jpg`,
          publisher: "Steam Store",
          developer: "Steam",
          price: item.price?.final ? `$${(item.price.final / 100).toFixed(2)}` : "View details",
          genres: ["Steam Game"],
          release_date: "Steam",
          categories: [],
          movies: [],
          website: `https://store.steampowered.com/app/${id}`,
          isRaw: true,
        });
        if (rawResults.length >= limit) break;
      }
    }
  } catch (err) {
    console.warn("Steam Store search failed:", err.message);
  }

  // 2. If needed, also search in gameCache.rawGames if available
  if (rawResults.length < limit && gameCache.rawGames && gameCache.rawGames.length > 0) {
    const lowerQ = query.toLowerCase();
    for (const g of gameCache.rawGames) {
      if (g.name && g.name.toLowerCase().includes(lowerQ) && !seenIds.has(g.appid)) {
        seenIds.add(g.appid);
        rawResults.push({
          appid: g.appid,
          name: g.name,
          header_image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.appid}/header.jpg`,
          capsule_image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.appid}/capsule_616x353.jpg`,
          portrait_image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.appid}/library_600x900.jpg`,
          hero_image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.appid}/library_hero.jpg`,
          publisher: "Steam Store",
          developer: "Steam",
          price: "View details",
          genres: ["Steam Game"],
          release_date: "Steam",
          categories: [],
          movies: [],
          website: `https://store.steampowered.com/app/${g.appid}`,
          isRaw: true,
        });
        if (rawResults.length >= limit) break;
      }
    }
  }

  return rawResults;
}

router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  const limit = parseInt(req.query.limit) || 8; // Default to 8 if not specified

  if (!q) return res.status(200).json([]);

  try {
    // If numeric, search by appid first; otherwise use case-insensitive name match.
    const isNum = /^\d+$/.test(q);
    const filter = isNum
      ? { steam_appid: Number(q) }
      : { name: { $regex: q, $options: "i" } };

    // Use the limit parameter
    const docs = await SearchGames.find(filter)
      .limit(limit)
      .select(
        "steam_appid website name portrait_image hero_image categories release_date publishers developers price genres capsule_image header_image"
      )
      .lean();
      
    const results = docs.map((d) => ({
      appid: d.steam_appid,
      name: d.name,
      portrait_image: d.portrait_image || "/default-game-cover.jpg",
      hero_image : d.hero_image || "/default-game-cover.jpg",
      release_date: d.release_date || "Unknown",
      categories : d.categories || [],
      publisher: d.publishers?.[0]  || "Unknown",
      movies : d.movies || [],
      developer: d.developers?.[0]  || "Unknown",
      price: d.price || "Free",
      genres: d.genres?.map((g) => g) || ["No genre"],
      header_image: d.header_image || "/default-game-cover.jpg",
      capsule_image:
        d.capsule_image || d.header_image || "/default-game-cover.jpg",
      website: d.website || "No website available",
      isRaw: false,
    }));

    // If we have fewer results than the limit, also search Steam raw data so user can find games not yet in MongoDB
    if (results.length < limit) {
      const existingIds = new Set(results.map((r) => Number(r.appid)));
      const rawGames = await searchSteamRawGames(q, existingIds, limit - results.length);
      results.push(...rawGames);
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Search DB error:", err.message);
    res
      .status(500)
      .json({ message: "Search failed", error: err.message, games: [] });
  }
});

router.get("/search/by-genres", async (req, res) => {
  const genres = (req.query.genres || "").split(",").filter(Boolean);
  const limit = parseInt(req.query.limit) || 10;

  if (genres.length === 0) return res.status(200).json([]);

  try {
    // Create a case-insensitive regex for each genre
    const genreRegexes = genres.map((genre) => new RegExp(genre, "i"));

    // Find games that have at least one matching genre
    const docs = await SearchGames.find({
      genres: { $in: genreRegexes },
    })
      .limit(limit)
      .select("steam_appid website name portrait_image hero_image categories release_date publishers developers price genres capsule_image header_image")
      .lean();

    const results = docs.map((d) => ({
      appid: d.steam_appid,
      name: d.name,
      portrait_image: d.portrait_image || "/default-game-cover.jpg",
      hero_image : d.hero_image || "/default-game-cover.jpg",
      release_date: d.release_date || "Unknown",
      categories : d.categories || [],
      publisher: d.publishers?.[0] || d.publisher || "Unknown",
      movies : d.movies || [],
      developer: d.developers?.[0] || d.developer || "Unknown",
      price: d.price || "Free",
      genres: d.genres?.map((g) => g) || ["No genre"],
      header_image: d.header_image || "/default-game-cover.jpg",
      capsule_image:
        d.capsule_image || d.header_image || "/default-game-cover.jpg",
      website: d.website || "No website available",
    }));

    res.status(200).json(results);
  } catch (err) {
    console.error("Genre search DB error:", err.message);
    res
      .status(500)
      .json({ message: "Genre search failed", error: err.message, games: [] });
  }
});

 
router.get("/search/advanced" , async (req, res) => {
   const tags = (req.query.tags || "").split(",").filter(Boolean);
   const limit = parseInt(req.query.limit) || 20;

  if (tags.length === 0) return res.status(200).json([]);
   try {
    const allResults = [];
    
    // Har tag ke liye multiple searches
    for (const tag of tags) {
      // Search by name/title
      const nameResults = await SearchGames.find({
        name: { $regex: tag, $options: "i" }
      }).limit(10).lean();

      // Search by genre
      const genreResults = await SearchGames.find({
        genres: { $regex: tag, $options: "i" }
      }).limit(10).lean();

      // Search by publisher
      const publisherResults = await SearchGames.find({
        publishers: { $regex: tag, $options: "i" }
      }).limit(10).lean();

      // Combine with match type
      allResults.push(
        ...nameResults.map(g => ({...g, matchType: "Title Match", matchedTag: tag})),
        ...genreResults.map(g => ({...g, matchType: "Genre Match", matchedTag: tag})),
        ...publisherResults.map(g => ({...g, matchType: "Publisher Match", matchedTag: tag}))
      );
    }

    // Remove duplicates and sort by relevance
    const uniqueResults = [];
    const seenAppIds = new Set();

    allResults.forEach(game => {
      if (!seenAppIds.has(game.steam_appid)) {
        seenAppIds.add(game.steam_appid);
        
        // Count how many tags this game matches
        const tagMatches = tags.filter(tag => 
          game.name?.toLowerCase().includes(tag.toLowerCase()) ||
          game.genres?.some(genre => genre.toLowerCase().includes(tag.toLowerCase())) ||
          game.publishers?.some(pub => pub.toLowerCase().includes(tag.toLowerCase()))
        ).length;

        uniqueResults.push({
          ...game,
          relevanceScore: tagMatches,
          matchedTags: tags.filter(tag => 
            game.name?.toLowerCase().includes(tag.toLowerCase()) ||
            game.genres?.some(genre => genre.toLowerCase().includes(tag.toLowerCase())) ||
            game.publishers?.some(pub => pub.toLowerCase().includes(tag.toLowerCase()))
          )
        });
      }
    });

    // Sort by relevance (more tag matches = higher)
    uniqueResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    const finalResults = uniqueResults.slice(0, limit).map(d => ({
      appid: d.steam_appid,
      name: d.name,
      portrait_image: d.portrait_image || "/default-game-cover.jpg",
      hero_image: d.hero_image || "/default-game-cover.jpg",
      release_date: d.release_date || "Unknown",
      categories: d.categories || [],
      publisher: d.publishers?.[0] || "Unknown",
      developer: d.developers?.[0] || "Unknown",
      price: d.price || "Free",
      genres: d.genres || ["No genre"],
      header_image: d.header_image || "/default-game-cover.jpg",
      capsule_image: d.capsule_image || d.header_image || "/default-game-cover.jpg",
      website: d.website || "No website available",
      matchType: d.matchType,
      relevanceScore: d.relevanceScore,
      matchedTags: d.matchedTags
    }));

    res.status(200).json(finalResults);
  } catch (err) {
    console.error("Advanced search error:", err.message);
    res.status(500).json({ message: "Advanced search failed", error: err.message });
  }
});

//OLD - if needed
// router.get("/game/:appid", async (req, res) => {
//   const { appid } = req.params;

//   try {
//     const response = await steamAPI.get(
//       `https://store.steampowered.com/api/appdetails?appids=${appid}`
//     );

//     const gameDetails = response.data[appid]?.data;
//     if (!gameDetails) {
//       return res.status(404).json({ message: "Game details not found" });
//     }

//     res.status(200).json(gameDetails);
//   } catch (err) {
//     console.error(`❌ Error fetching details for appid ${appid}:`, err.message);
//     res.status(500).json({ message: "Failed to fetch game details" });
//   }
// });

router.get("/game/:appid", async (req, res) => {
  try {
    const appid = parseInt(req.params.appid, 10);
    if (isNaN(appid)) {
      return res.status(400).json({ message: "Invalid appid" });
    }

    let game = await SearchGames.findOne({ steam_appid: appid });

    // If game is not in DB yet, fetch full details from Steam and save to DB
    if (!game) {
      console.log(`[GET /game/:appid] Game ${appid} not found in DB. Fetching and importing to DB...`);
      game = await fetchAndSaveGameToDB(appid);
    }

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(game); // ✅ send full object
  } catch (err) {
    console.error("Error fetching game by appid:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Explicit endpoint to import a game by appid
router.post("/import/:appid", async (req, res) => {
  try {
    const appid = parseInt(req.params.appid, 10);
    if (isNaN(appid)) {
      return res.status(400).json({ message: "Invalid appid" });
    }

    let game = await SearchGames.findOne({ steam_appid: appid });
    if (!game) {
      console.log(`[POST /import/:appid] Importing game ${appid} to DB...`);
      game = await fetchAndSaveGameToDB(appid);
    }

    if (!game) {
      return res.status(404).json({ message: "Failed to import game from Steam" });
    }

    res.status(200).json({ success: true, message: "Game imported successfully", game });
  } catch (err) {
    console.error("Error importing game:", err.message);
    res.status(500).json({ message: "Import failed", error: err.message });
  }
});

// Helper to compute overall review stats for a game
async function getOverallRatingStats(appid) {
  const [stats, distribution] = await Promise.all([
    GameComment.aggregate([
      { $match: { steam_appid: appid } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]),
    GameComment.aggregate([
      { $match: { steam_appid: appid } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]),
  ]);

  const totalRatings = stats[0]?.total || 0;
  const averageRating = totalRatings > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  const distMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  distribution.forEach((item) => {
    if (item._id >= 1 && item._id <= 5) {
      distMap[item._id] = item.count;
    }
  });

  return { averageRating, totalRatings, distribution: distMap };
}

// ✅ GET /api/games/:appid/reviews - Overall rating and optional personal user review
router.get("/:appid/reviews", async (req, res) => {
  try {
    const appid = parseInt(req.params.appid, 10);
    if (isNaN(appid)) {
      return res.status(400).json({ message: "Invalid appid" });
    }

    const overall = await getOverallRatingStats(appid);

    // Optional user check from Bearer token
    let userReview = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (decoded?.id) {
          const found = await GameComment.findOne({
            user_id: decoded.id,
            steam_appid: appid,
          }).lean();
          if (found) {
            userReview = {
              _id: found._id,
              rating: found.rating,
              comment: found.comment,
              createdAt: found.createdAt,
              updatedAt: found.updatedAt,
            };
          }
        }
      } catch {
        // Token invalid or expired: gracefully ignore for public review view
      }
    }

    res.json({ overall, userReview });
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ POST /api/games/:appid/review - Upsert personal review and return updated stats
router.post("/:appid/review", verifyToken, async (req, res) => {
  try {
    const appid = parseInt(req.params.appid, 10);
    if (isNaN(appid)) {
      return res.status(400).json({ message: "Invalid appid" });
    }

    const rating = Number(req.body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5 stars" });
    }

    const comment = typeof req.body.review === "string"
      ? req.body.review.trim()
      : typeof req.body.comment === "string"
      ? req.body.comment.trim()
      : "";

    const user_id = req.user.id;

    const review = await GameComment.findOneAndUpdate(
      { user_id, steam_appid: appid },
      {
        rating,
        comment,
        is_edited: true,
        updatedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const overall = await getOverallRatingStats(appid);

    const io = req.app.get("io");
    if (io) {
      GameComment.findById(review._id)
        .populate("user_id", "name username profilePic")
        .lean()
        .then((populated) => {
          if (populated) {
            const u = populated.user_id || {};
            io.emit("newCommunityReview", {
              _id: populated._id,
              steam_appid: populated.steam_appid,
              rating: populated.rating,
              comment: populated.comment,
              likesCount: Array.isArray(populated.likes) ? populated.likes.length : 0,
              dislikesCount: Array.isArray(populated.dislikes) ? populated.dislikes.length : 0,
              score: populated.score || 0,
              createdAt: populated.createdAt,
              updatedAt: populated.updatedAt,
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
            });
          }
        })
        .catch(() => {});
    }

    res.json({
      message: "Review saved successfully",
      userReview: {
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      },
      overall,
    });
  } catch (err) {
    console.error("Error saving review:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ DELETE /api/games/:appid/review - Remove personal review
router.delete("/:appid/review", verifyToken, async (req, res) => {
  try {
    const appid = parseInt(req.params.appid, 10);
    if (isNaN(appid)) {
      return res.status(400).json({ message: "Invalid appid" });
    }

    await GameComment.findOneAndDelete({ user_id: req.user.id, steam_appid: appid });
    const overall = await getOverallRatingStats(appid);

    res.json({ message: "Review deleted successfully", overall });
  } catch (err) {
    console.error("Error deleting review:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

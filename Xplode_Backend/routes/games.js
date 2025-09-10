const express = require("express");
const router = express.Router();
const axios = require("axios");
const HomeGame = require("../models/HomeGames");
const { updateGamesInDB } = require("../scripts/updateHomeGames");
const { updateSearchGamesInDB } = require("../scripts/updateSearchGames");
const SearchGames = require("../models/SearchGames");
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
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
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

// updateSearchGamesInDB();

// updateGamesInDB();   //--------------> Use this if you want to update the database with new games

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

router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  const limit = parseInt(req.query.limit) || 7; // Default to 7 if not specified

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
    }));

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

    const game = await SearchGames.findOne({ steam_appid: appid });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(game); // ✅ send full object
  } catch (err) {
    console.error("Error fetching game by appid:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

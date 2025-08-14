const express = require("express");
const router = express.Router();
const axios = require("axios");
const HomeGame = require("../models/HomeGames");
const { updateGamesInDB } = require("../scripts/updateHomeGames");
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

router.get("/search", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  if (!gameCache.rawGames.length) {
    return res.status(500).json({ message: "Games data not loaded yet" });
  }

  // Use Set to ensure unique appids
  const seen = new Set();
  const filteredGames = gameCache.rawGames
    .filter((game) => {
      if (!game?.appid || seen.has(game.appid)) return false;
      seen.add(game.appid);
      return game?.name?.toLowerCase().includes(query);
    })
    .slice(0, 20);

  res.status(200).json(filteredGames);
});

router.get("/game/:appid", async (req, res) => {
  const { appid } = req.params;

  try {
    const response = await steamAPI.get(
      `https://store.steampowered.com/api/appdetails?appids=${appid}`
    );

    const gameDetails = response.data[appid]?.data;
    if (!gameDetails) {
      return res.status(404).json({ message: "Game details not found" });
    }

    res.status(200).json(gameDetails);
  } catch (err) {
    console.error(`❌ Error fetching details for appid ${appid}:`, err.message);
    res.status(500).json({ message: "Failed to fetch game details" });
  }
});

module.exports = router;

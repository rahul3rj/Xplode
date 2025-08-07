const HomeGame = require("../models/HomeGames");
const axios = require("axios");

const steamAppids = {
  trending: [
    { name: "Banana", appid: 2670630 },
    { name: "Goose Goose Duck", appid: 1568590 },
    { name: "BattleBit Remastered", appid: 671860 },
    { name: "Crab Game", appid: 1782210 },
    { name: "Only Up!", appid: 2448570 },
    { name: "Brotato", appid: 1942280 },
    { name: "The Finals", appid: 2073850 },
  ],
  top_games: [
    { name: "Counter-Strike 2", appid: 730 },
    { name: "Dota 2", appid: 570 },
    { name: "PUBG: BATTLEGROUNDS", appid: 578080 },
    { name: "Apex Legends", appid: 1172470 },
    { name: "Rust", appid: 252490 },
    { name: "NARAKA: BLADEPOINT", appid: 1203220 },
    { name: "Wallpaper Engine", appid: 431960 },
  ],
  top_records: [
    { name: "PUBG: BATTLEGROUNDS", appid: 578080 },
    { name: "Lost Ark", appid: 1599340 },
    { name: "Counter-Strike 2", appid: 730 },
    { name: "Dota 2", appid: 570 },
    { name: "Palworld", appid: 1623730 },
    { name: "Hogwarts Legacy", appid: 990080 },
    { name: "Elden Ring", appid: 1245620 },
  ]
};

async function fetchSteamDetails(appid) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=IN&l=english`;
  const { data } = await axios.get(url);
  const details = data[appid]?.data;
  return details;
}

async function fetchPortraitImage(appid) {
  // Example SteamGrid: https://images.steamgriddb.com/grid/<image_hash>.jpg
  // You may need to scrape or use SteamGrid API (requires key)
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`; // fallback style
}


async function updateGamesInDB() {
  for (const category in steamAppids) {
    const games = steamAppids[category];

    // 🧹 Step 1: Remove all old games in this category
    await HomeGame.deleteMany({ category });
    console.log(`🧹 Cleared old games in category: ${category}`);

    for (const game of games) {
      try {
        const gameDetails = await fetchSteamDetails(game.appid);
        if (!gameDetails || gameDetails.type !== "game") continue;

        const portraitImage = await fetchPortraitImage(game.appid);

        const gameDoc = {
          steam_appid: game.appid,
          name: gameDetails.name || "Unknown Title",
          description: gameDetails.short_description || "No description available",
          release_date: gameDetails.release_date?.date || "Unknown",
          price: gameDetails.price_overview?.final_formatted || "Free",
          platforms: gameDetails.platforms || {},
          genres: gameDetails.genres?.map(g => g.description) || ["No genre"],
          header_image: gameDetails.header_image || "/default-game-cover.jpg",
          capsule_image: gameDetails.capsule_image || "/default-game-cover.jpg",
          supported_languages: gameDetails.supported_languages || "Unknown",
          website: gameDetails.website || "No website available",
          about_the_game: gameDetails.about_the_game || "No details available",
          portrait_image: portraitImage,
          category,
          lastUpdated: new Date()
        };

        // No need for upsert now since we're deleting earlier
        await HomeGame.create(gameDoc);

        console.log(`✅ Inserted: ${gameDetails.name}`);
      } catch (err) {
        console.error(`❌ Error inserting ${game.name}:`, err.message);
      }
    }
  }
}

module.exports = {
  updateGamesInDB
};
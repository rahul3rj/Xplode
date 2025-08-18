const HomeGame = require("../models/HomeGames");
const axios = require("axios");

const steamAppids = {
  trending: [
    { appid: 3228590 },
    { appid: 2698780 },
    { appid: 2424010 },
    { appid: 1229240 },
    { appid: 2855560 },
    { appid: 1942280 },
    { appid: 2073850 },
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
  ],
};

async function fetchSteamDetails(appid) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=IN&l=english`;
  const { data } = await axios.get(url);
  const details = data[appid]?.data;
  return details;
}

// async function fetchPortraitImage(appid) {
//   try {
//     const res = await axios.get(
//       `https://www.steamgriddb.com/api/v2/grids/steam/${appid}?types=static`,
//       {
//         headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
//       }
//     );
//     if (res.data.success) {
//       // sirf url & thumb return karo
//       return res.data.data.map((img) => ({
//         url: img.url,
//         thumb: img.thumb,
//       }));
//     }
//     return [];
//   } catch (err) {
//     console.error(`Portrait fetch failed for ${appid}:`, err.message);
//     return [];
//   }
// }

async function getValidCapsuleImage(appid, headerImage) {
  if (!appid) return headerImage || "/default-game-cover.jpg";
  const url = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/capsule_616x353.jpg`;
  try {
    // HEAD request se check karo image exist karti hai ya nahi
    await axios.head(url);
    return url;
  } catch (err) {
    // Agar 404 ya koi error aaye toh headerImage return karo
    return headerImage || "/default-game-cover.jpg";
  }
}
function getPortrait(appid) {
  if (!appid) return "/default-game-cover.jpg";
  return `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/library_600x900.jpg`;
}

async function fetchHeroImage(appid) {
  try {
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/heroes/steam/${appid}?types=static`,
      {
        headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
      }
    );
    if (res.data.success) {
      return res.data.data.map((img) => ({
        url: img.url,
        thumb: img.thumb,
      }));
    }
    return [];
  } catch (err) {
    console.error(`Hero fetch failed for ${appid}:`, err.message);
    return [];
  }
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

        // const portraitImage = await fetchPortraitImage(game.appid);
        const heroImage = await fetchHeroImage(game.appid);
        const capsule_image = await getValidCapsuleImage(game.appid, gameDetails.header_image);

        const gameDoc = {
          steam_appid: game.appid,
          name: gameDetails.name || "Unknown Title",
          description:
            gameDetails.short_description || "No description available",
          release_date: gameDetails.release_date?.date || "Unknown",
          price: gameDetails.price_overview?.final_formatted || "Free",
          platforms: gameDetails.platforms || {},
          genres: gameDetails.genres?.map((g) => g.description) || ["No genre"],
          header_image: gameDetails.header_image || "/default-game-cover.jpg",
          background: gameDetails.background || "/default-game-cover.jpg",
          background_raw:
            gameDetails.background_raw || "/default-game-cover.jpg",
           capsule_image,
          supported_languages: gameDetails.supported_languages || "Unknown",
          website: gameDetails.website || "No website available",
          about_the_game: gameDetails.about_the_game || "No details available",
          portrait_image: getPortrait(game.appid), // ab array store ho raha
          hero_image: heroImage,
          category,
          lastUpdated: new Date(),
        };

        // No need for upsert now since we're deleting earlier
        await HomeGame.create(gameDoc);

        console.log(`✅ Inserted: ${gameDetails.name}`);
      } catch (err) {
        console.error(`❌ Error inserting ${gameDetails.name}:`, err.message);
      }
    }
  }
}

module.exports = {
  updateGamesInDB,
};

const CommunityGame = require("../models/CommunityGames");
const axios = require("axios");

const communityAppids = {
  community: [
    { appid: 1030300 }, // Hollow Knight: Silksong
    { appid: 2215430 }, // Ghost of Tsushima
    { appid: 1817190 }, // Marvel's Spider-Man 2
    { appid: 1174180 }, // Red Dead Redemption 2
    { appid: 1245620 }, // Elden Ring
    { appid: 1091500 }, // Cyberpunk 2077
    { appid: 1593500 }, // Battlefield 2042
    { appid: 271590 }   // Grand Theft Auto V
  ]
};

async function fetchSteamDetails(appid) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=IN&l=english`;
  try {
    const { data } = await axios.get(url);
    const details = data[appid]?.data;
    return details;
  } catch (err) {
    console.error(`Steam details fetch failed for ${appid}:`, err.message);
    return null;
  }
}

async function getLogo(appid) {
  try {
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/logos/steam/${appid}`,
      {
        headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
      }
    );
    if (res.data.success && res.data.data.length > 0) {
      return res.data.data[0].url;
    }
    return null;
  } catch (err) {
    console.error(`Logo fetch failed for ${appid}:`, err.message);
    return null;
  }
}

async function getHeroImage(appid) {
  try {
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/heroes/steam/${appid}`,
      {
        headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
      }
    );
    if (res.data.success && res.data.data.length > 0) {
      return res.data.data[0].url;
    }
    return null;
  } catch (err) {
    console.error(`Hero image fetch failed for ${appid}:`, err.message);
    return null;
  }
}

async function getGridImage(appid) {
  try {
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/grids/steam/${appid}`,
      {
        headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
      }
    );
    if (res.data.success && res.data.data.length > 0) {
      return res.data.data[0].url;
    }
    return null;
  } catch (err) {
    console.error(`Grid image fetch failed for ${appid}:`, err.message);
    return null;
  }
}

// Generate random stats for community section
function generateCommunityStats() {
  const plays = `${Math.floor(Math.random() * 900) + 100}k`;
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  const live = Math.floor(Math.random() * 50) + 5;
  
  return { plays, rating, live: live.toString() };
}

// Generate platforms based on Steam data
function getPlatforms(steamPlatforms) {
  const platforms = [];
  if (steamPlatforms?.windows) platforms.push("PC");
  if (steamPlatforms?.mac) platforms.push("Mac");
  if (steamPlatforms?.linux) platforms.push("Linux");
  
  // Add some console platforms randomly for variety
  const consolePlatforms = ["PlayStation 5", "Xbox Series X", "Nintendo Switch"];
  if (Math.random() > 0.5 && platforms.length < 3) {
    platforms.push(consolePlatforms[Math.floor(Math.random() * consolePlatforms.length)]);
  }
  
  return platforms.length > 0 ? platforms : ["PC", "PlayStation 5", "Xbox Series X"];
}

// Generate tags based on Steam genres
function getTags(genres) {
  const defaultTags = ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports", "Racing"];
  
  if (genres && genres.length > 0) {
    return genres.slice(0, 3).map(g => g.description);
  }
  
  // Return random tags if no genres available
  return defaultTags
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
}

async function updateCommunityGamesInDB() {
  for (const category in communityAppids) {
    const games = communityAppids[category];

    // 🧹 Step 1: Remove all old games in this category
    await CommunityGame.deleteMany({ category });
    console.log(`🧹 Cleared old games in category: ${category}`);

    for (const game of games) {
      try {
        const gameDetails = await fetchSteamDetails(game.appid);
        if (!gameDetails || gameDetails.type !== "game") {
          console.log(`⏭️ Skipping non-game appid: ${game.appid}`);
          continue;
        }

        // Fetch images from SteamGridDB
        const logo = await getLogo(game.appid);
        const heroImage = await getHeroImage(game.appid);
        const gridImage = await getGridImage(game.appid);

        // Generate community-specific data
        const stats = generateCommunityStats();
        const platforms = getPlatforms(gameDetails.platforms);
        const tags = getTags(gameDetails.genres);

        const communityGameDoc = {
          steam_appid: game.appid,
          title: gameDetails.name || "Unknown Title",
          logo: logo || gameDetails.header_image || "/default-logo.png",
          image: heroImage || gridImage || gameDetails.background || "/default-hero.jpg",
          description: gameDetails.short_description || "No description available",
          plays: stats.plays,
          rating: stats.rating,
          live: stats.live,
          tags: tags,
          platform: platforms,
          category,
          lastUpdated: new Date(),
        };

        await CommunityGame.create(communityGameDoc);
        console.log(`✅ Inserted community game: ${gameDetails.name}`);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (err) {
        console.error(`❌ Error inserting community appid ${game.appid}:`, err.message);
      }
    }
  }
  
  console.log("🎉 Community games update completed!");
}

module.exports = {
  updateCommunityGamesInDB,
};
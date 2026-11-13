const SearchGame = require("../models/SearchGames");
const axios = require("axios");

const rawList = `

238890	Skyward Collapse
238910	Bionic Dues
238930	7 Grand Steps, Step 1: What Ancients Begat
238960	Path of Exile
239030	Papers, Please
239070	Hammerwatch
239090	Samurai GUNN
239120	Final Fantasy III (3D Remake)
239140	Dying Light
239160	Thief
239200	Amnesia: A Machine for Pigs
239250	Castlevania: Lords of Shadow 2
]

`;

// parse into [{ appid: Number, name: String }]
const steamAppids = rawList
  .trim()
  .split(/\r?\n/)
  .map((line) => {
    const m = line.trim().match(/^(\d+)\s+(.+)$/);
    if (!m) return null;
    return { appid: Number(m[1]), name: m[2].trim() };
  })
  .filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Create axios instance with better defaults
const steamApi = axios.create({
  baseURL: "https://store.steampowered.com/api",
  timeout: 6000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

async function fetchSteamDetails(appid) {
  try {
    const { data } = await steamApi.get(
      `/appdetails?appids=${appid}&cc=IN&l=english`
    );
    return data[String(appid)]?.data || null;
  } catch (err) {
    console.warn(`Steam details fetch failed for ${appid}: ${err.message}`);
    return null;
  }
}

async function getValidCapsuleImage(appid, headerImage) {
  if (!appid) return headerImage || "/default-game-cover.jpg";
  const url = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/capsule_616x353.jpg`;
  try {
    await axios.head(url, { timeout: 5000 });
    return url;
  } catch (err) {
    return headerImage || "/default-game-cover.jpg";
  }
}

// function getPortrait(appid) {
//   if (!appid) return "/default-game-cover.jpg";
//   return `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/library_600x900.jpg`;
// }

async function fetchPortraitImage(appid) {
  try {
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/grids/steam/${appid}?types=static`,
      { 
        headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
        timeout: 5000,
      }
    );
    if (res.data && res.data.success) {
      return res.data.data.map((img) => ({ url: img.url, thumb: img.thumb }));
    }
    return [];
  } catch (err) {
    console.warn(`grid fetch failed for ${appid}: ${err.message}`);
    return [];
  }
}
async function fetchHeroImage(appid) {
  try {
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/heroes/steam/${appid}?types=static`,
      {
        headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
        timeout: 10000,
      }
    );
    if (res.data && res.data.success) {
      return res.data.data.map((img) => ({ url: img.url, thumb: img.thumb }));
    }
    return [];
  } catch (err) {
    console.warn(`Hero fetch failed for ${appid}: ${err.message}`);
    return [];
  }
}

async function updateSearchGamesInDB() {
  const totalGames = steamAppids.length;
  let processed = 0;
  let failed = 0;
  let skipped = 0;

  for (const game of steamAppids) {
    processed++;
    if (!game?.appid) {
      console.warn(
        `[${processed}/${totalGames}] Skipping entry without appid:`,
        game
      );
      skipped++;
      continue;
    }

    try {
      console.log(
        `[${processed}/${totalGames}] Processing: ${game.name} (${game.appid})`
      );

      let details = await fetchSteamDetails(game.appid);

      // Add delay between requests to avoid rate limiting
      await sleep(2000); // 2 seconds between requests

      if (!details) {
        console.warn(
          `[${processed}/${totalGames}] No details for ${game.appid}, skipping.`
        );
        skipped++;
        continue;
      }

      if (details.type !== "game") {
        console.warn(
          `[${processed}/${totalGames}] Not a game: ${game.appid}, skipping.`
        );
        skipped++;
        continue;
      }

      const heroImage = await fetchHeroImage(game.appid);
      const portraitImage = await fetchPortraitImage(game.appid);

      const capsule_image = await getValidCapsuleImage(
        game.appid,
        details.header_image
      );

      const screenshots = (details.screenshots || []).map((ss) => ({
        id: ss.id,
        url: ss.path_full || ss.path_thumbnail || null,
        path_thumbnail: ss.path_thumbnail || null,
      }));

      const gameDoc = {
        steam_appid: game.appid,
        name: details.name || game.name || "Unknown Title",

        // Basic
        description: details.short_description || "",
        release_date: details.release_date?.date || "",
        price: details.price_overview?.final_formatted || "Free",
        platforms: details.platforms || {},
        genres: details.genres?.map((g) => g.description) || [],

        // Media
        header_image: details.header_image || "/default-game-cover.jpg",
        background: details.background || "/default-game-cover.jpg",
        background_raw: details.background_raw || "/default-game-cover.jpg",
        capsule_image,
        portrait_image: portraitImage,
        hero_image: heroImage,
        screenshots,

        // Texts
        supported_languages: details.supported_languages || "",
        website: details.website || "",
        about_the_game: details.about_the_game || "",
        detailed_description: details.detailed_description || "",

        // Extra fields
        is_free: details.is_free || false,
        required_age: details.required_age || 0,
        controller_support: details.controller_support || "",

        developers: details.developers || [],
        publishers: details.publishers || [],

        price_overview: details.price_overview || {},
        recommendations: details.recommendations || {},
        achievements: details.achievements || {},
        ratings: details.ratings || {},
        support_info: details.support_info || {},
        content_descriptors: details.content_descriptors || {},
        categories: details.categories || [],
        movies: details.movies || [],
        dlc: details.dlc || [],
        packages: details.packages || [],
        package_groups: details.package_groups || [],
        type: details.type || "game",

        // Requirements
        pc_requirements: details.pc_requirements || {},
        mac_requirements: details.mac_requirements || [],
        linux_requirements: details.linux_requirements || [],

        // Misc
        lastUpdated: new Date(),
      };

      const res = await SearchGame.findOneAndUpdate(
        { steam_appid: game.appid },
        { $set: gameDoc },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`[${processed}/${totalGames}] ✅ Upserted: ${gameDoc.name}`);
    } catch (err) {
      console.error(
        `[${processed}/${totalGames}] ❌ Error processing appid ${game.appid}: ${err.message}`
      );
      failed++;

      // If it's a rate limit error, wait longer
      if (err.response?.status === 429) {
        console.log("Rate limited, waiting 30 seconds...");
        await sleep(5000);
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total games: ${totalGames}`);
  console.log(`Processed: ${processed}`);
  console.log(`Successful: ${processed - failed - skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);
}

module.exports = {
  updateSearchGamesInDB,
};

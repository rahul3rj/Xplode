const HomeGame = require("../models/HomeGames");
const axios = require("axios");

const steamAppids = {
  sliders: [
    { appid: 3595270, name: "Modern Warfare 3" },
    { appid: 1091500, name: "Cyberpunk 2077" },
    { appid: 1245620, name: "Elden Ring" },
    { appid: 2322010, name: "God of War Ragnarok" },
  ],
  trending: [
    { appid: 570 },
    { appid: 1172470 },
    { appid: 1203220 },
    { appid: 252490 },
    { appid: 578080 },
    { appid: 	2507950 },
    { appid: 730},
  ],
  top_games: [
    {  appid: 431960 },
    {  appid: 2622380 },
    {  appid: 2001120 },
    {  appid: 1203220 },
    {  appid: 3017860 },
    {  appid: 2246340 },
    {  appid: 3159330 },
  ],
  top_records: [
    {  appid: 271590 },
    {  appid: 1091500 },
    {  appid: 1593500},
    {  appid: 3595270 },
    {  appid: 814380 },
    {  appid: 990080 },
    {  appid: 1245620 },
  ],
};

async function fetchSteamDetails(appid) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=IN&l=english`;
  const { data } = await axios.get(url);
  const details = data[appid]?.data;
  return details;
}

async function getPortrait(appid) {
  try {
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/grids/steam/${appid}?types=static`,
      {
        headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
      }
    );
    if (res.data.success) {
      // sirf url & thumb return karo
      return res.data.data.map((img) => ({
        url: img.url,
        thumb: img.thumb,
      }));
    }
    return [];
  } catch (err) {
    console.error(`Portrait fetch failed for ${appid}:`, err.message);
    return [];
  }
}

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
// function getPortrait(appid) {
//   if (!appid) return "/default-game-cover.jpg";
//   return `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/library_600x900.jpg`;
// }

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
        const portraitImage = await getPortrait(game.appid);
        const capsule_image = await getValidCapsuleImage(
          game.appid,
          gameDetails.header_image
        );

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
          portrait_image: portraitImage, // ab array store ho raha
          hero_image: heroImage,
          screenshots: (gameDetails.screenshots || []).map((ss) => ({
            id: ss.id,
            path_thumbnail: ss.path_thumbnail,
          })),
          category,
          lastUpdated: new Date(),
        };

        // No need for upsert now since we're deleting earlier
        await HomeGame.create(gameDoc);

        console.log(`✅ Inserted: ${gameDetails.name}`);
      } catch (err) {
        console.error(`❌ Error inserting appid ${game.appid}:`, err.message);
      }
    }
  }
}

module.exports = {
  updateGamesInDB,
};

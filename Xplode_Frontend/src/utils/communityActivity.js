const KEY = "xplode-community-activity";

export function getCommunityActivity() {
  try { const value = JSON.parse(localStorage.getItem(KEY) || "{}"); return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }
  catch { return {}; }
}

export function recordCommunityActivity(game, type) {
  const id = game.steam_appid || game.appid || game.id;
  if (!id) return;
  try {
    const activity = getCommunityActivity();
    activity[String(id)] = { ...activity[String(id)], game: { steam_appid: id, name: game.name || game.title || "Game", portrait_image: game.portrait_image, header_image: game.header_image }, [type]: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(activity));
  } catch { /* Activity is optional and should never prevent navigation or launching. */ }
}

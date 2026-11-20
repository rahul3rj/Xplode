import { getCurrentUserId } from "./streamFavorites";

function getStorageKey() {
  const uid = getCurrentUserId();
  return uid ? `xplode-community-activity_${uid}` : "xplode-community-activity_guest";
}

// Clean up un-scoped legacy key
try {
  localStorage.removeItem("xplode-community-activity");
} catch {
  // Ignore
}

export function getCommunityActivity() {
  try {
    const key = getStorageKey();
    const value = JSON.parse(localStorage.getItem(key) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

export function recordCommunityActivity(game, type) {
  const id = game.steam_appid || game.appid || game.id;
  if (!id) return;
  try {
    const key = getStorageKey();
    const activity = getCommunityActivity();
    activity[String(id)] = {
      ...activity[String(id)],
      game: {
        steam_appid: id,
        name: game.name || game.title || "Game",
        portrait_image: game.portrait_image,
        header_image: game.header_image,
      },
      [type]: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(activity));
  } catch {
    /* Activity is optional and should never prevent navigation or launching. */
  }
}

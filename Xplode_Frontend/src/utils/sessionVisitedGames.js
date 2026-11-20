import { getCurrentUserId } from "./streamFavorites";

export const SESSION_VISITED_GAMES_CHANGED = "xplode_session_visited_games_changed";

function getStorageKey() {
  const uid = getCurrentUserId();
  return uid ? `xplode_session_visited_games_${uid}` : "xplode_session_visited_games_guest";
}

// Clean up old un-scoped legacy key from earlier versions
try {
  sessionStorage.removeItem("xplode_session_visited_games");
} catch {
  // Ignore
}

/**
 * Get all games visited in this browser session for the active user.
 */
export function getSessionVisitedGames() {
  try {
    const key = getStorageKey();
    const raw = sessionStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Add a game to the user-scoped session visited list.
 * Automatically deduplicates and caps at 25 entries.
 */
export function addSessionVisitedGame(game) {
  if (!game) return;
  const id = game.steam_appid || game.appid || game.id;
  if (!id) return;

  try {
    const key = getStorageKey();
    const current = getSessionVisitedGames();
    const normalized = {
      steam_appid: Number(id),
      name: game.name || game.title || `Game ${id}`,
      title: game.name || game.title || `Game ${id}`,
      portrait_image: game.portrait_image || game.capsule_image || game.header_image || null,
      hero_image: game.hero_image || game.background_raw || game.background || null,
      header_image: game.header_image || null,
      isVisited: true,
      visitedAt: Date.now(),
    };

    // Remove if already in list, then prepend to the top
    const filtered = current.filter((item) => Number(item.steam_appid) !== Number(id));
    const updated = [normalized, ...filtered].slice(0, 25);

    sessionStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(SESSION_VISITED_GAMES_CHANGED, { detail: { game: normalized } }));
  } catch {
    // Session storage may be restricted or full; silently fail
  }
}

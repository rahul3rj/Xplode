import axios from "./axios";

export const STREAM_FAVORITES_CHANGED = "xplode-stream-favorites-changed";

let cachedHomies = null;
let cachedUserId = null;
let fetchPromise = null;

// Extract current user ID from stored JWT token
export function getCurrentUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.id || parsed._id || null;
  } catch {
    return null;
  }
}

// Cleanup un-scoped legacy keys from earlier versions
function purgeLegacyStorage() {
  try {
    localStorage.removeItem("xplode_user_fav_homies");
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("xplode-stream-favorite-")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

// Run legacy purge on module load
purgeLegacyStorage();

// Clear the cache (called on logout or account switch)
export function clearFavoriteHomiesCache() {
  cachedHomies = null;
  cachedUserId = null;
  fetchPromise = null;
  purgeLegacyStorage();
  window.dispatchEvent(new CustomEvent(STREAM_FAVORITES_CHANGED, { detail: { homies: [] } }));
}

export function getStreamFavoriteKey(stream) {
  if (!stream) return "";
  return stream.id || `stream-${stream.platform || "youtube"}-${stream.channel || stream.videoId || ""}`;
}

// Check if a stream is in the logged-in user's favorites
export function isStreamFavorite(stream) {
  if (!stream) return false;
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return false;

  const id = stream.id;

  // Use memory cache if it belongs to current user
  if (cachedHomies && cachedUserId === currentUserId) {
    return cachedHomies.some(
      (h) => h.id === id || (stream.channel && h.channel === stream.channel) || (stream.videoId && h.videoId === stream.videoId)
    );
  }

  // Fallback to user-scoped localStorage cache
  try {
    const raw = localStorage.getItem(`xplode_fav_homies_${currentUserId}`);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        cachedHomies = list;
        cachedUserId = currentUserId;
        return list.some(
          (h) => h.id === id || (stream.channel && h.channel === stream.channel) || (stream.videoId && h.videoId === stream.videoId)
        );
      }
    }
  } catch { /* ignore */ }

  return false;
}

// Fetch favorite homies from the server for the current authenticated user
export async function getFavoriteHomies(force = false) {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) {
    cachedHomies = [];
    cachedUserId = null;
    return [];
  }

  // Invalidate cache if it belonged to a previous user
  if (cachedUserId !== currentUserId) {
    cachedHomies = null;
    cachedUserId = null;
    force = true;
  }

  if (!force && cachedHomies) {
    return cachedHomies;
  }
  if (!force && fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = axios
    .get("/profile/homies")
    .then(({ data }) => {
      cachedHomies = Array.isArray(data) ? data : [];
      cachedUserId = currentUserId;
      try {
        localStorage.setItem(`xplode_fav_homies_${currentUserId}`, JSON.stringify(cachedHomies));
      } catch { /* ignore */ }
      window.dispatchEvent(new CustomEvent(STREAM_FAVORITES_CHANGED, { detail: { homies: cachedHomies } }));
      return cachedHomies;
    })
    .catch((err) => {
      console.warn("Could not fetch user favorite homies:", err?.message);
      if (!cachedHomies || cachedUserId !== currentUserId) {
        cachedHomies = [];
        cachedUserId = currentUserId;
      }
      return cachedHomies;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

// Toggle a favorite homie on the current user's profile
export async function toggleStreamFavorite(stream) {
  if (!stream) return false;
  const currentUserId = getCurrentUserId();
  if (!currentUserId) throw new Error("Must be logged in to favorite a homie");

  const payload = {
    id: stream.id || `${stream.platform || "youtube"}-${stream.channel || stream.videoId}`,
    creator: stream.creator || stream.name || "Creator",
    platform: stream.platform || "youtube",
    avatarUrl: stream.avatarUrl || "",
    channel: stream.channel || "",
    videoId: stream.videoId || "",
    game: stream.game || "",
    title: stream.title || "",
  };

  try {
    const { data } = await axios.post("/profile/homies/toggle", payload);
    cachedHomies = Array.isArray(data.favHomies) ? data.favHomies : [];
    cachedUserId = currentUserId;
    try {
      localStorage.setItem(`xplode_fav_homies_${currentUserId}`, JSON.stringify(cachedHomies));
    } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent(STREAM_FAVORITES_CHANGED, { detail: { homies: cachedHomies } }));
    return data.isFavorite;
  } catch (err) {
    console.error("Failed to toggle favorite homie:", err);
    throw err;
  }
}

// Backward compatibility helper
export function setStreamFavorite(stream) {
  toggleStreamFavorite(stream).catch(() => {});
}

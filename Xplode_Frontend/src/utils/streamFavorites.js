export const STREAM_FAVORITES_CHANGED = "xplode-stream-favorites-changed";

export function getStreamFavoriteKey(stream) {
  return `xplode-stream-favorite-${stream.platform || "youtube"}-${stream.channel || stream.videoId || stream.id}`;
}

export function isStreamFavorite(stream) {
  try { return localStorage.getItem(getStreamFavoriteKey(stream)) === "true"; }
  catch { return false; }
}

export function setStreamFavorite(stream, value) {
  localStorage.setItem(getStreamFavoriteKey(stream), String(value));
  window.dispatchEvent(new Event(STREAM_FAVORITES_CHANGED));
}

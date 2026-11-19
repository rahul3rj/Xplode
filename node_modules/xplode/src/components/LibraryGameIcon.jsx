import { useEffect, useRef, useState } from "react";
import axios from "../utils/axios";
import { libraryArtwork } from "../utils/libraryArtwork";

const iconRequests = new Map();
const imageUrl = (value) => {
  if (Array.isArray(value)) return imageUrl(value[0]);
  if (typeof value === "string") return /^https?:\/\//i.test(value) || value.startsWith("/") ? value : "";
  return value?.url || value?.thumb || "";
};
const gameIcon = (game) => {
  const direct = [game.icons, game.icon, game.icon_image, game.icon_url].map(imageUrl).find(Boolean);
  if (direct) return direct;
  const hash = game.img_icon_url;
  if (typeof hash !== "string" || !hash) return "";
  return imageUrl(hash) || (/^[a-f0-9]+$/i.test(hash) && game.steam_appid ? `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${game.steam_appid}/${hash}.jpg` : "");
};

export default function LibraryGameIcon({ game }) {
  const container = useRef(null);
  const [visible, setVisible] = useState(false);
  const [remoteIcon, setRemoteIcon] = useState("");
  const [sourceIndex, setSourceIndex] = useState(0);
  const id = game.steam_appid || game.appid;
  const knownIcon = gameIcon(game);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { root: element.closest(".library-panel-list"), rootMargin: "100px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !id || knownIcon) return;
    let active = true;
    const key = String(id);
    if (!iconRequests.has(key)) {
      const request = axios.get(`/games/game/${encodeURIComponent(id)}`).then(({ data }) => gameIcon({ ...data, steam_appid: data?.steam_appid || id })).catch(() => { iconRequests.delete(key); return ""; });
      iconRequests.set(key, request);
    }
    iconRequests.get(key).then((icon) => { if (active && icon) { setRemoteIcon(icon); setSourceIndex(0); } });
    return () => { active = false; };
  }, [id, knownIcon, visible]);

  const sources = [...new Set([knownIcon || remoteIcon, ...libraryArtwork(game)].filter(Boolean))];
  return <span className="library-list-icon-frame" ref={container}>{sources[sourceIndex] ? <img className="library-list-cover" src={sources[sourceIndex]} alt="" onError={() => setSourceIndex((index) => index + 1)} /> : <span className="library-list-icon-fallback" aria-hidden="true">{(game.name || "?").charAt(0)}</span>}</span>;
}

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, Trash2, X } from "lucide-react";
import LibGames from "../components/LibGames";
import LibraryGameIcon from "../components/LibraryGameIcon";
import LibDetails from "./LibDetails";
import LoadingIndicator from "../components/LoadingIndicator";
import axios from "../utils/axios";
import { storePortraitArtwork } from "../utils/libraryArtwork";
import { getUserLibrary, removeFromLibrary, getUserFavorite, removeFromFavorite } from "../utils/addToLibrary";
import "./library.css";

const filters = [
  { id: "all", label: "All games" },
  { id: "installed", label: "Installed" },
  { id: "favorite", label: "Favorites" },
];

export default function Library() {
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(null);
  const [recentId, setRecentId] = useState(null);
  const [userGames, setUserGames] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [storeGames, setStoreGames] = useState([]);

  useEffect(() => {
    let active = true;
    axios.get("/games/home").then(({ data }) => { if (active && Array.isArray(data)) setStoreGames(data); }).catch((err) => console.error("Failed to load store artwork:", err));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([getUserLibrary(), getUserFavorite()]).then(([games, favorites]) => {
      if (!active) return;
      setUserGames(Array.isArray(games) ? games : []);
      setUserFavorites(Array.isArray(favorites) ? favorites : []);
    }).catch((err) => {
      console.error("Failed to fetch library:", err);
      if (active) setError(err?.message || "Failed to load your library.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const filter = new URLSearchParams(location.search).get("filter");
    if (filter === "wishlist" || filter === "favorites" || filter === "favorite") setActiveFilter("favorite");
    else if (filter === "installed") setActiveFilter("installed");
    else setActiveFilter("all");
  }, [location.search]);

  const combinedGames = useMemo(() => {
    const combined = new Map();
    userFavorites.forEach((game) => combined.set(String(game.steam_appid), { ...game, _isFavorite: true, _isLibrary: false }));
    userGames.forEach((game) => {
      const key = String(game.steam_appid);
      const previous = combined.get(key);
      combined.set(key, { ...previous, ...game, _isLibrary: true, _isFavorite: !!previous?._isFavorite });
    });
    return [...combined.values()];
  }, [userGames, userFavorites]);

  const storeArtworkById = useMemo(() => {
    const categories = ["trending", "New_Releases", "top_games", "top_records", "Online_Multiplayer_Games", "RPG_Games", "Try_these_also"];
    const artwork = new Map();
    categories.forEach((category) => storeGames.forEach((game) => {
      const id = game.steam_appid || game.appid || game.id;
      if (id && game.category?.trim() === category && !artwork.has(String(id))) artwork.set(String(id), storePortraitArtwork(game));
    }));
    return artwork;
  }, [storeGames]);

  const filteredGames = combinedGames.filter((game) => {
    if (activeFilter === "installed" && !game.verified) return false;
    if (activeFilter === "favorite" && !game._isFavorite) return false;
    return (game.name || "").toLowerCase().includes(searchTerm.trim().toLowerCase());
  }).map((game) => ({ ...game, _storePortraitSources: storeArtworkById.get(String(game.steam_appid)) || [] }));
  const selectedGame = combinedGames.find((game) => String(game.steam_appid) === String(selectedId));

  const selectGame = (id) => { setSelectedId(id); setRecentId(id); };
  const handleVerified = (id) => {
    const update = (games) => games.map((game) => String(game.steam_appid) === String(id) ? { ...game, verified: true } : game);
    setUserGames(update);
    setUserFavorites(update);
  };
  const handleDeleteGame = async (id) => {
    const inLibrary = userGames.some((game) => String(game.steam_appid) === String(id));
    const inFavorite = userFavorites.some((game) => String(game.steam_appid) === String(id));
    if (!inLibrary && !inFavorite) return;
    if (!window.confirm(`Are you sure you want to remove this game from your ${inLibrary ? "library" : "favorites"}?`)) return;
    try {
      if (inLibrary) {
        await removeFromLibrary(id);
        setUserGames((previous) => previous.filter((game) => String(game.steam_appid) !== String(id)));
      } else {
        await removeFromFavorite(id);
        setUserFavorites((previous) => previous.filter((game) => String(game.steam_appid) !== String(id)));
      }
      if (String(selectedId) === String(id)) setSelectedId(null);
    } catch (err) {
      console.error("Failed to remove game:", err);
      window.alert(err?.message || "Failed to remove game.");
    }
  };

  return (
    <main className="library-page">
      <div className="library-layout">
        <section className="library-main" aria-labelledby="library-title">
          <div className="library-section-heading"><div className="library-history" aria-label="Library navigation">
            <button type="button" onClick={() => setSelectedId(null)} disabled={selectedId === null} aria-label="Back to library"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => recentId !== null && selectGame(recentId)} disabled={recentId === null || String(selectedId) === String(recentId) || !combinedGames.some((game) => String(game.steam_appid) === String(recentId))} aria-label="Return to last game"><ChevronRight size={18} /></button>
          </div><h1 id="library-title">Library {selectedId === null && <span>{filteredGames.length}</span>}</h1><div className="library-section-line" /></div>
          <div key={selectedId === null ? "grid" : selectedId} className="library-main-scroll" tabIndex={0} aria-label={selectedId === null ? "Library games" : "Game details"}>
          {loading ? <div className="library-empty"><LoadingIndicator label="Loading your library" /></div> : error ? <div className="library-empty" role="alert"><p>{error}</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div> : selectedId !== null && selectedGame ? <div className="library-details"><LibDetails key={selectedGame.steam_appid} game={selectedGame} onVerified={handleVerified} /></div> : filteredGames.length ? <LibGames games={filteredGames} onSelect={selectGame} /> : <div className="library-empty"><h3>{searchTerm ? "No games found" : activeFilter === "favorite" ? "No favorites yet" : activeFilter === "installed" ? "No installed games" : "Your library is empty"}</h3><p>{searchTerm ? "Try a different search term." : activeFilter === "all" ? "Explore the store and add games to your collection." : "Games in this filter will appear here."}</p>{!searchTerm && activeFilter === "all" && <Link to="/store">Explore the store</Link>}</div>}
          </div>
        </section>
        <aside className="library-panel" aria-label="Game list">
          <div className="library-panel-header"><h2>Game list <span>{filteredGames.length}</span></h2></div>
          <div className="library-toolbar">
            <div className="library-filters" aria-label="Filter games">
              {filters.map((filter) => <button key={filter.id} type="button" className={activeFilter === filter.id ? "is-active" : ""} aria-pressed={activeFilter === filter.id} onClick={() => { setActiveFilter(filter.id); setSelectedId(null); }}>{filter.label}</button>)}
            </div>
          </div>
          <div className="library-search"><Search size={17} aria-hidden="true" /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search your games" aria-label="Search your games" />{searchTerm && <button type="button" onClick={() => setSearchTerm("")} aria-label="Clear search"><X size={16} /></button>}</div>
          <div className="library-panel-list">
            {filteredGames.map((game) => <div key={game.steam_appid} className={`library-list-item${String(selectedId) === String(game.steam_appid) ? " is-selected" : ""}`}>
              <button type="button" className="library-list-select" onClick={() => String(selectedId) === String(game.steam_appid) ? setSelectedId(null) : selectGame(game.steam_appid)} aria-label={`Open ${game.name}`} aria-pressed={String(selectedId) === String(game.steam_appid)}><LibraryGameIcon key={game.steam_appid} game={game} /><span>{game.name}</span></button>
              <button type="button" className="library-remove" onClick={() => handleDeleteGame(game.steam_appid)} aria-label={`Remove ${game.name} from ${game._isLibrary ? "library" : "favorites"}`}><Trash2 size={16} /></button>
            </div>)}
            {!loading && !error && !filteredGames.length && <p className="library-panel-empty">{searchTerm ? "No matching games." : "No games to show."}</p>}
          </div>
        </aside>
      </div>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, Search, X } from "lucide-react";
import axios from "../utils/axios";
import GameResult from "../components/GameResult";
import LoadingIndicator from "../components/LoadingIndicator";
import "./search.css";

const PER_PAGE = 10;
const gameId = (game) => String(game.steam_appid || game.appid || "");
const names = (items) => Array.isArray(items) ? items.map((item) => typeof item === "string" ? item : item?.name || item?.description).filter(Boolean) : [];

function FilterGroup({ title, entries, onSelect }) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  return <section className="search-filter-group"><button className="search-filter-heading" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>{title}<ChevronDown size={17} className={open ? "is-open" : ""} /></button>
    {open && <div className="search-filter-options">{entries.slice(0, expanded ? entries.length : 4).map(([name, count]) => <button type="button" key={name} onClick={() => onSelect(name)}><span>{name}</span><span>{count}</span></button>)}{!entries.length && <p>No {title.toLowerCase()} available</p>}{entries.length > 4 && <button type="button" className="search-filter-more" onClick={() => setExpanded(!expanded)}>{expanded ? "Show less" : "Show more"}</button>}</div>}
  </section>;
}

export default function SearchResults({ query }) {
  const location = useLocation();
  const [tags, setTags] = useState(() => location.state?.initialTags || []);
  const [input, setInput] = useState("");
  const [games, setGames] = useState([]);
  const [exact, setExact] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTags(location.state?.initialTags || []);
  }, [location.key, location.state]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setPage(1); setError("");
      if (!query && !tags.length) { setGames([]); setExact([]); setLoading(false); return; }
      setLoading(true);
      try {
        if (tags.length) {
          const response = await axios.get("/games/search/advanced", { params: { tags: tags.join(","), limit: 30 } });
          if (active) { setGames(Array.isArray(response.data) ? response.data : []); setExact([]); }
        } else {
          const response = await axios.get("/games/search", { params: { q: query } });
          const matches = (Array.isArray(response.data) ? response.data : []).map((game) => ({ ...game, matchType: "Exact match" }));
          let related = [];
          const genres = [...new Set(matches.flatMap((game) => names(game.genres)))].slice(0, 3);
          if (genres.length) {
            try {
              const response = await axios.get("/games/search/by-genres", { params: { genres: genres.join(","), limit: 20 } });
              related = (Array.isArray(response.data) ? response.data : []).filter((game) => !matches.some((match) => gameId(match) === gameId(game))).map((game) => ({ ...game, matchType: "Related" }));
            } catch (err) { console.error("Failed to fetch related games:", err); }
          }
          if (active) { setExact(matches); setGames([...matches, ...related]); }
        }
      } catch (err) { console.error("Search failed:", err); if (active) { setGames([]); setExact([]); setError("Could not load search results. Please try again."); } }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [query, tags]);

  const counts = useMemo(() => {
    const source = tags.length ? games : exact;
    const genreCounts = new Map(); const publisherCounts = new Map();
    source.forEach((game) => {
      names(game.genres).forEach((name) => genreCounts.set(name, (genreCounts.get(name) || 0) + 1));
      const publishers = names(game.publishers);
      (publishers.length ? publishers : [game.developer].filter((value) => typeof value === "string" && value)).forEach((name) => publisherCounts.set(name, (publisherCounts.get(name) || 0) + 1));
    });
    const sorted = (map) => [...map.entries()].sort((a, b) => b[1] - a[1]);
    return { genres: sorted(genreCounts), publishers: sorted(publisherCounts) };
  }, [games, exact, tags]);
  const totalPages = Math.ceil(games.length / PER_PAGE);
  const addTag = (value) => { const tag = value.trim(); if (tag && !tags.includes(tag)) setTags((current) => [...current, tag]); setInput(""); };
  const changePage = (next) => { setPage(next); document.querySelector(".search-page-scroll")?.scrollTo({ top: 0, behavior: "smooth" }); };

  return <div className="search-results-layout">
    <main className="search-results-main"><header className="search-results-header"><div><h1>{tags.length ? "Filtered games" : "Search results"}</h1><p>{tags.length ? tags.join(", ") : query ? `Results for “${query}”` : "Search for a game to get started."}</p></div>{!loading && games.length > 0 && <span>{games.length} {games.length === 1 ? "game" : "games"}</span>}</header>
      {loading ? <div className="search-status"><LoadingIndicator label="Loading games" /></div> : error ? <div className="search-status" role="alert">{error}</div> : games.length ? <><div className="search-game-list">{games.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((game, index) => <GameResult key={`${gameId(game)}-${index}`} game={game} />)}</div>{totalPages > 1 && <nav className="search-pagination" aria-label="Search results pages"><button type="button" disabled={page === 1} onClick={() => changePage(page - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => changePage(page + 1)}>Next</button></nav>}</> : <div className="search-status">{query || tags.length ? "No games found. Try a different search or filter." : ""}</div>}
    </main>
    <aside className="search-filters" aria-label="Search filters"><h2>Filters</h2><form className="search-filter-input" onSubmit={(event) => { event.preventDefault(); addTag(input); }}><input aria-label="Filter by genre or publisher" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Genre, publisher, platform..." /><button type="submit" aria-label="Add filter"><Search size={18} /></button></form><div className="search-active-tags">{tags.map((tag) => <button key={tag} type="button" onClick={() => setTags((current) => current.filter((value) => value !== tag))} aria-label={`Remove ${tag} filter`}>{tag}<X size={14} /></button>)}{tags.length > 0 && <button type="button" className="search-clear-tags" onClick={() => setTags([])}>Clear all</button>}</div><FilterGroup title="Genre" entries={counts.genres} onSelect={(name) => setTags([name])} /><FilterGroup title="Publisher" entries={counts.publishers} onSelect={(name) => setTags([name])} /></aside>
  </div>;
}

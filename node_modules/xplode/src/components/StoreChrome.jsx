import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Heart, Search, X } from "lucide-react";
import Notification from "./Notification";
import LoadingIndicator from "./LoadingIndicator";
import { useSearch } from "../lib/SearchContext";
import { useSocket } from "../contexts/SocketContext";
import "../pages/store.css";

export default function StoreChrome({ user }) {
  const { query, setQuery, filteredGames, isLoading } = useSearch();
  const { unreadConversationsCount } = useSocket() || {};
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const keepHeaderVisible = pathname === "/community" || pathname.startsWith("/community/") || pathname === "/settings" || pathname.startsWith("/settings/");
  useEffect(() => {
    const onOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) setSearchFocused(false);
      if (!notificationRef.current?.contains(event.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);
  useEffect(() => {
    if (!showNotifications) return;
    const onEscape = (event) => { if (event.key === "Escape") setShowNotifications(false); };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [showNotifications]);
  useEffect(() => {
    if (keepHeaderVisible) {
      setHeaderHidden(false);
      setIsScrolled(false);
      return;
    }
    const previousPositions = new WeakMap();
    const onScroll = (event) => {
      const scrollArea = event.target === document ? document.scrollingElement : event.target;
      if (!(scrollArea instanceof HTMLElement) || headerRef.current?.contains(scrollArea) || scrollArea.classList.contains("library-panel-list") || scrollArea.classList.contains("library-main-scroll")) return;
      if (scrollArea.scrollHeight - scrollArea.clientHeight < 16) return;
      const position = Math.max(0, scrollArea.scrollTop);
      const previousPosition = previousPositions.get(scrollArea) ?? 0;
      if (position === previousPosition) return;
      setIsScrolled(position > 64);
      if (position <= 16) {
        setHeaderHidden(false);
        previousPositions.set(scrollArea, position);
      } else if (Math.abs(position - previousPosition) >= 8) {
        setHeaderHidden(position > previousPosition);
        previousPositions.set(scrollArea, position);
      }
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, true);
  }, [keepHeaderVisible]);
  return <>
    <header ref={headerRef} className={`store-header${headerHidden && !keepHeaderVisible ? " store-header--hidden" : ""}${isScrolled && !keepHeaderVisible ? " store-header--scrolled" : ""}`}>
      <Link to="/store" className="store-brand" aria-label="Xplode store"><img src="/New%20Assets/LOGO.svg" alt="Xplode" /></Link>
      <div className="store-search" ref={searchRef}>
        <form className="store-search-form" onSubmit={(event) => { event.preventDefault(); if (query.trim()) { setSearchFocused(false); navigate(`/search?q=${encodeURIComponent(query.trim())}`); } }}>
          <Search className="store-search-icon" size={16} aria-hidden="true" />
          <input aria-label="Search games" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setSearchFocused(true)} onKeyDown={(event) => { if (event.key === "Escape") setSearchFocused(false); }} placeholder="Search games" />
          {query && <button className="store-search-clear" type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}
        </form>
        {searchFocused && query.trim() && <div className="store-search-results">
          {isLoading ? <div className="store-search-loading"><LoadingIndicator label="Searching games" small /></div> : filteredGames.length ? filteredGames.slice(0, 6).map((game, index) => <Link key={game.appid || game.steam_appid || index} to={`/game/${game.appid || game.steam_appid}`} onClick={() => setSearchFocused(false)}>{game.header_image && <img src={game.header_image} alt="" />}<span>{game.name}</span></Link>) : <p>No games found</p>}
        </div>}
      </div>
      <div className="store-header-actions">
        <Link className="store-download" to="/launcher"><img src="/New%20Assets/LOGO%20Download.svg" alt="" /> <span>Download</span></Link>
        <Link className="store-round-button" to="/library?filter=wishlist" aria-label="Wishlist"><Heart fill="currentColor" strokeWidth={2.5} /></Link>
        <div className="store-notification-wrap" ref={notificationRef}>
          <button className="store-round-button store-notification" style={{ position: "relative" }} onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications" aria-expanded={showNotifications}>
            <Bell fill="currentColor" strokeWidth={2.5} />
            {!!unreadConversationsCount && (
              <span style={{ position: "absolute", top: "-4px", right: "-4px", minWidth: "18px", height: "18px", padding: "0 4px", background: "linear-gradient(135deg, #ef4444, #ec4899)", color: "#fff", fontSize: "10px", fontWeight: "bold", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #000" }}>
                {unreadConversationsCount > 9 ? "9+" : unreadConversationsCount}
              </span>
            )}
          </button>
          {showNotifications && <Notification onClose={() => setShowNotifications(false)} />}
        </div>
        <Link to="/profile" className="store-avatar" aria-label="Profile"><img src={user?.profilePic || "/defaultprofile.jpg"} alt="" /></Link>
      </div>
    </header>
  </>;
}

import { Link, useLocation } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";
import "./SideNav.css";

const links = [
  { path: "/store", label: "Store", icon: "Home.svg" },
  { path: "/library", label: "Library", icon: "Library.svg" },
  { path: "/chat", label: "Chat" },
  { path: "/community/home", label: "Community", icon: "Trigger.svg" },
  { path: "/settings", label: "Settings", icon: "Settings.svg" },
];

export default function SideNav() {
  const { pathname } = useLocation();
  const { unreadConversationsCount } = useSocket() || {};
  const isStorePage = pathname === "/home" || pathname === "/search" || pathname.startsWith("/game/");

  return (
    <nav className="store-side-nav" aria-label="Main navigation">
      {links.map(({ path, label, icon }) => {
        const active = path === "/store" ? pathname === path || isStorePage : path === "/community/home" ? pathname === "/community" || pathname.startsWith("/community/") : pathname === path || pathname.startsWith(`${path}/`);
        return (
          <Link key={path} to={path} title={label} aria-label={label} aria-current={active ? "page" : undefined} className={active ? "active" : ""} style={{ position: "relative" }}>
            {icon ? <img src={`/New%20Assets/${icon}`} alt="" /> : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 5.84 2 10.58c0 2.31 1.1 4.41 2.9 5.96L4.1 21l4.64-2.1c1.02.28 2.12.43 3.26.43 5.52 0 10-3.85 10-8.59S17.52 2 12 2Z" /><circle cx="8" cy="10.7" r="1" fill="#000" /><circle cx="12" cy="10.7" r="1" fill="#000" /><circle cx="16" cy="10.7" r="1" fill="#000" /></svg>}
            {label === "Chat" && !!unreadConversationsCount && (
              <span style={{ position: "absolute", top: "4px", right: "4px", minWidth: "16px", height: "16px", padding: "0 3px", background: "linear-gradient(135deg, #ef4444, #ec4899)", color: "#fff", fontSize: "9px", fontWeight: "bold", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #000" }}>
                {unreadConversationsCount > 9 ? "9+" : unreadConversationsCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

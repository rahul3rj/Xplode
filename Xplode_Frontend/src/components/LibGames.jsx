import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { libraryArtwork } from "../utils/libraryArtwork";
import ArtworkImage from "./ArtworkImage";

export function LibraryCover({ game, className = "" }) {
  const [imageIndex, setImageIndex] = useState(0);
  const sources = libraryArtwork(game);
  const source = sources[imageIndex];
  if (!source) return <span className={`library-cover-fallback ${className}`}>{game.name}</span>;
  return <ArtworkImage className={className} src={source} alt="" loading="lazy" onError={() => setImageIndex((current) => current + 1)} />;
}

export default function LibGames({ games, onSelect }) {
  if (!games.length) return null;
  return (
    <div className="library-grid">
      {games.map((game) => (
        <button key={game.steam_appid} type="button" className="library-game-card" onClick={() => onSelect(game.steam_appid)} aria-label={`Open ${game.name}${game.verified ? ", installed" : ""}`}>
          <LibraryCover key={`glow-${(game._storePortraitSources || []).join("|")}`} game={game} className="library-game-glow" />
          <span className="library-game-art">
            <LibraryCover key={`image-${(game._storePortraitSources || []).join("|")}`} game={game} className="library-game-image" />
            <span className="library-game-shine" aria-hidden="true" />
            {game.verified && <span className="library-installed-icon" aria-hidden="true"><CheckCheck size={14} strokeWidth={2} /></span>}
          </span>
        </button>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { StoreHero, StoreDrawer, WishlistShowcase } from "../components/StoreShowcase";
import StoreFooter from "../components/StoreFooter";
import LoadingIndicator from "../components/LoadingIndicator";
import "./store.css";

const sections = [
  ["trending", "Trending Games"],
  ["New_Releases", "New Release"],
  ["top_games", "Top Games"],
  ["top_records", "Top Records"],
  ["Online_Multiplayer_Games", "Online Multiplayer Games"],
  ["RPG_Games", "RPG Games"],
  ["Try_these_also", "Try these also"],
];

export default function Store() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    axios.get("/games/home").then((response) => {
      if (active) setGames(Array.isArray(response.data) ? response.data : []);
    }).catch((err) => {
      console.error("Failed to fetch games:", err);
      if (active) setError(true);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const sliderGames = games.filter((game) => game.category === "sliders");
  const hasModernWarfare4 = sliderGames.some((game) => Number(game.steam_appid) === 4435490);
  const hasPhantomBladeZero = sliderGames.some((game) => Number(game.steam_appid) === 4115450);
  const hasPragmata = sliderGames.some((game) => Number(game.steam_appid) === 3357650);
  const featured = sliderGames.filter((game) => {
    const id = Number(game.steam_appid);
    return !(hasModernWarfare4 && id === 3595270) && !(hasPhantomBladeZero && id === 2322010) && !(hasPragmata && id === 1091500);
  });
  const wishlistGames = [4115450, 4435490, 3357650, 2358720]
    .map((id) => games.find((game) => Number(game.steam_appid) === id && game.category === "sliders")
      || games.find((game) => Number(game.steam_appid) === id))
    .filter(Boolean);
  return <main className="store-page">
    {loading ? <div className="store-loading"><LoadingIndicator label="Loading store" /></div> : error ? <p className="store-message" role="alert">Could not load the store. Please try again.</p> : <>
      <StoreHero games={featured} />
      <div className="store-content">
        {sections.map(([category, title], index) => <div key={category}>
          {index === 2 && <WishlistShowcase games={wishlistGames} />}
          <StoreDrawer title={title} games={games.filter((game) => game.category?.trim() === category)} />
        </div>)}
        {!games.length && <p className="store-message">No games are available right now.</p>}
        <StoreFooter />
      </div>
    </>}
  </main>;
}

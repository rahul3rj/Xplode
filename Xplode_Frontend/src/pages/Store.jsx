import React, { useEffect, useState } from "react";
import GameSlider from "../components/Slider";
import GameList from "../components/GameList";
import Category from "../components/Category";
import axios from "../utils/axios";
import CommunitySection from "../components/CommunitySection";
import Footer from "../components/Footer";
import GameList2 from "../components/GameList2";

// New category titles matching backend
const GameListTitle = ["Trending Games", "Top Games", "Top Records"];

const Store = () => {
  const [games, setGames] = useState([]);

  const fetchGames = async () => {
    try {
      const response = await axios.get("/games/home"); // assuming it's a GET now
      setGames(response.data);
    } catch (err) {
      console.error("Failed to fetch games:", err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);
  const sliderGames = games.filter((game) => game.category === "sliders");
  const trendingGames = games.filter((game) => game.category === "trending");
  const topGames = games.filter((game) => game.category === "top_games");
  const newReleases = games.filter((game) => game.category === "New_Releases");
  const Online_Multiplayer_Games = games.filter(
    (game) => game.category === "Online_Multiplayer_Games"
  );
  const RPG_Games = games.filter((game) => game.category === "RPG_Games");
  const Try_these_also = games.filter(
    (game) => game.category === " Try_these_also"
  );
  const topRecordGames = games.filter(
    (game) => game.category === "top_records"
  );

  return (
    <>
      <div className="absolute h-screen w-full z-30 overflow-y-auto hide-scrollbar">
        <img
          src="../bg.svg"
          alt=""
          className="fixed inset-0 w-full h-full object-cover pointer-events-none select-none saturate-140 -z-10"
          style={{ zIndex: -10 }}
        />
        <div className="h-[88vh] w-[90vw]  ml-[10vw] gap-5 absolute top-[12svh] overflow-y-auto hide-scrollbar">
          {sliderGames.length > 0 && <GameSlider games={sliderGames} />}

          {trendingGames.length > 0 && (
            <GameList
              games={trendingGames}
              title={GameListTitle[0]}
              nextClass="game-list-swiper-next-0"
              prevClass="game-list-swiper-prev-0"
            />
          )}

          <Category />

          {topGames.length > 0 && (
            <GameList
              games={topGames}
              title={GameListTitle[1]}
              nextClass="game-list-swiper-next-1"
              prevClass="game-list-swiper-prev-1"
            />
          )}

          <CommunitySection />

          {topRecordGames.length > 0 && (
            <GameList
              games={topRecordGames}
              title={GameListTitle[2]}
              nextClass="game-list-swiper-next-2"
              prevClass="game-list-swiper-prev-2"
            />
          )}
          {newReleases.length > 0 && (
            <GameList2
              games={newReleases}
              title="New Releases"
              nextClass="game-list-swiper-next-3"
              prevClass="game-list-swiper-prev-3"
            />
          )}

          {Online_Multiplayer_Games.length > 0 && (
            <GameList
              games={Online_Multiplayer_Games}
              title="Online Multiplayer Games"
              nextClass="game-list-swiper-next-4"
              prevClass="game-list-swiper-prev-4"
            />
          )}
          
          {RPG_Games.length > 0 && (
            <GameList
              games={RPG_Games}
              title="RPG Games"
              nextClass="game-list-swiper-next-5"
              prevClass="game-list-swiper-prev-5"
            />
          )}
          {Try_these_also.length > 0 && (
            <GameList
              games={Try_these_also}
              title=" Try these also"
              nextClass="game-list-swiper-next-6"
              prevClass="game-list-swiper-prev-6"
            />
          )}

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Store;

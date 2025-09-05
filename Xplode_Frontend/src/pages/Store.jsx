import React, { useEffect, useState } from "react";
import GameSlider from "../components/Slider";
import GameList from "../components/GameList";
import Category from "../components/Category";
import axios from "../utils/axios";
import CommunitySection from "../components/CommunitySection";
import Footer from "../components/Footer";

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
  const topRecordGames = games.filter((game) => game.category === "top_records");

  return (
    <>
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

      <Footer />
    </>
  );
};

export default Store;

import React, { useEffect, useState } from "react";
import GameSlider from "../components/Slider";
import GameList from "../components/GameList";
import Category from "../components/Category";
import axios from "../utils/axios";
import CommunitySection from "../components/CommunitySection";
import Footer from "../components/Footer";

const GameListTitle = ["Special Offers", "Popular Games", "New Releases", "Coming Soon"];

const Store = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState([]);

  const isValidURL = (url) => {
    return typeof url === "string" && url.startsWith("http");
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/games/home`);
      const allGames = response.data;

      // Only use games that have both portraitUrl and header_image
      const validGames = allGames.filter(
        (game) => isValidURL(game.header_image) && isValidURL(game.portraitUrl)
      );

      const shuffled = shuffleArray(validGames);
      setGames(shuffled.slice(0, 40)); // Max 40 games for safety
    } catch (err) {
      console.error("Failed to fetch games:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <>
      <GameSlider />

      <GameList
        games={games.slice(0, 7)}
        title={GameListTitle[0]}
        nextClass="game-list-swiper-next-0"
        prevClass="game-list-swiper-prev-0"
      />

      <Category />

      <GameList
        games={games.slice(7, 14)}
        title={GameListTitle[1]}
        nextClass="game-list-swiper-next-1"
        prevClass="game-list-swiper-prev-1"
      />

      <CommunitySection />

      <GameList
        games={games.slice(14, 21)}
        title={GameListTitle[2]}
        nextClass="game-list-swiper-next-2"
        prevClass="game-list-swiper-prev-2"
      />

      <GameList
        games={games.slice(21, 28)}
        title={GameListTitle[3]}
        nextClass="game-list-swiper-next-3"
        prevClass="game-list-swiper-prev-3"
      />

      <Footer />
    </>
  );
};

export default Store;

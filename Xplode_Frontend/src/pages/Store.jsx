import React from "react";
import GameSlider from "../components/Slider";
import GameList from "../components/GameList";
import Category from "../components/Category";
import CommunitySection from "../components/CommunitySection";
import Footer from "../components/Footer";

const GameListTitle = ["Special Offers", "Popular Games", "New Releases", "Coming Soon"]

const Store = () => {
  return (
    <>
      <div className="">
        <GameSlider />
        <GameList title={GameListTitle[0]} nextClass="game-list-swiper-next-0" prevClass="game-list-swiper-prev-0" />
        <Category />
        <GameList title={GameListTitle[1]} nextClass="game-list-swiper-next-1" prevClass="game-list-swiper-prev-1" />
        <CommunitySection />
        <GameList title={GameListTitle[2]} nextClass="game-list-swiper-next-2" prevClass="game-list-swiper-prev-2" />
        <GameList title={GameListTitle[3]} nextClass="game-list-swiper-next-3" prevClass="game-list-swiper-prev-3" />
        <Footer />
      </div>
    </>
  );
};

export default Store;

import React, { useState, useRef, useMemo } from "react";
import GameCard from "./GameCard";

const GameBanner = ({ games }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(0);
  const hoverTimeout = useRef(null);

  const handleMouseEnter = (idx) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setActiveIndex(idx);
      setLastActiveIndex(idx);
    }, 150); // 200ms delay, adjust as needed
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setActiveIndex(lastActiveIndex);
  };
  const getRandomImage = (arr) => {
    if (!arr || arr.length === 0) return "/default-game-cover.jpg";
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex].thumb;
  };

  return (
    <div className="h-[38svh] w-[87vw] flex gap-4 ">
      {games.map((game, idx) => {
        const portraitThumb = useMemo(
          () => getRandomImage(game?.portrait_image),
          [game?.portrait_image]
        );

        const heroThumb = useMemo(() => {
          if (game?.hero_image?.length > 0) {
            return getRandomImage(game.hero_image);
          }
          return game?.header_image || "/default-game-cover.jpg";
        }, [game?.hero_image, game?.header_image]);
        return (
          <div
            key={idx}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <GameCard
              image={portraitThumb}
              bg={heroThumb}
              title={game.title}
              isActive={activeIndex === idx}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GameBanner;

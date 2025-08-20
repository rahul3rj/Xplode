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
    }, 200); // 200ms delay, adjust as needed
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
    <div className="h-[47svh] w-[87vw] flex gap-3 ">
      {games.map((game, idx) => {
        
        return (
          <div
            key={idx}
            onMouseEnter={() => handleMouseEnter(idx)} 
            onMouseLeave={handleMouseLeave}
          >
            <GameCard
              image={game.portrait_image[0]}
              bg={game.capsule_image ||game.header_image}
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

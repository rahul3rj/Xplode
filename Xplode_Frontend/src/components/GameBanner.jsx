import React, { useState, useRef } from 'react';
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

  return (
    <div className='h-[38svh] w-[87vw] flex gap-4 '>
      {games.map((game, idx) => (
        <div
          key={idx}
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={handleMouseLeave}
        >
          <GameCard image={game.portrait_image} bg={game.background_raw} title={game.title} isActive={activeIndex === idx} />
        </div>
      ))}
    </div>
  );
};

export default GameBanner;
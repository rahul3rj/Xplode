import React, { useEffect, useState } from "react";
import ColorThief from "colorthief";


function GameList2Card({ game }) {
  const [colorPalette, setColorPalette] = useState(null);

  useEffect(() => {
    let mounted = true;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.id}/header.jpg`;

    img.onload = () => {
      try {
        const ct = new ColorThief();
        const p = ct.getPalette(img, 5);
        const sorted = [...p].sort((a, b) => {
          const brightnessA = (a[0] * 299 + a[1] * 587 + a[2] * 114) / 1000;
          const brightnessB = (b[0] * 299 + b[1] * 587 + b[2] * 114) / 1000;
          return brightnessB - brightnessA;
        });
        if (mounted) setColorPalette(sorted);
      } catch (e) {
        if (mounted) setColorPalette(null);
      }
    };
    img.onerror = () => mounted && setColorPalette(null);

    return () => {
      mounted = false;
    };
  }, [`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.id}/header.jpg`]);

  const gradientBackground = colorPalette
    ? `linear-gradient(to bottom, 
          rgba(54, 20, 65, 0.4)
      )`
    : "linear-gradient(to bottom, rgba(69, 40, 10, 0.3), rgba(69, 40, 10, 0.1))";

  const bgcircle = colorPalette
    ? `linear-gradient(to bottom, 
          rgba(${colorPalette[3][0]}, ${colorPalette[3][1]}, ${colorPalette[3][2]}, 0.8)
      )`
    : "linear-gradient(to bottom, rgba(69, 40, 10, 0.3), rgba(69, 40, 10, 0.7))";

  return (
    <div className="w-full h-full flex flex-col justify-start items-center rounded-lg overflow-hidden relative group cursor-pointer" onClick= { ()=> window.location.href = `/game/${game.id}`}>
      <div
        className="absolute h-[40vh] w-[50vh] bottom-7 -z-20 rounded-full blur-[52px]"
        style={{ background: bgcircle }}
      />
      <div className="h-[55%] absolute top-0 left-0 overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-[100%] h-[100%] object-cover group-hover:scale-105 transition-all duration-400 ease-in-out"
        />
      </div>
      <div
        className="h-[45%] w-full absolute bottom-0 flex flex-col justify-between items-start p-5"
        style={{ background: gradientBackground, backdropFilter: "blur(52px)" }}
      >
        <div className="w-full">
          <h1 className="w-full text-white text-lg font-[gilroy-bold] mb-2 truncate">
            {game.name}
          </h1>
          <h2 className="text-white/40 text-xs font-[gilroy] transition-all duration-600">
            {game.publisher}
          </h2>
        </div>
        <div className="w-full flex flex-row justify-start items-center gap-2 truncate">
          {(game.genres || []).map((tag, tagIdx) => (
            <h2
              key={tagIdx}
              className="text-white text-[10px] font-[gilroy] cursor-pointer px-4 py-1 rounded-full transition-all duration-600"
              style={{
                background: bgcircle.replace("0.8", "0.3"),
              }}
            >
              {tag}
            </h2>
          ))}
        </div>
        {/* <h2 className="absolute px-4 right-5 top-4 w-auto h-8 text-white text-xs font-[gilroy] bg-[#A641FF]/50 hover:bg-[#A641FF]/70 transition-all duration-200 rounded-full flex items-center justify-center cursor-pointer shadow-[0px_4px_30.600000381469727px_0px_rgba(0,0,0,0.25)] backdrop-blur-xs">
        Add to Library
          <i className="ri-add-line text-white"></i>
        </h2> */}
      </div>
    </div>
  );
}

export default GameList2Card;
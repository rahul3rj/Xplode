import React, { useState, useRef, useEffect } from "react";
import LibGames from "../components/LibGames";
import LibDetails from "./LibDetails";

const Library = () => {
  const [gameList, setGameList] = useState(null);
  const games = [
    {
      id: 1,
      title: "Assassin’s Creed Shadows",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/3159330/library_600x900.jpg",
      appId: "3159330",
    },
    {
      id: 2,
      title: "Black Myth: Wukong",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/library_600x900.jpg",
      appId: "2358720",
    },
    {
      id: 3,
      title: "Call of Duty: Modern Warfare II",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/library_600x900.jpg",
      appId: "1938090",
    },
    {
      id: 4,
      title: "Counter-Strike 2",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/730/library_600x900.jpg",
      appId: "730",
    },
    {
      id: 5,
      title: "Cyberpunk 2077",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg",
      appId: "1091500",
    },
    {
      id: 6,
      title: "Dark Souls III",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/library_600x900.jpg",
      appId: "374320",
    },
    {
      id: 7,
      title: "Elden Ring",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg",
      appId: "1245620",
    },
    {
      id: 8,
      title: "Forza Horizon 5",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/library_600x900.jpg",
      appId: "1551360",
    },
    {
      id: 9,
      title: "Ghost of Tsushima DIRECTOR'S CUT",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/library_600x900.jpg",
      appId: "2215430",
    },
    {
      id: 10,
      title: "God of War",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/library_600x900.jpg",
      appId: "1593500",
    },
    {
      id: 11,
      title: "Grand Theft Auto V",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900.jpg",
      appId: "271590",
    },
    {
      id: 12,
      title: "Red Dead Redemption 2",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg",
      appId: "1174180",
    },
    {
      id: 13,
      title: "Split Fiction",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/2001120/library_600x900.jpg",
      appId: "2001120",
    },
    {
      id: 14,
      title: "Stray",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/library_600x900.jpg",
      appId: "1332010",
    },
    {
      id: 15,
      title: "Terraria",
      image:
        "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/library_600x900.jpg",
      appId: "105600",
    },
  ];
  const historyRef = useRef([]);

  useEffect(() => {
    if (gameList && !historyRef.current.includes(gameList)) {
     historyRef.current.push(gameList);
   }
  }, [gameList]);

  return (
    <div className="h-auto w-full flex justify-center items-center gap-5">
      <div className="h-[85vh] w-[70%] ">
        <div className="h-[6vh] w-full flex justify-start items-center px-5">
          <div className="h-[6vh] w-[14vh] flex items-center justify-center gap-2">
            <div
              className="h-[6vh] w-[6vh] flex items-center justify-center rounded-full bg-transparent hover:bg-[#8800FF]/20 cursor-pointer"
              onClick={() => setGameList(null)}
            >
              <i className="ri-arrow-left-s-line text-white text-xl"></i>
            </div>
            <div
              className="h-[6vh] w-[6vh] flex items-center justify-center rounded-full bg-transparent hover:bg-[#8800FF]/20 cursor-pointer"
              onClick={() => {
                if (historyRef.current.length > 0) {
                  const lastGame = historyRef.current.pop();
                  setGameList(lastGame);
                }
              }}
            >
              <i className="ri-arrow-right-s-line text-white text-xl"></i>
            </div>
          </div>
          <div className="h-[6vh] w-[20vw] flex items-center justify-between ">
            <div className="h-[6vh] w-auto flex items-center justify-center px-10">
              <h3 className="text-white text-sm font-[gilroy-bold]">Library</h3>
            </div>
            <div className="h-[6vh] w-auto flex items-center justify-center px-10">
              <h3 className="text-white text-sm font-[gilroy-bold]">
                Whishlist
              </h3>
            </div>
          </div>
          <button className="h-[6vh] w-[10vw] flex items-center justify-center rounded-md bg-[#8800FF]/20 hover:bg-[#8800FF]/40 cursor-pointer gap-2 ml-10">
            <i className="ri-add-line text-[#A641FF] text-xl"></i>
            <h3 className="text-[#A641FF] text-sm font-[gilroy-bold]">
              Add Game
            </h3>
          </button>
        </div>
        <div
          className={`h-[5vh] w-full flex justify-between items-center transition-opacity duration-300 ${
            gameList !== null ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <h3 className="text-white text-sm font-[gilroy-bold] pl-10">
            Installed Games
          </h3>
          <p className="text-[#696969] text-sm font-[gilroy] px-2">(15)</p>
          <i className="ri-arrow-down-s-line text-[#696969] text-xl cursor-pointer"></i>
          <div className="h-[0.5px] w-[78%] bg-[#696969]"></div>
        </div>

        <div className="h-[74vh] w-full overflow-y-auto hide-scrollbar">
          {gameList === null ? (
            <LibGames games={games} onSelect={setGameList} />
          ) : (
            <LibDetails
              game={games.find((g) => g.id === gameList)}
              onClose={() => setGameList(null)}
            />
          )}
        </div>
      </div>
      <div className="h-[85vh] w-[25vw] mr-7 pt-10">
        <div className="h-full w-full bg-[#8800FF]/20 rounded-lg">
          <div className="h-[10vh] w-full flex justify-center items-center px-5">
            <input
              type="text"
              placeholder="Search by name"
              className="h-[6vh] w-full px-5 rounded-sm text-sm font-[gilroy-bold] bg-[#250740] placeholder-[#A641FF] z-10 outline-none text-white relative"
            />
            <i className="ri-search-line text-[#A641FF] text-xl absolute right-15 z-10"></i>
          </div>
          <div className="h-[69vh] w-full flex flex-col justify-start items-start px-5 overflow-y-auto hide-scrollbar">
            <h3 className="text-[#A641FF] text-sm font-[gilroy-bold] py-2">
              All games
            </h3>
            {games.map((g) => (
              <div
                className={`h-[7vh] w-full flex justify-between items-center cursor-pointer rounded-md mb-2 transition-colors
                ${
                  gameList === g.id
                    ? "bg-[#A641FF]/30"
                    : "hover:bg-[#A641FF]/10"
                }`}
                onClick={() =>
                  setGameList((prev) => (prev === g.id ? null : g.id))
                }
              >
                <div className="h-[6vh] w-[80%] flex justify-start items-center gap-5 px-5">
                  <div className="h-[5vh] w-[5vh] objject-cover rounded-full overflow-hidden flex justify-center items-center ">
                    <img src={g.image} alt="" />
                  </div>
                  <h3 className="text-white text-xs font-[gilroy-bold] truncate">
                    {g.title}
                  </h3>
                </div>
                <i className="ri-play-fill text-white hover:text-[#A641FF] text-xl px-3 py-1"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;

import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import LibGames from "../components/LibGames";
import LibDetails from "./LibDetails";
import { getUserLibrary, removeFromLibrary } from "../utils/addToLibrary";

const Library = () => {
  const location = useLocation(); // Get the current location
  const [gameList, setGameList] = useState(null);
  const [userGames, setUserGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // Added filter state
  const historyRef = useRef([]);
  // const games = [
  //   {
  //     id: 1,
  //     title: "Assassin’s Creed Shadows",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/3159330/library_600x900.jpg",
  //     appId: "3159330",
  //   },
  //   {
  //     id: 2,
  //     title: "Black Myth: Wukong",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/2358720/library_600x900.jpg",
  //     appId: "2358720",
  //   },
  //   {
  //     id: 3,
  //     title: "Call of Duty: Modern Warfare II",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/library_600x900.jpg",
  //     appId: "1938090",
  //   },
  //   {
  //     id: 4,
  //     title: "Counter-Strike 2",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/730/library_600x900.jpg",
  //     appId: "730",
  //   },
  //   {
  //     id: 5,
  //     title: "Cyberpunk 2077",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg",
  //     appId: "1091500",
  //   },
  //   {
  //     id: 6,
  //     title: "Dark Souls III",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/library_600x900.jpg",
  //     appId: "374320",
  //   },
  //   {
  //     id: 7,
  //     title: "Elden Ring",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg",
  //     appId: "1245620",
  //   },
  //   {
  //     id: 8,
  //     title: "Forza Horizon 5",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/library_600x900.jpg",
  //     appId: "1551360",
  //   },
  //   {
  //     id: 9,
  //     title: "Ghost of Tsushima DIRECTOR'S CUT",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/library_600x900.jpg",
  //     appId: "2215430",
  //   },
  //   {
  //     id: 10,
  //     title: "God of War",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/library_600x900.jpg",
  //     appId: "1593500",
  //   },
  //   {
  //     id: 11,
  //     title: "Grand Theft Auto V",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_600x900.jpg",
  //     appId: "271590",
  //   },
  //   {
  //     id: 12,
  //     title: "Red Dead Redemption 2",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg",
  //     appId: "1174180",
  //   },
  //   {
  //     id: 13,
  //     title: "Split Fiction",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/2001120/library_600x900.jpg",
  //     appId: "2001120",
  //   },
  //   {
  //     id: 14,
  //     title: "Stray",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/1332010/library_600x900.jpg",
  //     appId: "1332010",
  //   },
  //   {
  //     id: 15,
  //     title: "Terraria",
  //     image:
  //       "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/library_600x900.jpg",
  //     appId: "105600",
  //   },
  // ];

  const filteredGames = userGames
    .filter((game) => {
      console.log("Filtering game:", game); // Debugging log
      if (activeFilter === "all") return true; // Show all games
      if (activeFilter === "installed") return game.verified; // Show only verified games
      if (activeFilter === "wishlist") return !game.verified; // Show only unverified games
      return true;
    })
    .filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
      console.log("Game matches search:", game.name, matchesSearch); // Debugging log
      return matchesSearch;
    });

  console.log("Filtered games:", filteredGames); // Debugging log

  const handleDeleteGame = async (steamAppId, e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Are you sure you want to remove this game from your library?"
      )
    ) {
      return;
    }

    try {
      await removeFromLibrary(steamAppId);

      // UI update
      setUserGames((prev) =>
        prev.filter((game) => game.steam_appid !== steamAppId)
      );

      // Close details if open
      if (gameList === steamAppId) {
        setGameList(null);
      }

      // Toast message ya koi better feedback (optional)
      console.log("Game removed successfully!");
    } catch (error) {
      console.error("Failed to remove game:", error);
      alert(error.message || "Failed to remove game from library");
    }
  };
  useEffect(() => {
    const fetchUserLibrary = async () => {
      try {
        const games = await getUserLibrary();
        console.log("Fetched user library:", games);
        setUserGames(games);
      } catch (err) {
        console.error("Failed to fetch user library:", err);
        setError(err.message || "Failed to load your library");
      } finally {
        setLoading(false);
      }
    };

    fetchUserLibrary();
  }, []);

  useEffect(() => {
    if (gameList && !historyRef.current.includes(gameList)) {
      historyRef.current.push(gameList);
    }
  }, [gameList]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get("filter");
    if (filter) {
      setActiveFilter(filter); // Set the active filter based on the query parameter
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="h-[85vh] w-[90vw] mt-[12svh] ml-[10vw] flex justify-center items-center gap-5">
        <img src="../Preloader.svg" alt="loading" className="h-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[85vh] w-full flex flex-col items-center justify-center gap-3">
        <p className="text-white/80">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#A641FF] rounded text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="absolute h-screen w-full z-30 overflow-y-auto hide-scrollbar">
      <img
        src="../bg.svg"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none select-none saturate-140 -z-10"
        style={{ zIndex: -10 }}
      />
      <div className="h-[85vh] w-[90vw] mt-[12svh] ml-[10.5vw] flex justify-center items-center gap-5">
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
            <div className="h-[6vh] w-[30vw] flex items-center justify-between ml-5">
              <div
                className={`h-[6vh] w-auto flex items-center justify-center px-10 rounded-md cursor-pointer transition-colors ${
                  activeFilter === "all"
                    ? "bg-[#8800FF]/40"
                    : "bg-transparent hover:bg-[#8800FF]/20"
                }`}
                onClick={() => setActiveFilter("all")}
              >
                <h3 className="text-white text-sm font-[gilroy-bold]">
                  All Games
                </h3>
              </div>
              <div
                className={`h-[6vh] w-auto flex items-center justify-center px-10 rounded-md cursor-pointer transition-colors ${
                  activeFilter === "installed"
                    ? "bg-[#8800FF]/40"
                    : "bg-transparent hover:bg-[#8800FF]/20"
                }`}
                onClick={() => setActiveFilter("installed")}
              >
                <h3 className="text-white text-sm font-[gilroy-bold]">
                  Installed
                </h3>
              </div>
              <button
                className={`h-[6vh] w-[10vw] flex items-center justify-center rounded-md cursor-pointer transition-colors ${
                  activeFilter === "wishlist"
                    ? "bg-[#8800FF]/40"
                    : "bg-transparent hover:bg-[#8800FF]/20"
                }`}
                onClick={() => setActiveFilter("wishlist")}
              >
                <h3 className="text-white text-sm font-[gilroy-bold]">
                  Wishlist
                </h3>
              </button>
            </div>
          </div>
          <div
            className={`h-[5vh] w-full flex justify-between items-center transition-opacity duration-300 ${
              gameList !== null
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
          >
            <h3 className="text-white text-sm font-[gilroy-bold] pl-10">
              My Games
            </h3>
            <p className="text-[#696969] text-sm font-[gilroy] px-2">
              ({filteredGames.length}) {/* ✅ Filtered count show karo */}
            </p>
            <i className="ri-arrow-down-s-line text-[#696969] text-xl cursor-pointer"></i>
            <div className="h-[0.5px] w-[78%] bg-[#696969]"></div>
          </div>

          <div className="h-[74vh] w-full overflow-y-auto hide-scrollbar">
            {gameList === null ? (
              <LibGames games={filteredGames} onSelect={setGameList} />
            ) : (
              <LibDetails
                game={userGames.find((g) => g.steam_appid === gameList)}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name"
                className="h-[6vh] w-full px-5 rounded-sm text-sm font-[gilroy-bold] bg-[#250740] placeholder-[#A641FF] z-10 outline-none text-white relative"
              />
              <i className="ri-search-line text-[#A641FF] text-xl absolute right-15 z-10"></i>
            </div>
            <div className="h-[69vh] w-full flex flex-col justify-start items-start px-5 overflow-y-auto hide-scrollbar">
              <h3 className="text-[#A641FF] text-sm font-[gilroy-bold] py-2">
                All games {searchTerm && `- Searching: "${searchTerm}"`}
              </h3>
              {filteredGames.map((g) => (
                <div
                  className={`h-[7vh] w-full flex justify-between items-center cursor-pointer rounded-md mb-2 transition-colors
                ${
                  gameList === g.steam_appid
                    ? "bg-[#A641FF]/30"
                    : "hover:bg-[#A641FF]/10"
                }`}
                  onClick={() =>
                    setGameList((prev) =>
                      prev === g.steam_appid ? null : g.steam_appid
                    )
                  }
                >
                  <div className="h-[6vh] w-[80%] flex justify-start items-center gap-5 px-5">
                    <div className="h-[5vh] w-[5vh]  rounded-full overflow-hidden flex justify-center items-center ">
                      <img
                        className="w-full h-full object-cover"
                        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${g.steam_appid}/library_600x900.jpg`}
                        alt=""
                      />
                    </div>
                    <h3 className="text-white text-xs font-[gilroy-bold] truncate">
                      {g.name}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      console.log(g.steam_appid);
                      handleDeleteGame(g.steam_appid, e);
                    }}
                    className="px-3 py-1 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <i className="ri-delete-bin-fill text-white hover:text-red-400 text-md"></i>
                  </button>
                </div>
              ))}
              {filteredGames.length === 0 && searchTerm && (
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <i className="ri-search-line text-[#A641FF] text-4xl mb-3"></i>{" "}
                  {/* Search icon better hai */}
                  <p className="text-[#696969] text-sm text-center">
                    No games found for "{searchTerm}"
                    <br />
                    Try a different search term
                  </p>
                </div>
              )}

              {filteredGames.length === 0 && !searchTerm && (
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <i className="ri-gamepad-line text-[#A641FF] text-4xl mb-3"></i>
                  <p className="text-[#696969] text-sm text-center">
                    Your library is empty. <br />
                    Add games from the store to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;

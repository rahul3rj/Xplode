import React, { useState, useEffect, useMemo } from "react";
import GameResult from "../components/GameResult";
import { X } from "lucide-react";
import axios from "../utils/axios";

const SearchResults = ({ query }) => {
  const [activePage, setActivePage] = useState(1);
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [showGenre, setshowGenre] = useState(true);
  const [showPublisher, setshowPublisher] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [exactMatches, setExactMatches] = useState([]); // ✅ Exact matches ko alag se store karo
  const [isLoading, setIsLoading] = useState(false);

  
  const GAMES_PER_PAGE = 10;

  // Sample game data
  // const games = [
  //   {
  //     id: 1,
  //     title: "Elden Ring",
  //     developer: "FromSoftware",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg",
  //     tags: ["Dark fantasy", "RPG", "Difficult"],
  //     matchType: "Exact match",
  //   },
  //   {
  //     id: 2,
  //     title: "Cyberpunk 2077",
  //     developer: "CD Projekt RED",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg",
  //     tags: ["Open World", "RPG", "Sci-fi"],
  //     matchType: "Related",
  //   },
  //   {
  //     id: 3,
  //     title: "The Witcher 3",
  //     developer: "CD Projekt RED",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/292030/capsule_616x353.jpg",
  //     tags: ["Fantasy", "RPG", "Story Rich"],
  //     matchType: "Popular",
  //   },
  //   {
  //     id: 4,
  //     title: "Red Dead Redemption 2",
  //     developer: "Rockstar Games",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg",
  //     tags: ["Western", "Open World", "Action"],
  //     matchType: "Trending",
  //   },
  //   {
  //     id: 5,
  //     title: "God of War",
  //     developer: "Santa Monica Studio",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/1593500/capsule_616x353.jpg",
  //     tags: ["Action", "Adventure", "Mythology"],
  //     matchType: "Top rated",
  //   },
  //   {
  //     id: 6,
  //     title: "Hades",
  //     developer: "Supergiant Games",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/1145360/capsule_616x353.jpg",
  //     tags: ["Roguelike", "Indie", "Action"],
  //     matchType: "Highly rated",
  //   },
  //   {
  //     id: 7,
  //     title: "Hollow Knight",
  //     developer: "Team Cherry",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/367520/capsule_616x353.jpg",
  //     tags: ["Metroidvania", "Indie", "Platformer"],
  //     matchType: "Indie gem",
  //   },
  //   {
  //     id: 8,
  //     title: "Stardew Valley",
  //     developer: "ConcernedApe",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg",
  //     tags: ["Farming", "Simulation", "Relaxing"],
  //     matchType: "Chill gaming",
  //   },
  //   {
  //     id: 10,
  //     title: "Among Us",
  //     developer: "InnerSloth",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/945360/capsule_616x353.jpg",
  //     tags: ["Social", "Party", "Deduction"],
  //     matchType: "Party game",
  //   },
  //   {
  //     id: 12,
  //     title: "Apex Legends",
  //     developer: "Respawn Entertainment",
  //     image:
  //       "https://shared.steamstatic.com/store_item_assets/steam/apps/1172470/capsule_616x353.jpg",
  //     tags: ["Battle Royale", "FPS", "Team-based"],
  //     matchType: "Free to play",
  //   },
  // ];

useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      try {
        // First fetch exact matches
        const exactResponse = await axios.get(
          `/games/search?q=${encodeURIComponent(query)}`
        );
        const exactMatchesData = exactResponse.data.map((game) => ({
          ...game,
          matchType: "Exact match",
        }));
        
        setExactMatches(exactMatchesData); // ✅ Exact matches alag se store karo

        // Then fetch related games based on genres of exact matches
        let relatedGames = [];
        if (exactMatchesData.length > 0) {
          // Get all unique genres from exact matches
          const allGenres = [
            ...new Set(exactMatchesData.flatMap((game) => game.genres || [])),
          ];

          if (allGenres.length > 0) {
            // Fetch games with similar genres (excluding exact matches)
            const genreQuery = allGenres.slice(0, 3).join(",");
            const relatedResponse = await axios.get(
              `/games/search/by-genres?genres=${genreQuery}&limit=20`
            );

            // Filter out exact matches and add match type
            relatedGames = relatedResponse.data
              .filter(
                (relatedGame) =>
                  !exactMatchesData.some(
                    (exactGame) => exactGame.appid === relatedGame.appid
                  )
              )
              .map((game) => ({
                ...game,
                matchType: "Related",
              }));
          }
        }

        // Combine exact matches and related games
        const allResults = [...exactMatchesData, ...relatedGames];
        setSearchResults(allResults);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setExactMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const totalPages = Math.ceil(searchResults.length / GAMES_PER_PAGE);
  const startIndex = (activePage - 1) * GAMES_PER_PAGE;
  const paginatedResults = searchResults.slice(
    startIndex,
    startIndex + GAMES_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let startPage = Math.max(2, activePage - 1);
      let endPage = Math.min(totalPages - 1, activePage + 1);

      // Adjust if we're near the beginning
      if (activePage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (activePage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

const genreCounts = useMemo(() => {
    const counts = {};

    exactMatches.forEach((game) => {
      if (game.genres && Array.isArray(game.genres)) {
        game.genres.forEach((genre) => {
          counts[genre] = (counts[genre] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [exactMatches]); 
  

  const publisherCounts = useMemo(() => {
    const counts = {};

    exactMatches.forEach((game) => {
      if (game.publishers && Array.isArray(game.publishers)) {
        game.publishers.forEach((publisher) => {
          counts[publisher] = (counts[publisher] || 0) + 1;
        });
      } else if (game.developer) {
        counts[game.developer] = (counts[game.developer] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [exactMatches]); 

  // tag functions
  const addTag = () => {
    if (input.trim() !== "" && !tags.includes(input.trim())) {
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="h-[290vh] w-full px-5 flex items-start justify-start gap-5 relative">
      <div className="h-full w-[70%] relative">
        <div className="h-[6vh] w-full flex items-center justify-start mb-3">
          <div className="h-full w-[14vh] flex justify-center items-center gap-2">
            <div className="h-[6vh] w-[6vh] flex items-center justify-center rounded-full bg-transparent hover:bg-black/40 cursor-pointer">
              <i className="ri-arrow-left-s-line text-white text-xl"></i>
            </div>
            <div className="h-[6vh] w-[6vh] flex items-center justify-center rounded-full bg-transparent hover:bg-black/40 cursor-pointer">
              <i className="ri-arrow-right-s-line text-white text-xl"></i>
            </div>
          </div>
          <h2 className="text-white font-[gilroy-bold] text-xl mx-5">
            Search results for "<span className="text-[#A641FF]">{query}</span>"
          </h2>
        </div>
        <div className="h-auto w-full absolute z-30 overflow-y-auto hide-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-white">Loading...</p>
            </div>
          ) : (
            paginatedResults.map((game) => (
              <GameResult key={game.appid} game={game} />
            ))
          )}
        </div>
      </div>
      {/* Right section */}
      <div className="h-[85vh] w-auto sticky top-0 z-10 right-7">
        {/* Pagination */}
        <div className="h-[6vh] w-full flex flex-col items-center justify-center">
          <div className="h-[4vh] w-full flex items-center justify-between">
            <button
              onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
              className="text-white font-[gilroy-bold] px-4 py-0.5 rounded-sm bg-[#1E1E1E] cursor-pointer hover:bg-[#A641FF] "
            >
              Prev
            </button>
            <div className="h-[4vh] w-[60%] flex justify-center items-center gap-2">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="text-white font-[gilroy-bold]"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setActivePage(page)}
                    className={`text-white font-[gilroy-bold] h-[4vh] w-[4vh] rounded-full cursor-pointer transition-colors ${
                      activePage === page
                        ? "bg-[#A641FF]"
                        : "bg-[#1E1E1E] hover:bg-[#A641FF]/50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() =>
                setActivePage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={activePage === totalPages}
              className={`text-white font-[gilroy-bold] px-4 py-0.5 rounded-sm cursor-pointer ${
                activePage === totalPages
                  ? "bg-[#A641FF]/50 cursor-not-allowed"
                  : "bg-[#A641FF] hover:bg-[#A641FF]/80"
              }`}
            >
              Next
            </button>

            <div className="mt-2 text-white text-sm font-[gilroy]">
              Showing {startIndex + 1}-
              {Math.min(startIndex + GAMES_PER_PAGE, searchResults.length)} of{" "}
              {searchResults.length} games
            </div>
          </div>
        </div>
        {/* Tag search */}
        <div className="h-[76vh] w-full flex flex-col items-center justify-start bg-[#8800FF]/20 rounded-lg mt-5 overflow-auto hide-scrollbar ">
          <div className="h-[30vh] w-full px-5 py-4 relative">
            <input
              placeholder="Search for a tag..."
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-[6vh] w-full px-5 rounded-sm text-sm font-[gilroy-bold] bg-[#250740] placeholder-[#A641FF] z-10 outline-none text-white"
            />
            <div
              onClick={addTag}
              className="h-[6vh] w-auto absolute top-4 right-8 flex items-center justify-center cursor-pointer"
            >
              <i className="ri-search-2-line text-[#A641FF] text-xl"></i>
            </div>

            {/* Tags display */}
            <div className="mt-4 h-[15vh] flex flex-wrap gap-3 overflow-auto hide-scrollbar">
              {tags.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <img
                    src="/Logo_short.svg"
                    alt="Nothing here"
                    className="w-16 h-16 opacity-50 mb-2"
                  />
                  <p className="text-white/60 text-sm font-[gilroy-bold]">
                    Nothing here yet
                  </p>
                </div>
              ) : (
                tags.map((tag, index) => (
                  <div
                    key={index}
                    className="h-[6vh] flex items-center gap-2 bg-[#A641FF]/40 px-4 py-2 rounded-sm"
                  >
                    <span className="text-white font-[gilroy-bold] text-sm">
                      {tag}
                    </span>
                    <button onClick={() => removeTag(tag)}>
                      <i className="ri-close-line w-4 h-4 text-white hover:text-red-800"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="h-[2px] w-full bg-[#A641FF] mt-3"></div>
          </div>
          <div className="h-auto w-full flex flex-col items-center justify-start px-5">
            <div
              className="h-auto w-full flex items-center justify-between "
              onClick={() => setshowGenre(!showGenre)}
            >
              <p className="text-white text-lg font-[gilroy-bold]">Genre</p>
              <i
                className={`ri-arrow-down-s-line text-white text-xl transition-transform duration-300 ${
                  showGenre ? "rotate-180" : ""
                }`}
              ></i>
            </div>

            <div
              className={`${
                showGenre ? "h-[25vh] opacity-100 mt-3" : "h-0 opacity-0"
              } w-full mt-3 flex flex-col items-center gap-3 transition-all duration-300 overflow-hidden`}
            >
              {genreCounts.slice(0, 4).map((genre, index) => (
                <div
                  key={genre.name}
                  className={`h-[5vh] w-full flex items-center justify-between px-5 rounded-sm ${
                    index % 2 === 0 ? "bg-[#A641FF]/50" : ""
                  }`}
                >
                  <p className="text-white text-sm font-[gilroy-bold]">
                    {genre.name}
                  </p>
                  <p className="text-white text-sm font-[gilroy-bold]">
                    {genre.count}
                  </p>
                </div>
              ))}

              {genreCounts.length > 4 && (
                <div
                  className={`${
                    showGenre ? "block h-[2vh] mt-3" : "hidden h-0"
                  } w-full flex justify-end items-center`}
                >
                  <p
                    className={`text-[#A641FF]/50 text-sm font-[gilroy] cursor-pointer`}
                  >
                    see more...
                  </p>
                </div>
              )}
            </div>
            <div
              className={`${
                showGenre ? "block h-[2vh] mt-3" : "hidden h-0"
              } w-full  flex justify-end items-center`}
            >
              <p
                className={`text-[#A641FF]/50 text-sm font-[gilroy] cursor-pointer`}
              >
                see more...
              </p>
            </div>

            <div
              className={`${
                showGenre ? "mt-3" : "mt-0"
              } h-[2px] w-full bg-[#A641FF] mb-3`}
            ></div>
          </div>
          <div className="h-auto w-full flex flex-col items-center justify-start px-5">
            <div
              className="h-auto w-full flex items-center justify-between "
              onClick={() => setshowPublisher(!showPublisher)}
            >
              <p className="text-white text-lg font-[gilroy-bold]">Publisher</p>
              <i
                className={`ri-arrow-down-s-line text-white text-xl transition-transform ${
                  showPublisher ? "rotate-180" : ""
                }`}
              ></i>
            </div>

            <div
              className={`${
                showPublisher ? "h-[25vh] opacity-100 mt-3" : "h-0 opacity-0"
              } w-full mt-3 flex flex-col items-center gap-3 transition-all duration-300 overflow-hidden`}
            >
              {publisherCounts.slice(0, 4).map((publisher, index) => (
                <div
                  key={publisher.name}
                  className={`h-[5vh] w-full flex items-center justify-between px-5 rounded-sm ${
                    index % 2 === 0 ? "bg-[#A641FF]/50" : ""
                  }`}
                >
                  <p className="text-white text-sm font-[gilroy-bold]">
                    {publisher.name}
                  </p>
                  <p className="text-white text-sm font-[gilroy-bold]">
                    {publisher.count}
                  </p>
                </div>
              ))}

              {publisherCounts.length > 4 && (
                <div
                  className={`${
                    showPublisher ? "block h-[2vh] mt-3" : "hidden h-0"
                  } w-full flex justify-end items-center`}
                >
                  <p
                    className={`text-[#A641FF]/50 text-sm font-[gilroy] cursor-pointer`}
                  >
                    see more...
                  </p>
                </div>
              )}
            </div>
            <div
              className={`${
                showPublisher ? "block h-[2vh] mt-3" : "hidden h-0"
              } w-full  flex justify-end items-center`}
            >
              <p
                className={`text-[#A641FF]/50 text-sm font-[gilroy] cursor-pointer`}
              >
                see more...
              </p>
            </div>

            <div
              className={`${
                showPublisher ? "mt-3" : "mt-0"
              } h-[2px] w-full bg-[#A641FF] mb-3`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

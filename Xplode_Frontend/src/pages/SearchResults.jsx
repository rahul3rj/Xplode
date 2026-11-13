import React, { useState, useEffect, useMemo } from "react";
import GameResult from "../components/GameResult";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import axios from "../utils/axios";

const SearchResults = ({ query }) => {
  const [activePage, setActivePage] = useState(1);
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [showGenre, setshowGenre] = useState(true);
  const [showPublisher, setshowPublisher] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingByTags, setIsSearchingByTags] = useState(false);
  const [exactMatches, setExactMatches] = useState([]); // ✅ Exact matches ko alag se store karo
  const [isLoading, setIsLoading] = useState(false);
  const [expandedGenres, setExpandedGenres] = useState(false);
  const [expandedPublishers, setExpandedPublishers] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.initialTags) {
      setTags(location.state.initialTags);
    }
  }, [location]);

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
  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  useEffect(() => {
    if (tags.length > 0) {
      searchByTags();
    } else {
      setIsSearchingByTags(false);
      // Original search restore karo agar tags empty hain
      if (query) {
        fetchSearchResults(query);
      }
    }
  }, [tags]);

  const searchByTags = async () => {
    if (tags.length === 0) return;

    setIsLoading(true);
    setIsSearchingByTags(true);

    try {
      const tagQuery = tags.join(",");
      const response = await axios.get(
        `/games/search/advanced?tags=${tagQuery}&limit=30`
      );

      setSearchResults(response.data);
      setActivePage(1); // Reset to first page
    } catch (error) {
      console.error("Error searching by tags:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

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

    // ✅ Agar tags search ho raha hai to searchResults se calculate karo
    // ✅ Agar normal search hai to exactMatches se calculate karo
    const sourceData = isSearchingByTags ? searchResults : exactMatches;

    sourceData.forEach((game) => {
      if (game.genres && Array.isArray(game.genres)) {
        game.genres.forEach((genre) => {
          counts[genre] = (counts[genre] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [isSearchingByTags ? searchResults : exactMatches]); // ✅ Dependency change

  const publisherCounts = useMemo(() => {
    const counts = {};

    // ✅ Same logic for publishers
    const sourceData = isSearchingByTags ? searchResults : exactMatches;

    sourceData.forEach((game) => {
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
  }, [isSearchingByTags ? searchResults : exactMatches]);

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
          {/* <div className="h-full w-[14vh] flex justify-center items-center gap-2">
            <div className="h-[6vh] w-[6vh] flex items-center justify-center rounded-full bg-transparent hover:bg-black/40 cursor-pointer">
              <i className="ri-arrow-left-s-line text-white text-xl"></i>
            </div>
            <div className="h-[6vh] w-[6vh] flex items-center justify-center rounded-full bg-transparent hover:bg-black/40 cursor-pointer">
              <i className="ri-arrow-right-s-line text-white text-xl"></i>
            </div>
          </div> */}
          <h2 className="text-white font-[gilroy-bold] text-lg mx-3">
            {isSearchingByTags ? (
              <>
                Searching by tags:{" "}
                <span className="text-[#A641FF]">{tags.join(", ")}</span>
              </>
            ) : (
              <>
                Search results for "
                <span className="text-[#A641FF]">{query}</span>"
              </>
            )}
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
      <div className="h-[85vh] w-[28%] sticky top-0 z-10 right-7">
        {/* Pagination with ellipsis */}
        <div className="h-[6vh] w-full flex flex-col items-center justify-center">
          <div className="h-[4vh] w-full flex items-center justify-between">
            <button
              onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className={`text-white font-[gilroy-bold] px-4 py-0.5 rounded-sm cursor-pointer ${
                activePage === 1
                  ? "bg-[#1E1E1E] cursor-not-allowed opacity-50"
                  : "bg-[#A641FF] hover:bg-[#A641FF]/80"
              }`}
            >
              Prev
            </button>

            <div className="h-[4vh] w-[70%] flex justify-center items-center gap-2">
              {/* First 5 pages */}
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    if (page <= totalPages) {
                      setActivePage(page);
                    }
                  }}
                  disabled={page > totalPages}
                  className={`text-white font-[gilroy-bold] h-[4vh] w-[4vh] rounded-full cursor-pointer transition-colors flex items-center justify-center ${
                    activePage === page
                      ? "bg-[#A641FF]"
                      : page > totalPages
                      ? "bg-[#1E1E1E] cursor-not-allowed opacity-30"
                      : "bg-[#1E1E1E] hover:bg-[#A641FF]/50"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Ellipsis */}
              <span className="text-white font-[gilroy-bold]">...</span>

              {/* Last page (10) */}
              <button
                onClick={() => {
                  if (10 <= totalPages) {
                    setActivePage(10);
                  }
                }}
                disabled={10 > totalPages}
                className={`text-white font-[gilroy-bold] h-[4vh] w-[4vh] rounded-full cursor-pointer transition-colors flex items-center justify-center ${
                  activePage === 10
                    ? "bg-[#A641FF]"
                    : 10 > totalPages
                    ? "bg-[#1E1E1E] cursor-not-allowed opacity-30"
                    : "bg-[#1E1E1E] hover:bg-[#A641FF]/50"
                }`}
              >
                10
              </button>
            </div>

            <button
              onClick={() =>
                setActivePage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={activePage === totalPages || totalPages === 0}
              className={`text-white font-[gilroy-bold] px-4 py-0.5 rounded-sm cursor-pointer ${
                activePage === totalPages || totalPages === 0
                  ? "bg-[#1E1E1E] cursor-not-allowed opacity-50"
                  : "bg-[#A641FF] hover:bg-[#A641FF]/80"
              }`}
            >
              Next
            </button>
          </div>
        </div>
        {/* Tag search */}
        <div className="h-[76vh] w-full flex flex-col items-center justify-start bg-[#8800FF]/20 rounded-lg mt-5 overflow-auto hide-scrollbar ">
          <div className="h-[27vh] w-full px-5 py-4 relative">
            <input
              placeholder="Search by genre, publisher, platform..."
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

            <div className="mt-4 h-[15vh] flex flex-col gap-3 overflow-auto hide-scrollbar">
              {/* Clear button top pe rahega */}
              {tags.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setTags([])}
                    className="text-[#A641FF] text-sm font-[gilroy] hover:text-white px-3 py-1 rounded"
                  >
                    Clear all tags
                  </button>
                </div>
              )}

              {/* Tags display */}
              <div className="flex flex-wrap gap-2">
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
                      className="h-[6vh] flex items-center gap-2 bg-[#A641FF]/20 px-4 py-2 rounded-full"
                    >
                      <span className="text-white font-[gilroy-bold] text-sm">
                        {tag}
                      </span>
                      <button onClick={() => removeTag(tag)}>
                        <i className="ri-close-line w-4 h-4 text-zinc-400 hover:scale-125 transition-transform duration-300 ease-in-out hover:text-white cursor-pointer"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* <div className="h-[2px] w-full bg-[#A641FF] mt-3"></div> */}
          </div>
          <div className="h-auto w-[90%] flex flex-col items-center justify-start px-5 py-2 bg-[#8800FF]/20 rounded-lg mt-5">
            <div
              className="h-auto w-full flex items-center justify-between cursor-pointer"
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
                showGenre
                  ? expandedGenres
                    ? "max-h-[50vh] opacity-100 mt-3" // ✅ Expanded height
                    : "max-h-[25vh] opacity-100 mt-3" // ✅ Collapsed height
                  : "max-h-0 opacity-0"
              } w-full flex flex-col items-center gap-2 transition-all duration-300 overflow-y-auto hide-scrollbar`}
            >
              {genreCounts
                .slice(0, expandedGenres ? genreCounts.length : 4) // ✅ Expand/collapse logic
                .map((genre, index) => (
                  <div
                    key={genre.name}
                    onClick={() => setTags([genre.name])}
                    className={`h-[5vh] w-full flex items-center justify-between px-5 rounded-sm bg-[#A641FF]/20 hover:bg-[#A641FF]/50 transition-colors duration-300 cursor-pointer`}
                  >
                    <p className="text-white text-xs font-[gilroy]">
                      {genre.name}
                    </p>
                    <p className="text-white text-xs font-[gilroy]">
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
                    onClick={() => setExpandedGenres(!expandedGenres)} // ✅ Toggle expand/collapse
                    className={`text-[#A641FF]/50 text-sm font-[gilroy] cursor-pointer hover:text-white`}
                  >
                    {expandedGenres ? "see less..." : "see more..."}{" "}
                    {/* ✅ Text change */}
                  </p>
                </div>
              )}
            </div>
            {/* <div
              className={`${
                showGenre ? "block h-[2vh] mt-3" : "hidden h-0"
              } w-full  flex justify-end items-center`}
            >
              <p
                className={`text-[#A641FF]/50 text-sm font-[gilroy] cursor-pointer`}
              >
                see more...
              </p>
            </div> */}

            {/* <div
              className={`${
                showGenre ? "mt-3" : "mt-0"
              } h-[2px] w-full bg-[#A641FF] mb-3`}
            ></div> */}
          </div>
          <div className="h-auto w-[90%] flex flex-col items-center justify-start px-5 py-2 bg-[#8800FF]/20 rounded-lg mt-4">
            <div
              className="h-auto w-full flex items-center justify-between cursor-pointer"
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
                showPublisher
                  ? expandedPublishers
                    ? "max-h-[50vh] opacity-100 mt-3" // ✅ Expanded height
                    : "max-h-[25vh] opacity-100 mt-3" // ✅ Collapsed height
                  : "max-h-0 opacity-0"
              } w-full flex flex-col items-center gap-2 transition-all duration-300 overflow-y-auto hide-scrollbar`}
            >
              {publisherCounts
                .slice(0, expandedPublishers ? publisherCounts.length : 4) // ✅ Expand/collapse logic
                .map((publisher, index) => (
                  <div
                    key={publisher.name}
                    onClick={() => setTags([publisher.name])}
                    className="h-[5vh] w-full flex items-center justify-between px-5 rounded-sm bg-[#A641FF]/20 hover:bg-[#A641FF]/50 transition-colors duration-300 cursor-pointer"
                  >
                    <p className="text-white text-xs font-[gilroy]">
                      {publisher.name}
                    </p>
                    <p className="text-white text-xs font-[gilroy]">
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
                    onClick={() => setExpandedPublishers(!expandedPublishers)} // ✅ Toggle expand/collapse
                    className={`text-[#A641FF]/50 text-sm font-[gilroy] cursor-pointer hover:text-white`}
                  >
                    {expandedPublishers ? "see less..." : "see more..."}{" "}
                    {/* ✅ Text change */}
                  </p>
                </div>
              )}
            </div>
            {/* <div
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
            ></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

import React, { useState } from "react";
import GameResult from "../components/GameResult";
import { X } from "lucide-react";

const SearchResults = ({ query }) => {
  const [activePage, setActivePage] = useState(1);
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [showGenre, setshowGenre] = useState(true);
  const [showPublisher, setshowPublisher] = useState(true);

  // Sample game data
  const games = [
    {
      id: 1,
      title: "Elden Ring",
      developer: "FromSoftware",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg",
      tags: ["Dark fantasy", "RPG", "Difficult"],
      matchType: "Exact match",
    },
    {
      id: 2,
      title: "Cyberpunk 2077",
      developer: "CD Projekt RED",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg",
      tags: ["Open World", "RPG", "Sci-fi"],
      matchType: "Related",
    },
    {
      id: 3,
      title: "The Witcher 3",
      developer: "CD Projekt RED",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/292030/capsule_616x353.jpg",
      tags: ["Fantasy", "RPG", "Story Rich"],
      matchType: "Popular",
    },
    {
      id: 4,
      title: "Red Dead Redemption 2",
      developer: "Rockstar Games",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg",
      tags: ["Western", "Open World", "Action"],
      matchType: "Trending",
    },
    {
      id: 5,
      title: "God of War",
      developer: "Santa Monica Studio",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/1593500/capsule_616x353.jpg",
      tags: ["Action", "Adventure", "Mythology"],
      matchType: "Top rated",
    },
    {
      id: 6,
      title: "Hades",
      developer: "Supergiant Games",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/1145360/capsule_616x353.jpg",
      tags: ["Roguelike", "Indie", "Action"],
      matchType: "Highly rated",
    },
    {
      id: 7,
      title: "Hollow Knight",
      developer: "Team Cherry",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/367520/capsule_616x353.jpg",
      tags: ["Metroidvania", "Indie", "Platformer"],
      matchType: "Indie gem",
    },
    {
      id: 8,
      title: "Stardew Valley",
      developer: "ConcernedApe",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg",
      tags: ["Farming", "Simulation", "Relaxing"],
      matchType: "Chill gaming",
    },
    {
      id: 10,
      title: "Among Us",
      developer: "InnerSloth",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/945360/capsule_616x353.jpg",
      tags: ["Social", "Party", "Deduction"],
      matchType: "Party game",
    },
    {
      id: 12,
      title: "Apex Legends",
      developer: "Respawn Entertainment",
      image:
        "https://shared.steamstatic.com/store_item_assets/steam/apps/1172470/capsule_616x353.jpg",
      tags: ["Battle Royale", "FPS", "Team-based"],
      matchType: "Free to play",
    },
  ];

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
          {games.map((game) => (
            <GameResult key={game.id} game={game} />
          ))}
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
              {[1, 2, 3, 4, 5].map((page) => (
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
              ))}
              <button className="text-white font-[gilroy-bold] h-[4vh] w-[4vh] rounded-full bg-[#1E1E1E] cursor-pointer">
                ...
              </button>
              <button
                onClick={() => setActivePage(10)}
                className={`text-white font-[gilroy-bold] h-[4vh] w-[4vh] rounded-full cursor-pointer transition-colors ${
                  activePage === 10
                    ? "bg-[#A641FF]"
                    : "bg-[#1E1E1E] hover:bg-[#A641FF]/50"
                }`}
              >
                10
              </button>
            </div>
            <button
              onClick={() => setActivePage((prev) => Math.min(10, prev + 1))}
              className="text-white font-[gilroy-bold] px-4 py-0.5 rounded-sm bg-[#A641FF]/50 hover:bg-[#A641FF] cursor-pointer"
            >
              Next
            </button>
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
              } w-full mt-3 flex flex-col items-center justify-between transition-all duration-300 overflow-hidden`}
            >
              <div className="h-[5vh] w-full flex items-center justify-between px-5 rounded-sm bg-[#A641FF]/50">
                <p className="text-white text-sm font-[gilroy-bold]">
                  Souls-Like
                </p>
                <p className="text-white text-sm font-[gilroy-bold]">34</p>
              </div>
              <div className="h-[5vh] w-full flex items-center justify-between px-5 rounded-sm ">
                <p className="text-white text-sm font-[gilroy-bold]">Action</p>
                <p className="text-white text-sm font-[gilroy-bold]">12</p>
              </div>
              <div className="h-[5vh] w-full flex items-center justify-between px-5 rounded-sm bg-[#A641FF]/50">
                <p className="text-white text-sm font-[gilroy-bold]">RPG</p>
                <p className="text-white text-sm font-[gilroy-bold]">10</p>
              </div>
              <div className="h-[5vh] w-full flex items-center justify-between px-5 rounded-sm ">
                <p className="text-white text-sm font-[gilroy-bold]">
                  Adventure
                </p>
                <p className="text-white text-sm font-[gilroy-bold]">3</p>
              </div>
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
                showPublisher
                  ? "h-[25vh] opacity-100 mt-3"
                  : "h-0 opacity-0"
              } w-full mt-3 flex flex-col items-center justify-between transition-all duration-300 overflow-hidden`}
            >
              <div className="h-[5vh] w-full flex items-center justify-between px-5 rounded-sm bg-[#A641FF]/50">
                <p className="text-white text-sm font-[gilroy-bold]">
                  Souls-Like
                </p>
                <p className="text-white text-sm font-[gilroy-bold]">34</p>
              </div>
              <div className="h-[5vh] w-full flex items-center justify-between px-5 rounded-sm ">
                <p className="text-white text-sm font-[gilroy-bold]">Action</p>
                <p className="text-white text-sm font-[gilroy-bold]">12</p>
              </div>
              <div className="h-[5vh] w-full flex items-center justify-between px-5 rounded-sm bg-[#A641FF]/50">
                <p className="text-white text-sm font-[gilroy-bold]">RPG</p>
                <p className="text-white text-sm font-[gilroy-bold]">10</p>
              </div>
              <div className="h-[5vh] w-full flex items-center justify-between px-5 rounded-sm ">
                <p className="text-white text-sm font-[gilroy-bold]">
                  Adventure
                </p>
                <p className="text-white text-sm font-[gilroy-bold]">3</p>
              </div>
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

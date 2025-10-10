import React from "react";
import Likepercent from "./Likepercent";
import { addToLibrary, requireAuth } from "../utils/addToLibrary";
import { Link } from "react-router-dom";

const GameResult = ({ game }) => {
  const { appid, name, developer, genres, header_image, matchType } = game;

  const handleAddToLibrary = async (e) => { 
    e.stopPropagation(); // Prevent redirection
    e.preventDefault();
    if (!requireAuth()) return;
    try {
      const gameData = {
        steam_appid: game.appid,
        name: name,
        portrait_image: game.portrait_image || game.capsule_image,
        hero_image: {
          url:
            game.hero_image[0].url ||
            game.background_raw ||
            game.background ||
            game.header_image,
          thumb:
            game.hero_image[0].thumb || game.background || game.header_image,
        },
        developers: developer,
        publishers: game.publishers,
        categories: game.categories || [],
        movies: game.movies || [],
      };

      const result = await addToLibrary(gameData);
      // Show success message
      alert("Game added to your library!");
    } catch (error) {
      console.error("Failed to add game to library:", error);
      alert(error.message || "Failed to add game to library");
    }
  };

  return (
    <Link
      key={`${appid || index}  `}
      to={`/game/${appid}`}
      className="h-[25vh] w-full rounded-xl bg-[#8800FF]/20 flex justify-start items-center p-3 mb-5 gap-5 cursor-pointer transition-all duration-300 ease-in-out delay-100 hover:shadow-3xl hover:bg-[#8800FF]/40 hover:shadow-[0px_0px_100px_50px_#8800FF]/20"
    >
      <div className="h-full w-[23vw] rounded-md overflow-hidden flex justify-center items-center">
        <img src={header_image} alt={name} className="object-cover h-full w-full" />
      </div>
      <div className="h-full w-[50%] flex flex-col justify-between items-start">
        <div className="h-auto w-auto rounded-sm bg-[#8B2CF5]/50 flex justify-center items-center px-2 py-1">
          <h5 className="text-white font-[gilroy-bold] text-[1.4vh]">
            {matchType}
          </h5>
        </div>
        <div>
          <h3 className="text-white font-[gilroy-bold] text-xl">{name}</h3>
          <h4 className="text-[#9F9B9B] font-[gilroy] text-[1.4vh] mt-1">
            {developer}
          </h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {genres.map((tag, index) => (
              <h4
                key={index}
                className={`text-xs font-[gilroy-ebold] cursor-pointer ${
                  index === 0
                    ? "text-[#A641FF]"
                    : "text-[#837F7F] hover:text-[#A641FF]"
                }`}
              >
                {tag}{" "}
              </h4>
            ))}
          </div>
        </div>
        <div className="h-[5vh] w-full flex justify-between items-center">
          <div className="h-full w-[40%] flex justify-center items-center">
            <img src="/Slider/win.svg" alt="" className="h-[3vh]" />
            <div className="h-full w-full pl-4 pt-1">
              <Likepercent />
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-[17%] flex flex-col justify-between items-center">
        <div className="h-[5vh] w-full flex justify-between items-center">
          <button
            onClick={handleAddToLibrary}
            className="h-[5svh] w-[75%] rounded-sm bg-[#8B2CF5]/50 text-white font-[gilroy-bold] text-xs cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2"
          >
            <i class="ri-add-line text-lg"></i> Add Game
          </button>
          <div className="h-[5vh] w-[5vh] flex justify-center items-center cursor-pointer  rounded-sm">
            <i class="ri-heart-fill text-xl text-white hover:text-[#A641FF]"></i>
          </div>
        </div>
        <button className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2">
          <i class="ri-download-line "></i> Download
        </button>
      </div>
    </Link>
  );
};

export default GameResult;

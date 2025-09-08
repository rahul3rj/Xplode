import React from "react";
import { useNavigate } from 'react-router-dom'

const LibDetails = ({ game, onClose }) => {
  const navigate = useNavigate()

  console.log(game)

   if (!game) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-white">Game not found</p>
      </div>
    );
  }
  return (
    <div className="h-full w-full px-5">
      <div className="h-[30vh] w-full relative">
        <div className="h-full w-full onject-cover flex items-center justify-center overflow-hidden rounded-sm">
           <img
            src={game.hero_image?.url || `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steam_appid}/library_hero.jpg` || game.portrait_image}
            alt={game.name}
             className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-10 h-[100%] w-[20vw] onject-cover flex items-center justify-center overflow-hidden">
           <img
            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steam_appid}/logo.png`}
            alt={game.name}
            className="max-h-full max-w-full object-contain"
          />
          
        </div>
      </div>
      <div className="h-[10vh] w-full flex items-center justify-between">
        <button className="px-12 py-2 cursor-pointer rounded-sm bg-[#A641FF] text-white">
          {" "}
          <i className="ri-play-fill text-white text-xl"></i> Play
        </button>
        <div className="flex items-center justify-center gap-2">
          <button className="px-8 py-2 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white transition-all duration-200 ease-in-out"  onClick={() => navigate(`/game/${game.steam_appid}`)}>
            {" "}
            <i class="ri-store-2-fill text-white text-xl"></i> Store Page
          </button>
          <button className="px-8 py-2 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white flex items-center justify-center gap-1 transition-all duration-200 ease-in-out">
            {" "}
            <img src="/community.svg" alt="" className="py-1" /> Community
          </button>
          <button className="px-3 py-2 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white transition-all duration-200 ease-in-out">
            {" "}
            <img
              src="/HomePage/Shopping Cart.svg"
              alt=""
              className="py-1 h-7"
            />{" "}
          </button>
          <button className="px-3 py-2 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white transition-all duration-200 ease-in-out">
            {" "}
            <i class="ri-settings-3-fill text-white text-xl"></i>{" "}
          </button>
        </div>
      </div>
      <div className="h-[34vh] w-full flex justify-between items-center overflow-auto hide-scrollbar">
        <div className="h-[34vh] w-[38vw]">
          <h1 className="text-md font-[gilroy-bold] text-[#A641FF]">
            ACTIVITY
          </h1>
          <div className="flex flex-col justify-center items-end">
            <input
              type="text"
              placeholder="Share your experience to your Friends..."
              className="w-full px-4 py-3 rounded-sm shadow-md placeholder:text-[#696969] outline-none text-white bg-[#8800FF]/20 mt-2 mb-2"
            />
            <button className="px-12 py-3 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white transition-all duration-200 ease-in-out">
              Post
            </button>
          </div>
          <div className="h-auto w-full flex flex-col justify-center items-center mb-5 mt-5">
            <div className="h-[3vh] w-full flex items-center justify-between">
              <h1 className="text-sm font-[gilroy] text-[#696969] px-3 ">
                September 05
              </h1>
              <div className="h-[1px] w-[79%] bg-[#696969]"></div>
            </div>
            <div className="h-[10vh] w-full mt-2 rounded-sm bg-[#8800FF]/20 flex justify-start items-center">
              <img src="/medal.svg" alt="" className="h-full w-[5vw] py-2" />
              <div className="h-full w-auto flex flex-col justify-center items-start">
                <h1 className="text-xs font-[gilroy] text-[#696969]">
                  new Achievement Unlocked!
                </h1>
                <h1 className="text-xl font-[gilroy] text-[#696969]">
                  Brought Your Friend To <span className="bg-[linear-gradient(90deg,#A641FF_0%,#FF29C3_100%)] bg-clip-text text-transparent">Xplode</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="h-auto w-full flex flex-col justify-center items-center mb-5 ">
            <div className="h-[3vh] w-full flex items-center justify-between">
              <h1 className="text-sm font-[gilroy] text-[#696969] px-3 ">
                September 05
              </h1>
              <div className="h-[1px] w-[79%] bg-[#696969]"></div>
            </div>
            <div className="h-[10vh] w-full mt-2 rounded-sm bg-[#8800FF]/20 flex justify-start items-center">
              <img src="/medal.svg" alt="" className="h-full w-[5vw] py-2" />
              <div className="h-full w-auto flex flex-col justify-center items-start">
                <h1 className="text-xs font-[gilroy] text-[#696969]">
                  new Achievement Unlocked!
                </h1>
                <h1 className="text-xl font-[gilroy] text-[#696969]">
                  Brought Your Friend To <span className="bg-[linear-gradient(90deg,#A641FF_0%,#FF29C3_100%)] bg-clip-text text-transparent">Xplode</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[34vh] w-[20vw] bg-[#8800FF]/20 rounded-sm px-5 py-5">
          <div className="h-auto w-full flex items-center justify-between">
            <h1 className="text-sm font-[gilroy-bold] text-[#A641FF] ">
              FRIENDS WHO PLAYS
            </h1>
          </div>
          <div className="flex justify-between items-center mt-3">
            <h1 className="text-xs font-[gilroy-bold] text-[#696969] ">RECENTLY PLAYED</h1>
            <div className="h-[1px] w-[60%] bg-[#696969]"></div>
          </div>
          <div className="h-[7vh] w-full flex justify-start items-center mt-3">
            <div className="h-[5vh] w-[5vh] rounded-full overflow-hidden border-1 border-[#A641FF]">
              <img src="/profile/profile_pic2.jpg" alt=""  className=""/>
            </div>
            <div className="h-full w-auto flex flex-col justify-center items-center gap-1 ml-3">
              <h1 className="text-sm font-[gilroy-bold] text-white">Moneykitty</h1>
              <h1 className="text-xs font-[gilroy-bold] text-[#696969]">4 hours ago</h1>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <h1 className="text-xs font-[gilroy-bold] text-[#696969] ">PREVIOUSLY PLAYED</h1>
            <div className="h-[1px] w-[55%] bg-[#696969]"></div>
          </div>
          <div className="h-[7vh] w-full flex justify-start items-center mt-3">
            <div className="h-[5vh] w-[5vh] rounded-full overflow-hidden border-1 border-[#A641FF]">
              <img src="https://i.pinimg.com/736x/21/53/26/2153260146bd63ceb63741b06a82059f.jpg" alt=""  className=""/>
            </div>
            <div className="h-full w-auto flex flex-col justify-center items-center gap-1 ml-3">
              <h1 className="text-sm font-[gilroy-bold] text-white">CheapThriller</h1>
              <h1 className="text-xs font-[gilroy-bold] text-[#696969]">2 months ago</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibDetails;

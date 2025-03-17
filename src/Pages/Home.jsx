import React from "react";
import "./Home.css";
import { useState } from "react";
import GameSlider from "../components/slider";
import GameList from "../components/dock";
import GameList2 from "../components/dock2";
import GameList3 from "../components/dock3";
import GameList4 from "../components/dock4";
import Footer from "../components/footer";

function Home() {
  const [activeDiv, setActiveDiv] = useState("Game_store");
  return (
    <div className="h-[290vh] w-[100vw] bg-[#121921] relative">
      <div className="g1 h-[290vh] w-screen bg-red-300 absolute"></div>
      <div className="g2 h-[290vh] w-screen bg-red-600 absolute"></div>
      <div className="navSide h-[100vh] w-[16vw] flex flex-col justify-center items-center z-50 sticky top-0">
        <div className="logo w-[16vw] h-[10vh] flex ml-[8vw] items-center">
          <img src="/logo.png" alt="" width="120" />
        </div>
        <div className="icons h-[60vh] w-[16vw] flex items-center mt-5">
          <div className="h-[60vh] w-[5vw] relative">
            <div className="h-[3vh] w-[0.3vw] bg-[#D65F30] absolute right-0 top-3 rounded-full mr-3 shadow"></div>
          </div>
          <div className="h-[60vh] w-[11vw]">
            <div className="h-[6vh] w-[11vw] flex items-center justify-center">
              <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                <img src="/game2.png" alt="" width="30" className="z-10" />
              </div>
              <div className="h-[6vh] w-[8vw] text-[#D65F30] istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                <h4 className="text-sm">Game store</h4>
              </div>
            </div>
            <div className="h-[6vh] w-[11vw]">
              <div className="h-[6vh] w-[11vw] flex items-center justify-center">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img src="/Library.png" alt="" width="25" className="z-10" />
                </div>
                <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Library</h4>
                </div>
              </div>
            </div>
            <div className="h-[6vh] w-[11vw]">
              <div className="h-[6vh] w-[11vw] flex items-center justify-center">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img
                    src="/community.png"
                    alt=""
                    width="25"
                    className="z-10"
                  />
                </div>
                <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Community</h4>
                </div>
              </div>
            </div>
            <div className="h-[6vh] w-[11vw]">
              <div className="h-[6vh] w-[11vw] flex items-center justify-center">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img src="/friends.png" alt="" width="25" className="z-10" />
                </div>
                <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Friends</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="icons2 h-[30vh] w-[16vw] pl-[5vw] pt-[8vh]">
          <div className="h-[6vh] w-[11vw] flex items-center justify-center">
            <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
              <img src="/settings.png" alt="" width="40" className="z-10" />
            </div>
            <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
              <h4 className="text-sm">Settings</h4>
            </div>
          </div>
          <div className="h-[6vh] w-[11vw] flex items-center justify-center">
            <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
              <img src="/help.png" alt="" width="40" className="z-10" />
            </div>
            <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
              <h4 className="text-sm">Help</h4>
            </div>
          </div>
          <div className="h-[6vh] w-[11vw] flex items-center justify-center">
            <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
              <img src="/downloads.png" alt="" width="40" className="z-10" />
            </div>
            <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
              <h4 className="text-sm">Downloads</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="navTop h-[10vh] w-[84vw] absolute top-0 right-0 flex">
        <div className="search h-[10vh] w-[60vw] flex items-center relative">
          <input
            type="text"
            placeholder="Search games"
            className="istok-web-regular text-white h-[5vh] w-[35vw] bg-[#BFBABA]/12 rounded-xl shadow-xl focus:border-transparent focus:ring-0 focus:outline-none px-15"
          />
          <i className="ri-search-line text-white text-xl absolute left-4"></i>
        </div>
        <div className="h-[10vh] w-[24vw] flex justify-center items-center">
          <button className="h-[5vh] w-[5vh] bg-[#BFBABA]/12 rounded-full flex justify-center items-center cursor-pointer drop-shadow-xl hover:drop-shadow-none transition-all duration-300 mr-10">
            <img src="/bell.png" alt="" width="25" />
          </button>
          <button className="h-[5vh] w-[5vh] bg-[#BFBABA]/12 rounded-full flex justify-center items-center cursor-pointer drop-shadow-xl hover:drop-shadow-none transition-all duration-300 mr-10">
            <img src="/cart.png" alt="" width="25" />
          </button>
          <div className="flex justify-center items-center">
            <div className='h-[5vh] w-[5vh] bg-[#BFBABA]/12 rounded-full flex justify-center items-center cursor-pointer drop-shadow-xl hover:drop-shadow-none transition-all duration-300 mr-3 border-2 border-[#D65F30] bg-[url("/pfp.jpg")] bg-cover bg-center'></div>
            <div className="h-[10vh] w-[6vw] flex items-center justify-between text-white istok-web-regular cursor-pointer">
              <h4>Isagi Youichi</h4>
              <i className="ri-arrow-down-s-fill text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[90vh] w-[84vw] absolute right-0 top-22.5">
        <div className="h-[65vh] w-[81vw] flex">
          <GameSlider />
        </div>
      </div>
      <div className="h-[45vh] w-[84vw] absolute right-0 top-170">
        <GameList />
      </div>
      <div className="h-[45vh] w-[84vw] absolute right-0 top-270">
        <GameList2 />
      </div>
      <div className="h-[45vh] w-[84vw] absolute right-0 top-370">
        <GameList3 />
      </div>
      <div className="h-[45vh] w-[84vw] absolute right-0 top-470">
        <GameList4 />
      </div>
      <div className="h-[40vh] w-[84vw] absolute bottom-0 right-0">
        <Footer />
      </div>
    </div>
  );
}

export default Home;

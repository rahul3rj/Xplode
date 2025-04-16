import React from "react";
import Items_vault from "../components/Items_vault";


function Vault() {
  return (
    <div className="vault">
      <img
        src="./public/bg.png"
        className="h-screen w-full absolute z--1"
        alt=""
      />
      <div className="navSide h-[90vh] w-[16vw] flex flex-col justify-center items-start z-50 absolute bottom-0">
        <div className="icons h-[90vh] w-[13vw] flex mt-5 group">
          <div className="h-[90vh] w-[5vw] relative">
            <div className="h-[3vh] w-[0.3vw] bg-[#D65F30] absolute right-0 top-3 rounded-full mr-3 shadow"></div>
          </div>
          <div className="h-[90vh] w-[3vw] flex flex-col justify-between items-start ">
            <div className="top-part">
              <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img src="/game2.png" alt="" width="30" className="z-10" />
                </div>
              </div>
              <div className="h-[6vh] w-[3vw]">
                <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                    <img
                      src="/Library.png"
                      alt=""
                      width="25"
                      className="z-10"
                    />
                  </div>
                </div>
              </div>
              <div className="h-[6vh] w-[3vw]">
                <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                    <img
                      src="/community.png"
                      alt=""
                      width="25"
                      className="z-10"
                    />
                  </div>
                </div>
              </div>
              <div className="h-[6vh] w-[3vw]">
                <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                    <img
                      src="/friends.png"
                      alt=""
                      width="25"
                      className="z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-part">
              <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img src="/settings.png" alt="" width="40" className="z-10" />
                </div>
              </div>
              <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img src="/help.png" alt="" width="40" className="z-10" />
                </div>
              </div>
              <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img
                    src="/downloads.png"
                    alt=""
                    width="40"
                    className="z-10"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="h-[90vh] w-[5vw] flex flex-col justify-between items-start transform -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <div className="top-part2">
              <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                <div className="h-[6vh] w-[8vw] text-[#D65F30] istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Game store</h4>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw]">
                <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                    <h4 className="text-sm">Library</h4>
                  </div>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw]">
                <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                    <h4 className="text-sm">Community</h4>
                  </div>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw]">
                <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                    <h4 className="text-sm">Friends</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-part2">
              <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Settings</h4>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Help</h4>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Downloads</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="navTop h-[10vh] w-[100vw] absolute top-0 right-0 flex justify-between items-center z-50">
        <div className="logo w-[16vw] h-[10vh] flex ml-[5.6vw] items-center">
          <img src="/logo.png" alt="" width="120" />
        </div>
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
      <div className="Main_content h-[90vh] w-[84vw] absolute top-0 right-0 flex justify-start  mt-[10vh] z-50">
        <div className="h-[90vh] w-[61.3vw] flex flex-col justify-start items-start">
          <div className="h-[5vw] w-full flex justify-cenetr items-center">
            <h1 className="text-[1.5vw] istok-web-bold text-white">My Vault</h1>
          </div>
          <Items_vault />
          <Items_vault />
        </div>
        <div className="h-[50vh] w-[22.7vw]">
          <div className="h-[5vw] w-full flex  justify-start items-center ">
            <h1 className="text-[1.5vw] istok-web-bold text-white">
              {" "}
              Empty Vault{" "}
            </h1>
          </div>
          <div className="h-[2vw] w-[20vw] m-2 flex justify-between items-center">
            <h4 className="text-[#9F9B9B] istok-web-regular">Price</h4>
            <h4 className="text-[#9F9B9B] istok-web-regular">₹4299.00</h4>
          </div>
          <div className="h-[2vw] w-[20vw] m-2 flex justify-between items-center">
            <h4 className="text-[#9F9B9B] istok-web-regular">Taxes</h4>
            <h4 className="text-[#9F9B9B] istok-web-regular">
              Calculated at Checkout{" "}
            </h4>
          </div>
          <div className="h-[1.5vw] w-[20vw] m-2 flex justify-between items-center">
            <div className="h-[0.1vh] w-[100%] bg-white"></div>
          </div>
          <div className="h-[2vw] w-[20vw] m-2 flex justify-between items-center">
            <h4 className="text-[#9F9B9B] istok-web-regular">Subtotal</h4>
            <h4 className="text-[#9F9B9B] istok-web-regular">
              ₹4299.00{" "}
            </h4>
          </div>
          <div className="h-[10vh] w-[20vw] m-2 flex justify-center items-center">
            <button className="h-[6vh] w-[20vw] bg-[#D65F30] text-white hover:bg-white hover:text-black flex justify-center items-center isok-web-bold transition-all duration-300 rounded-xl cursor-pointer">Check Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Vault;
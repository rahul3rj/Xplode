import { div } from "framer-motion/client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Profile(){
  const [showPassword, setShowPassword] = useState(false);
  
    return (
      <div className="main h-screen w-full bg-[#121921] relative overflow-hidden  ">
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
                    <img
                      src="/settings.png"
                      alt=""
                      width="40"
                      className="z-10"
                    />
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
        <div className="h-[90vh] w-[88vw]  relative mt-[10vh] ml-[12vw] flex justify-between items-center">
          <div className="h-[90vh] w-[55vw] flex flex-col justify-between items-center">
            <div className="h-[40vh] w-full flex justify-between items-center">
              <div className="_text_ h-[20vh] w-[20vw] ml-21">
                <h1 className="text-[4vh] text-zinc-100 istok-web-regular">
                  Isagi Youichi
                </h1>
                <h4 className="text-[1.5vh] text-zinc-400 istok-web-regular">
                  @isagi11
                </h4>
                <h4 className="text-[1.5vh] text-green-400">
                  <i class="ri-circle-fill text-green-400 istok-web-regular"></i>{" "}
                  Online
                </h4>
              </div>
              <div className="_profilePic_ h-[17vw] w-[17vw] mr-[8vw] relative">
                <div className="_profilePic_ h-[17vw] w-[17vw] overflow-hidden rounded-full flex justify-center items-center cursor-pointer mr-11">
                  <img src="./pfp.jpg" alt="" />
                  <div className="h-[18.5vw] w-[18.5vw] absolute rounded-full rotate-0 flex justify-center items-center cursor-pointer ">
                    <img
                      src="./semi-circle.png"
                      alt=""
                      className="h-[11vw] absolute top-[-0.5vw] right-[-0.5vw]"
                    />
                  </div>
                  <div className="h-[17vw] w-[17vw] absolute rounded-full rotate-0 flex justify-center items-center cursor-pointer shade z-10"></div>
                  <div className="h-[4vw] w-[4vw] absolute z-20 rounded-full bottom-[-4vh] bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none transition-all duration-300">
                    <i class="ri-pencil-fill text-white text-[3vh]"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[50vh] w-full flex justify-between items-center">
              <div className="_EditProfile_ h-[40vh] w-[20vw] ml-21 flex flex-col justify-between items-center">
                <div className="h-[8vh] w-full ">
                  <h4 className="text-[1.5vh] text-zinc-400 istok-web-regular">
                    Name:
                  </h4>
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Isagi Youichi"
                      className="bg-white w-[17vw] h-[4vh] mt-2 mb-2 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none"
                    />
                    <div className="h-[5vh] w-[2.5vw]  rounded-full bottom-[-4vh] bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none transition-all duration-300">
                      <i class="ri-pencil-fill text-white text-[2vh]"></i>
                    </div>
                  </div>
                </div>
                <div className="h-[8vh] w-full ">
                  <h4 className="text-[1.5vh] text-zinc-400 istok-web-regular">
                    Username:
                  </h4>
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="@isagi11"
                      className="bg-white w-[17vw] h-[4vh] mt-2 mb-2 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none"
                    />
                    <div className="h-[5vh] w-[2.5vw]  rounded-full bottom-[-4vh] bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none transition-all duration-300">
                      <i class="ri-pencil-fill text-white text-[2vh]"></i>
                    </div>
                  </div>
                </div>
                <div className="h-[8vh] w-full ">
                  <h4 className="text-[1.5vh] text-zinc-400 istok-web-regular">
                    Email:
                  </h4>
                  <div className="flex justify-between items-center">
                    <input
                      type="email"
                      placeholder="isagiyouichi11@gmail.com"
                      className="bg-white w-[17vw] h-[4vh] mt-2 mb-2 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none"
                    />
                    <div className="h-[5vh] w-[2.5vw]  rounded-full bottom-[-4vh] bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none transition-all duration-300">
                      <i class="ri-pencil-fill text-white text-[2vh]"></i>
                    </div>
                  </div>
                </div>
                <div className="h-[8vh] w-full ">
                  <h4 className="text-[1.5vh] text-zinc-400 istok-web-regular">
                    Phone:
                  </h4>
                  <div className="flex justify-between items-center relative">
                    <input
                      type="number"
                      placeholder="+91 1234567890"
                      className="bg-white w-[17vw] h-[4vh] mt-2 mb-2 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none "
                    />
                    <button
                      type="button"
                      className="absolute inset-y-[1vh] right-3 flex place-items-center mr-[3vw] text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <div className="h-[5vh] w-[2.5vw]  rounded-full bottom-[-4vh] bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none transition-all duration-300">
                      <i class="ri-pencil-fill text-white text-[2vh]"></i>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full mt-2">
                  <button
                    type="button"
                    className="h-[5vh] w-[9vw] rounded-lg bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none hover:bg-white hover:text-black hover:border-none transition-all duration-300 text-white istok-web-regular"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="h-[5vh] w-[9vw] rounded-lg bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none hover:bg-white hover:text-black transition-all duration-300 text-white istok-web-regular"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="_Recent_ h-[40vh] w-[25vw]">
                <div className="h-[4vh] w-full flex justify-start items-center">
                  <h4 className="text-[1vw] text-zinc-100 istok-web-regular">
                    Recently viewed
                  </h4>
                </div>
                <div className="h-[7vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                  <div className="h-[7vw] w-[50%] flex justify-center items-center">
                    <div className="h-[6vw] w-[90%] flex justify-center items-center relative cursor-pointer overflow-hidden rounded-lg">
                      <img src="/rdr2_2.jpg" alt="" />
                    </div>
                  </div>
                  <div className="h-[7vw] w-[50%] flex flex-col justify-start items-center">
                    <div className=" h-[4vw] w-full flex flex-col justify-start items-start ">
                      <h4 className="text-[0.7vw] text-zinc-100 istok-web-regular mt-3">
                        Red Dead Redemption 2
                      </h4>
                      <h4 className="text-[0.5vw] text-zinc-400 istok-web-regular mt-1">
                        Rockstar Games
                      </h4>
                    </div>
                    <div className="h-[3vw] w-full flex justify-between items-center">
                      <h4 className="text-[0.7vw] text-zinc-100 istok-web-regular mt-1">
                        $59.99
                      </h4>
                      <button className="h-[2vw] w-[7vw] rounded-lg bg-[#D65F30] flex justify-center items-center cursor-pointer shadow-xl hover:shadow-none hover:bg-white hover:text-black transition-all duration-300 text-white istok-web-regular mr-5">
                        Buy now
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-[7vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                  <div className="h-[7vw] w-[50%] flex justify-center items-center">
                    <div className="h-[6vw] w-[90%] flex justify-center items-center relative cursor-pointer overflow-hidden rounded-lg">
                      <img src="/cover2.jpg" alt="" />
                    </div>
                  </div>
                  <div className="h-[7vw] w-[50%] flex flex-col justify-start items-center">
                    <div className=" h-[4vw] w-full flex flex-col justify-start items-start ">
                      <h4 className="text-[0.7vw] text-zinc-100 istok-web-regular mt-3">
                        Cyberpunk 2077
                      </h4>
                      <h4 className="text-[0.5vw] text-zinc-400 istok-web-regular mt-1">
                        CD Projekt Red
                      </h4>
                    </div>
                    <div className="h-[3vw] w-full flex justify-between items-center">
                      <h4 className="text-[0.7vw] text-zinc-100 istok-web-regular mt-1">
                        $59.99
                      </h4>
                      <button className="h-[2vw] w-[7vw] rounded-lg bg-[#D65F30] flex justify-center items-center cursor-pointer shadow-xl hover:shadow-none hover:bg-white hover:text-black transition-all duration-300 text-white istok-web-regular mr-5">
                        Buy now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[90vh] w-[28vw] flex flex-col justify-between items-center mr-11">
            <div className="_Downloads_ h-[45vh] w-full">
              <div className="h-[4vh] w-full flex justify-start items-center">
                <h4 className="text-[1vw] text-zinc-100 istok-web-regular">
                  Downloads
                </h4>
              </div>
              <div className="h-[3.5vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                <div className="h-[2.8vw] w-[2.8vw] flex justify-center items-center cursor-pointer overflow-hidden rounded-full ml-4 bg-[#461F35]">
                  <img src="/eldenring_1.jpg" alt="" className=" " />
                </div>
                <div>
                  <h4 className="text-[0.8vw] text-zinc-100 istok-web-regular ml-4">
                    Elden Ring
                  </h4>
                  <h4 className="text-[0.5vw] text-zinc-400 istok-webregular ml-4">
                    56.8 GB
                  </h4>
                </div>
                <div className="h-[2vw] w-[17vw] text-zinc-400 istok-web-regular flex justify-end items-center cursor-pointer ">
                  <h4 className="hover:text-white transition-all duration-300">
                    Launch <i class="ri-arrow-right-s-fill"></i>
                  </h4>
                </div>
              </div>
              <div className="h-[3.5vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                <div className="h-[2.8vw] w-[2.8vw] flex justify-center items-center cursor-pointer overflow-hidden rounded-full ml-4 bg-[#461F35]">
                  <img src="/eldenring_1.jpg" alt="" className=" " />
                </div>
                <div>
                  <h4 className="text-[0.8vw] text-zinc-100 istok-web-regular ml-4">
                    Elden Ring
                  </h4>
                  <h4 className="text-[0.5vw] text-zinc-400 istok-webregular ml-4">
                    56.8 GB
                  </h4>
                </div>
                <div className="h-[2vw] w-[17vw] text-zinc-400 istok-web-regular flex justify-end items-center cursor-pointer ">
                  <h4 className="hover:text-white transition-all duration-300">
                    Launch <i class="ri-arrow-right-s-fill"></i>
                  </h4>
                </div>
              </div>
              <div className="h-[3.5vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                <div className="h-[2.8vw] w-[2.8vw] flex justify-center items-center cursor-pointer overflow-hidden rounded-full ml-4 bg-[#461F35]">
                  <img src="/eldenring_1.jpg" alt="" className=" " />
                </div>
                <div>
                  <h4 className="text-[0.8vw] text-zinc-100 istok-web-regular ml-4">
                    Elden Ring
                  </h4>
                  <h4 className="text-[0.5vw] text-zinc-400 istok-webregular ml-4">
                    56.8 GB
                  </h4>
                </div>
                <div className="h-[2vw] w-[17vw] text-zinc-400 istok-web-regular flex justify-end items-center cursor-pointer ">
                  <h4 className="hover:text-white transition-all duration-300">
                    Launch <i class="ri-arrow-right-s-fill"></i>
                  </h4>
                </div>
              </div>
              <div className="h-[3.5vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                <div className="h-[2.8vw] w-[2.8vw] flex justify-center items-center cursor-pointer overflow-hidden rounded-full ml-4 bg-[#461F35]">
                  <img src="/eldenring_1.jpg" alt="" className=" " />
                </div>
                <div>
                  <h4 className="text-[0.8vw] text-zinc-100 istok-web-regular ml-4">
                    Elden Ring
                  </h4>
                  <h4 className="text-[0.5vw] text-zinc-400 istok-webregular ml-4">
                    56.8 GB
                  </h4>
                </div>
                <div className="h-[2vw] w-[17vw] text-zinc-400 istok-web-regular flex justify-end items-center cursor-pointer ">
                  <h4 className="hover:text-white transition-all duration-300">
                    Launch <i class="ri-arrow-right-s-fill"></i>
                  </h4>
                </div>
              </div>
            </div>
            <div className="_bookmark_ h-[45vh] w-full ">
              <div className="h-[4vh] w-full flex justify-start items-center">
                <h4 className="text-[1vw] text-zinc-100 istok-web-regular">
                  Bookmarks
                </h4>
              </div>
              <div className="h-[3.5vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                <div className="h-[2.8vw] w-[2.8vw] flex justify-center items-center cursor-pointer overflow-hidden rounded-full ml-4 bg-[#461F35]">
                  <img src="/eldenring_1.jpg" alt="" className=" " />
                </div>
                <div>
                  <h4 className="text-[0.8vw] text-zinc-100 istok-web-regular ml-4">
                    Elden Ring
                  </h4>
                  <h4 className="text-[0.5vw] text-zinc-400 istok-webregular ml-4">
                    56.8 GB
                  </h4>
                </div>
                <div className="h-[2vw] w-[17vw] text-zinc-400 istok-web-regular flex justify-end items-center cursor-pointer ">
                  <h4 className="hover:text-white transition-all duration-300">
                    Install <i class="ri-download-fill"></i>
                  </h4>
                </div>
              </div>
              <div className="h-[3.5vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                <div className="h-[2.8vw] w-[2.8vw] flex justify-center items-center cursor-pointer overflow-hidden rounded-full ml-4 bg-[#461F35]">
                  <img src="/eldenring_1.jpg" alt="" className=" " />
                </div>
                <div>
                  <h4 className="text-[0.8vw] text-zinc-100 istok-web-regular ml-4">
                    Elden Ring
                  </h4>
                  <h4 className="text-[0.5vw] text-zinc-400 istok-webregular ml-4">
                    56.8 GB
                  </h4>
                </div>
                <div className="h-[2vw] w-[17vw] text-zinc-400 istok-web-regular flex justify-end items-center cursor-pointer ">
                  <h4 className="hover:text-white transition-all duration-300">
                    Install <i class="ri-download-fill"></i>
                  </h4>
                </div>
              </div>
              <div className="h-[3.5vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                <div className="h-[2.8vw] w-[2.8vw] flex justify-center items-center cursor-pointer overflow-hidden rounded-full ml-4 bg-[#461F35]">
                  <img src="/eldenring_1.jpg" alt="" className=" " />
                </div>
                <div>
                  <h4 className="text-[0.8vw] text-zinc-100 istok-web-regular ml-4">
                    Elden Ring
                  </h4>
                  <h4 className="text-[0.5vw] text-zinc-400 istok-webregular ml-4">
                    56.8 GB
                  </h4>
                </div>
                <div className="h-[2vw] w-[17vw] text-zinc-400 istok-web-regular flex justify-end items-center cursor-pointer ">
                  <h4 className="hover:text-white transition-all duration-300">
                    Install <i class="ri-download-fill"></i>
                  </h4>
                </div>
              </div>
              <div className="h-[3.5vw] w-full flex justify-start items-center bg-[#461F35] rounded-lg mt-4 shadow-xl hover:shadow-none transition-all duration-300">
                <div className="h-[2.8vw] w-[2.8vw] flex justify-center items-center cursor-pointer overflow-hidden rounded-full ml-4 bg-[#461F35]">
                  <img src="/eldenring_1.jpg" alt="" className=" " />
                </div>
                <div>
                  <h4 className="text-[0.8vw] text-zinc-100 istok-web-regular ml-4">
                    Elden Ring
                  </h4>
                  <h4 className="text-[0.5vw] text-zinc-400 istok-webregular ml-4">
                    56.8 GB
                  </h4>
                </div>
                <div className="h-[2vw] w-[17vw] text-zinc-400 istok-web-regular flex justify-end items-center cursor-pointer ">
                  <h4 className="hover:text-white transition-all duration-300">
                    Install <i class="ri-download-fill"></i>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default Profile;
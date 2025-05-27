import React, { useState } from "react";
import GameCard from "./GameCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// about_the_game
// : 
// "The apocalypse came and a huge number of zombies invaded the planet. Help the main character protect himself and his refuge from the attack of bloodthirsty monsters.<br />\r\n<br />\r\nThe game is a 2D platformer with a side view of the game. The main task of the game is to protect the checkpoint from bloodthirsty zombies and prevent them from breaking inside, because there are people in the building, and the walking dead are eager to taste their brains. Destroying the wave of enemies after the wave, we collect the fallen coins, on which we can buy improved weapons and supplies for them, as well as we can upgrade the structure.<br />\r\n<br />\r\nGame Features:<br />\r\n- 4 types of weapons<br />\r\n- Old school gameplay<br />\r\n- Pixel art graphics"
// appid
// : 
// 1211800
// capsule_image
// : 
// "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1211800/capsule_231x87.jpg?t=1577701236"
// description
// : 
// "The game is a 2D platformer with a side view of the game. The main task of the game is to protect the checkpoint from bloodthirsty zombies and prevent them from breaking inside"
// genres
// : 
// (4) ['Action', 'Adventure', 'Indie', 'Simulation']
// header_image
// : 
// "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1211800/header.jpg?t=1577701236"
// lastUpdated
// : 
// "2025-05-26T13:18:39.792Z"
// mac_requirements
// : 
// []
// name
// : 
// "Live checkpoint"
// pc_requirements
// : 
// {minimum: '<strong>Minimum:</strong><br><ul class="bb_ul"><li…>Storage:</strong> 8 MB available space</li></ul>'}
// platforms
// : 
// {windows: true, mac: false, linux: false}
// portraitUrl
// : 
// "https://cdn2.steamgriddb.com/grid/a2e03ee2dcf2a4270725d336fbb3db30.jpg"
// price
// : 
// "₹ 31"
// release_date
// : 
// "30 Dec, 2019"
// supported_languages
// : 
// "English"
// website
// : 
// "No website available"
// __v
// : 
// 0
// _id
// : 
// "68346a2f957dffa8f3b73097"


const gamess = [
    { title: "Elden Ring", image: "../GameList/er.jpg", image2: "../GameList/er1.jpg", price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Counter Strike 2", image: "../GameList/cs2.jpg", image2: "../GameList/er1.jpg", price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Cyberpunk 2077", image: "../GameList/cyberpunk.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Stray", image: "../GameList/stray.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Red Dead Redemption 2", image: "../GameList/cyberpunk.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "The Witcher 3", image: "../GameList/stray.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99",  discount:"-20%"  },
    { title: "Counter Strike 2", image: "../GameList/cs2.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Cyberpunk 2077", image: "../GameList/cyberpunk.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
  ];

  const truncate = (str, maxLength) => {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

const GameList = ({games, title, nextClass, prevClass }) => {
    const [activeIndex, setActiveIndex] = useState(null);
  return (
    <>
      <div className="py-8 text-white">
      <div className="h-[3vh] w-[87vw] relative flex justify-between items-center font-[gilroy-bold] ml-7 ">
        <h1 className="text-xl">{title}</h1>
        <div className="h-[3vh] w-[10vw] flex justify-between items-center ">
            <img src="../GameList/arrow.svg" alt="" className={`scale-x-[-1] ${prevClass} cursor-pointer`} />
            <h4 className=" h-[3vh] flex cursor-pointer font-[gilroy-bold] text-zinc-600 text-lg">
              Learn More 
            </h4>
            <img src="../GameList/arrow.svg" alt="" className={`${nextClass} cursor-pointer`} />
        </div>
      </div>

      {/* Navigation Buttons */}

      <Swiper
        modules={[Navigation]}
        slidesPerView={7}
        spaceBetween={20}
        navigation={{
          nextEl: `.${nextClass}`,
          prevEl: `.${prevClass}`
        }}
        loop={true}
        className="mt-5 w-[87vw] cursor-pointer"
      >
        {games.map((game, index) => (
          <SwiperSlide
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`transition-all duratio-500 rounded-xl `}
            style={{
              backgroundImage: `url(${
                activeIndex === index ? game.header_image : game.header_image
              }) `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "all 0.5s",
              width: activeIndex === index ? "25svw" : "11svw",
              height: '33svh',
              position: "relative",
            }}
          >
            {activeIndex === index && (
              <div className="absolute bottom-0 w-full bg-black/20 backdrop-blur-sm h-[10svh] rounded-b-xl flex justify-center items-center">
                <div className="h-[10svh] w-[60%] flex flex-col justify-center items-start">
                  <h1 className="font-[gilroy-ebold] text-xl ml-7">{truncate(game.name, 13)}</h1>
                  <img src="../Slider/win.svg" alt="" className="ml-7 py-2"/>
                </div>
                <div className="h-[10svh] w-[40%] flex justify-center items-center">
                  {/* <div className="h-[50%] w-[45%] rounded-sm bg-[#8AFF41] flex justify-center items-center">
                    <h1 className="font-[gilroy-ebold] text-black text-xl">{game.discount}</h1>
                  </div> */}
                    <div className="h-[60%] w-[45%] flex flex-col justify-center items-center">
                      {/* <h1 className="font-[gilroy-ebold] text-[#696969] line-through">{game.price2}</h1> */}
                      <h1 className="font-[gilroy-ebold] text-[#8AFF41]">{game.price}</h1>
                    </div>
                </div>
              </div>
            )}
            <div
              className={`transition-all duration-300  ${
                activeIndex === index ? "opacity-0" : "opacity-100 delay-170"
              }`}
            >
              <GameCard image={game.portraitUrl} title={game.title} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom Navigation Buttons Overlapping the Slides */}
      {/* <button className="swiper-button-prev absolute left-2 top-1/2 transform -translate-y-1/2 p-3 z-10">
        ◀
      </button>
      <button className="swiper-button-next absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 p-3 rounded-full z-10">
        ▶
      </button> */}
    </div>
    </>
  );
};

export default GameList;

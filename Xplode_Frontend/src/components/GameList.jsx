import React, { useState } from "react";
import GameCard from "./GameCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const games = [
    { title: "Elden Ring", image: "../GameList/er.jpg", image2: "../GameList/er1.jpg", price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Counter Strike 2", image: "../GameList/cs2.jpg", image2: "../GameList/er1.jpg", price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Cyberpunk 2077", image: "../GameList/cyberpunk.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Stray", image: "../GameList/stray.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Red Dead Redemption 2", image: "../GameList/cyberpunk.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "The Witcher 3", image: "../GameList/stray.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99",  discount:"-20%"  },
    { title: "Counter Strike 2", image: "../GameList/cs2.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
    { title: "Cyberpunk 2077", image: "../GameList/cyberpunk.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
  ];

const GameList = ({ title, nextClass, prevClass }) => {
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
                activeIndex === index ? game.image2 : game.image2
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
                  <h1 className="font-[gilroy-ebold] text-xl ml-7">{game.title}</h1>
                  <img src="../Slider/win.svg" alt="" className="ml-7 py-2"/>
                </div>
                <div className="h-[10svh] w-[40%] flex justify-center items-center">
                  <div className="h-[50%] w-[45%] rounded-sm bg-[#8AFF41] flex justify-center items-center">
                    <h1 className="font-[gilroy-ebold] text-black text-xl">{game.discount}</h1>
                  </div>
                    <div className="h-[60%] w-[45%] flex flex-col justify-center items-center">
                      <h1 className="font-[gilroy-ebold] text-[#696969] line-through">{game.price2}</h1>
                      <h1 className="font-[gilroy-ebold] text-[#8AFF41]">{game.price1}</h1>
                    </div>
                </div>
              </div>
            )}
            <div
              className={`transition-all duration-300  ${
                activeIndex === index ? "opacity-0" : "opacity-100 delay-170"
              }`}
            >
              <GameCard image={game.image} title={game.title} />
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

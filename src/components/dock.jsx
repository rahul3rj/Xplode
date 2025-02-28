import React, { useState } from "react";
import GameCard from "./GameCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const games = [
  { title: "Elden Ring", image: "/eldenring_1.jpg", image2: "/eldenring.jpg" },
  { title: "Counter Strike 2", image: "/cs2.jpg", image2: "/cs2_2.jpg" },
  { title: "Cyberpunk 2077", image: "/cyberpunk.jpg", image2: "/cover2.jpg" },
  { title: "Stray", image: "/stray.jpg", image2: "/stray_2.jpg" },
  { title: "Red Dead Redemption 2", image: "/rdr2.jpg", image2: "/rdr2_2.jpg" },
  { title: "The Witcher 3", image: "/tw3.jpg", image2: "/tw3_2.jpg" },
  { title: "Counter Strike 2", image: "/cs2.jpg", image2: "/cs2_2.jpg" },
  { title: "Cyberpunk 2077", image: "/cyberpunk.jpg", image2: "/cover2.jpg" },
];

const GameList = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="py-8 text-white">
      <div className="h-[3vh] relative flex justify-between items-center ">
        <h1>Special offers</h1>
        <div className="h-[3vh] w-[4vw] absolute right-0 ">
          <h4 className=" h-[3vh] flex cursor-pointer  ">
            More <img src="/arrow-right-s-fill.png" className="swiper" alt="" />
          </h4>
        </div>
      </div>

      {/* Navigation Buttons */}

      <Swiper
        modules={[Navigation]}
        slidesPerView={7}
        spaceBetween={20}
        navigation={{
          nextEl: ".swiper ",
        }}
        loop={true}
        className="mt-5 w-[83.5vw]"
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
              width: activeIndex === index ? "500px" : "11vw",
              height: "300px",
            }}
          >
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
  );
};

export default GameList;

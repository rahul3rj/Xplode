import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ColorThief from "colorthief";

const games = [
  {
    id: 1,
    name: "Battlefield 6",
    genre: "Action",
    price: 9.99,
    image:
      "https://cdn2.steamgriddb.com/grid/46d61708b6409c01ad805ecd19412ee2.png",
    genres: ["Action", "Shooter", "Strategy"],
  },
  {
    id: 2,
    name: "Hollow Knight: Silksong",
    genre: "Action",
    price: 9.99,
    image:
      "https://cdn2.steamgriddb.com/grid/07ccf28cb6dbef86e74719cdaa9d5ccf.png",
    genres: ["Action", "Adventure", "Indie"],
  },
  {
    id: 3,
    name: "Silent Hill f",
    genre: "Action",
    price: 9.99,
    image:
      "https://cdn2.steamgriddb.com/grid/ae799a1b4b5506498f327a8ff4321e26.png",
    genres: ["Action", "Adventure", "Indie"],
  },
  {
    id: 4,
    name: "FC 26",
    genre: "Action",
    price: 9.99,
    image:
      "https://cdn2.steamgriddb.com/grid/20d6c9a0fb579f81c9f1b85f184de63c.png",
    genres: ["Action", "Adventure", "Indie"],
  },
  {
    id: 5,
    name: "Expedition 33",
    genre: "Action",
    price: 9.99,
    image:
      "https://cdn2.steamgriddb.com/grid/a52e58b45fd7a3aba9a4f3a2be22641a.png",
    genres: ["Action", "Adventure", "Indie"],
  },
  {
    id: 6,
    name: "Wuchang",
    genre: "Action",
    price: 9.99,
    image:
      "https://cdn2.steamgriddb.com/grid/2a1d2b03eef0986c480474465d2d1627.png",
    genres: ["Action", "Adventure", "Indie"],
  },
  {
    id: 7,
    name: "Black Myth Wukong",
    genre: "Action",
    price: 9.99,
    image:
      "https://cdn2.steamgriddb.com/grid/90b35ab68bb1e05f34fba6635fc5de89.png",
    genres: ["Action", "Adventure", "Indie"],
  },
  {
    id: 8,
    name: "Hades 2",
    genre: "Action",
    price: 9.99,
    image:
      "https://cdn2.steamgriddb.com/grid/1932eb09e7e5600512f545751521d1bc.png",
    genres: ["Action", "Adventure", "Indie"],
  },
];

const GameList2 = () => {
  const [colorPalette, setColorPalette] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        // yaha backend se image la ke lagana hai
        img.src = games[0].image;

        img.onload = () => {
          const colorThief = new ColorThief();
          // Get palette of 5 colors instead of just dominant color
          const palette = colorThief.getPalette(img, 5);
          // Sort colors from lightest to darkest
          const sortedPalette = [...palette].sort((a, b) => {
            const brightnessA = (a[0] * 299 + a[1] * 587 + a[2] * 114) / 1000;
            const brightnessB = (b[0] * 299 + b[1] * 587 + b[2] * 114) / 1000;
            return brightnessB - brightnessA;
          });
          setColorPalette(sortedPalette);
        };
      } catch (error) {
        console.error("Error extracting colors:", error);
      }
    };

    loadImage();
  }, [games[0].image]);

  const gradientBackground = colorPalette
    ? `linear-gradient(to bottom, 
          rgba(54, 20, 65, 0.4)
      )`
    : "linear-gradient(to bottom, rgba(69, 40, 10, 0.3), rgba(69, 40, 10, 0.7))";

  const bgcircle = colorPalette
    ? `linear-gradient(to bottom, 
          rgba(${colorPalette[3][0]}, ${colorPalette[3][1]}, ${colorPalette[3][2]}, 0.8)
      )`
    : "linear-gradient(to bottom, rgba(69, 40, 10, 0.3), rgba(69, 40, 10, 0.7))";

  return (
    <div className="h-[56vh] w-full py-8">
      <div className="h-[3vh] w-[87vw] relative flex justify-between items-center font-[gilroy-bold] ml-7 mb-5">
        <h1 className="text-xl text-white">New Releases</h1>
        <div className="h-[3vh] w-[10vw] flex justify-between items-center ">
          <img
            src="../GameList/arrow.svg"
            alt=""
            className="scale-x-[-1] com-swiper-prev cursor-pointer hover:bg-white/10 transition-all duration-200 rounded-full p-1"
          />
          <h4 className=" h-[3vh] flex cursor-pointer font-[gilroy-bold] text-zinc-600 text-sm hover:text-zinc-400 transition-all duration-200">
            Learn More
          </h4>
          <img
            src="../GameList/arrow.svg"
            alt=""
            className="com-swiper-next cursor-pointer hover:bg-white/10 hover:scale-103 transition-all duration-200 rounded-full p-1"
          />
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        slidesPerView={4}
        spaceBetween={16}
        loop={true}
        navigation={{
          nextEl: ".com-swiper-next ",
          prevEl: ".com-swiper-prev",
        }}
        className="w-[87svw] h-[40svh]"
      >
        {games.map((idx) => (
          <SwiperSlide key={idx}>
            <div
              className="w-full h-full flex flex-col justify-start items-center rounded-lg overflow-hidden relative group cursor-pointer"
              
            >
              <div className="absolute h-[40vh] w-[50vh] bottom-7 -z-20 rounded-full bg-[#A641FF] blur-[52px]" style={{
                background: bgcircle,
              }}></div>
              <div className="h-[55%] absolute top-0 left-0 overflow-hidden">
                <img
                  src={games[idx.id - 1].image}
                  alt=""
                  className="w-[100%] h-[100%] object-cover group-hover:scale-105 transition-all duration-400 ease-in-out"
                />
              </div>
              <div className="h-[45%] w-full absolute bottom-0 flex flex-col justify-between items-start p-5" style={{
                background: "rgba(9, 32, 37, 0)",
                backdropFilter: "blur(52px)",
              }}>
                <h1 className="w-full text-white text-md font-[gilroy-bold] mb-2 truncate">
                  {idx.name}
                </h1>
                <div className="w-full flex flex-row justify-start items-center gap-2 truncate">
                  {(games[idx.id - 1]?.genres || []).map((tag, tagIdx) => (
                    <h2
                      key={tagIdx}
                      className={`text-white text-[10px] font-[gilroy] cursor-pointer px-4 py-1 rounded-full transition-all duration-600 ${
                        tagIdx === 0
                          ? "bg-[#A641FF]/50"
                          : "hover:bg-[#A641FF]/50 "
                      }`}
                      onMouseEnter={(e) => {
                        // Remove highlight from all tags in this card
                        e.currentTarget.parentElement
                          .querySelectorAll("h2")
                          .forEach((el) =>
                            el.classList.remove("bg-[#A641FF]/50")
                          );
                        // Highlight hovered tag
                        e.currentTarget.classList.add("bg-[#A641FF]/50");
                      }}
                      onMouseLeave={(e) => {
                        // Remove highlight from all tags in this card
                        e.currentTarget.parentElement
                          .querySelectorAll("h2")
                          .forEach((el) =>
                            el.classList.remove("bg-[#A641FF]/50")
                          );
                        // Re-highlight first tag
                        e.currentTarget.parentElement
                          .querySelector("h2")
                          .classList.add("bg-[#A641FF]/50");
                      }}
                    >
                      {tag}
                    </h2>
                  ))}
                </div>
                <h2 className="absolute right-5 top-4 w-8 h-8 text-white text-xs font-[gilroy] bg-[#A641FF]/50 hover:bg-[#A641FF]/70 transition-all duration-200 rounded-full flex items-center justify-center cursor-pointer shadow-[0px_4px_30.600000381469727px_0px_rgba(0,0,0,0.25)] backdrop-blur-xs">
                  <i class="ri-add-line text-white"></i>
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GameList2;

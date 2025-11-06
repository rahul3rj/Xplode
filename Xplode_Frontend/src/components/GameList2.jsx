import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ColorThief from "colorthief";
import GameList2Card from "./GameList2Card";

const games = [
  {
    id: 2807960,
    name: "Battlefield 6",
    price: 9.99,
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2807960/c12d12ce3c7d217398d3fcad77427bfc9d57c570/header.jpg?t=1762193857",
    genres: ["Action", "Shooter", "Strategy"],
    publisher: "Electronic Arts",
  },
  {
    id: 1030300,
    name: "Hollow Knight: Silksong",
    price: 9.99,
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/7983574d464e6559ac7e24275727f73a8bcca1f3/header.jpg?t=1756994410",
    genres: ["Action", "Adventure", "Indie"],
    publisher: "Team Cherry",
  },
  {
    id: 2947440,
    name: "Silent Hill f",
    price: 9.99,
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2947440/7e5d923ac622bd1775ebc9b5d4b5b0a24bf5ed40/header.jpg?t=1758772827",
    genres: ["Horror", "Adventure", "Survival"],
    publisher: "Konami Digital Entertainment",
  },
  {
    id: 3405690,
    name: "FC 26",
    price: 9.99,
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3405690/2d96aa1b06e453cd62dae9029d412f19e61932c3/header.jpg",
    genres: ["Sports", "Simulation"],
    publisher: "Electronic Arts",
  },
  {
    id: 1903340,
    name: "Expedition 33",
    price: 9.99,
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1903340/header.jpg",
    genres: ["RPG", "Adventure", "Fantasy"],
    publisher: "Sandfall Interactive",
  },
  {
    id: 2277560,
    name: "Wuchang",
    price: 9.99,
    image:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2277560/7dbbe47ac51463eb1627581f5c048b94ef856d5c/header.jpg?t=1758569545",
    genres: ["Action", "RPG", "Historical"],
    publisher: "Leenzee Games",
  },
  {
    id: 2358720,
    name: "Black Myth: Wukong",
    price: 9.99,
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
    genres: ["Action", "RPG", "Mythology"],
    publisher: "Game Science",
  },
  {
    id: 1145350,
    name: "Hades II",
    price: 9.99,
    image:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/header.jpg",
    genres: ["Action", "Roguelike", "Indie"],
    publisher: "Supergiant Games",
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
          <h4
            className="h-[3vh] flex cursor-pointer font-[gilroy-bold] text-zinc-600 text-sm hover:text-zinc-400 transition-all duration-200"
            onClick={() => window.location.reload()}
          >
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
        loop={false}
        navigation={{
          nextEl: ".com-swiper-next ",
          prevEl: ".com-swiper-prev",
        }}
        className="w-[87svw] h-[40svh]"
      >
        {games.map((game) => (
          <SwiperSlide key={game.id}>
            <GameList2Card game={game} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GameList2;

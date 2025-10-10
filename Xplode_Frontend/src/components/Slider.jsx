"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import axios from "../utils/axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


const slides = [
  {
    appid: "3595270",
    title: "Modern Warfare 3",
    description:
      "Modern Warfare 3 (2023) is a fast-paced FPS where Task Force 141 battles Makarov in an intense campaign with evolved multiplayer.",
    price: "₹2999 INR",
    image: "https://cdn2.steamgriddb.com/grid/976e6cb2f9caea318b775f8ab300ebd1.jpg",
    screenshots: ["../Slider/ss1.jpg", "../Slider/ss2.jpg"],
    bg: "https://cdn2.steamgriddb.com/hero/3d705444b5b160e095cf9b5aa760c5b4.jpg",
    tags: ["FPS", "Shooter", "Action"]
  },
  {
    appid: "1091500",
    title: "Cyberpunk 2077",
    description:
      "Cyberpunk 2077 is an open-world RPG set in Night City, offering high-octane action, deep storylines, and immersive world-building.",
    price: "₹3499 INR",
    image: "https://cdn2.steamgriddb.com/grid/8c048326e93a94589190693897ce3456.jpg",
    screenshots: ["../Slider/ss1.jpg", "../Slider/ss2.jpg"],
    bg: "https://cdn2.steamgriddb.com/hero/1d82e3e1aab5070e537de3d55beac634.png",
    tags: ["RPG", "Open-World", "Action"]
  },
  {
    appid: "1245620",
    title: "Elden Ring",
    description:
      "Elden Ring is an epic action RPG from FromSoftware, featuring vast exploration, intense combat, and deep lore.",
    price: "₹3999 INR",
    image: "https://cdn2.steamgriddb.com/grid/d00afdeafe11d50fcecedac911e278aa.png",
    screenshots: ["../Slider/ss1.jpg", "../Slider/ss2.jpg"],
    bg: "https://cdn2.steamgriddb.com/hero/b751142d1db64622c665bf40839bba13.png",
    tags: ["Souls-Like", "RPG", "Action"]
  },
  {
    appid: "2322010",
    title: "God of War Ragnarok",
    description:
      "Embark on a mythological journey with Kratos and Atreus in God of War Ragnarok, featuring intense battles and gripping storytelling.",
    price: "₹4499 INR",
    image: "https://cdn2.steamgriddb.com/grid/245c498e6413ad98feab0bb3ae6275d5.png",
    screenshots: ["../Slider/ss1.jpg", "../Slider/ss2.jpg"],
    bg: "https://cdn2.steamgriddb.com/hero/a1fffd8b6b0fe8cd5bb2b1efb059fbe9.png",
    tags: ["Adventure", "RPG", "Action"]
  }
];



export default function GameSlider({games}) {
  const [sliderGames, setsliderGames] = useState([]);

  const navigate = useNavigate();

 const fetchGames = async () => {
  try {
    const updatedData = games.map((item) => {
      // appid base matching
      const slideMatch =
        slides.find(
          (s) =>
            String(s.appid) === String(item.appid) ||
            String(s.appid) === String(item.steam_appid)
        ) || {};

      return {
        ...item,
        image:
          slideMatch.image ||
          item.header_image ||
          "/default-slider.jpg",
      };
    });

    setsliderGames(updatedData);
    console.log(updatedData);
  } catch (err) {
    console.error("Failed to fetch games:", err);
  }
};

  useEffect(() => {
    fetchGames();
  }, []);
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
  };

  const truncateWords = (text, n = 20) =>
    text.split(/\s+/).filter(Boolean).slice(0, n).join(" ") +
    (text.split(/\s+/).length > n ? "..." : "");

  return (
    // <div className="w-full h-screen flex justify-center items-center bg-[#2D142C]">
    <Swiper
      slidesPerView={1}
      effect="fade"
      autoplay={{ delay: 10000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination, EffectFade]}
      className="h-[55vh] w-[87vw]  flex"
    >
      
      {sliderGames.map((slide, index) => (
        
        <SwiperSlide key={index} className="flex flex-col gap-6">
          {/* Left: Main Image */}
          <div className="h-[50vh] w-[54.5vw] bg-zinc-600 rounded-xl overflow-hidden cursor-pointer">
            <img
            onClick={() => navigate(`/game/${slides[index].appid}`)}
              src={slides[index].image}
              alt={slides[index].title}
              className="w-full h-full object-cover rounded-xl "
            />
          </div>

          {/* Right: Game Details */}
          <div className="h-[50vh] w-[30vw] flex absolute top-0 right-[2vw]">
            <div className="h-[50vh] w-[31vw] flex relative">
              {/* Game details card */}
              <div className="h-[33vh] w-[29vw] bg-[#121921] mx-2 rounded-xl absolute z-10 font-[gilroy-bold] p-9 flex flex-col justify-center">
                <h1 className="text-white font-[gilroy-bold] text-xl mb-4">
                  {slides[index].title}
                </h1>

                <p className="text-[#DEDEDE] font-[gilroy] text-xs mb-4">
                  {slides[index].description
                    ? truncateWords(stripHtml(slides[index].description), 18)
                    : ""}
                </p>
                  {/* yaha genre le ke aa */}
                  <div className="flex flex-wrap gap-2 mb-4">

                {slides[index].tags.map((tag, tagIdx) => (
                    <h2
                      key={tagIdx}
                      className={`text-zinc-300 text-xs font-[gilroy] cursor-pointer px-4 py-1 rounded-full transition-all duration-600 ${
                        tagIdx === 0
                          ? "bg-[#A641FF]/50 text-white"
                          : "hover:bg-[#A641FF]/50 hover:text-white"
                      }`}
                      onMouseEnter={(e) => {
                        // Remove highlight from all tags in this card
                        e.currentTarget.parentElement
                          .querySelectorAll("h2")
                          .forEach((el) =>
                            el.classList.remove("bg-[#A641FF]/50", "text-white")
                          );
                        // Highlight hovered tag
                        e.currentTarget.classList.add("bg-[#A641FF]/50", "text-white");
                      }}
                      onMouseLeave={(e) => {
                        // Remove highlight from all tags in this card
                        e.currentTarget.parentElement
                          .querySelectorAll("h2")
                          .forEach((el) =>
                            el.classList.remove("bg-[#A641FF]/50", "text-white")
                          );
                        // Re-highlight first tag
                        const first = e.currentTarget.parentElement.querySelector("h2");
                        first.classList.add("bg-[#A641FF]/50", "text-white");
                      }}
                    >
                      {tag}
                    </h2>
                  ))}
                  </div>
                <div className="flex items-center justify-between">
                  <button className="py-3 px-7 bg-[#A641FF]/50 hover:bg-[#A641FF]/70 transition-all duration-200 font-[gilroy] transition-colors text-white text-xs rounded-full cursor-pointer gap-2 flex shadow-xl">
                    <i class="ri-add-line text-white"></i>Add Game
                  </button>
                  {/* image sorce change ya add hoga on the basis of which platforms this game supports  */}
                  <img
                    src="../Slider/win.svg"
                    className="h-8 w-auto"
                    alt="Windows Platform"
                  />
                </div>
                <img
                  src={slides[index].bg}
                  alt="Background Pattern"
                  className="absolute inset-0 h-full w-full rounded-xl object-cover -z-10"
                />
                <img
                  src="../Slider/details1.svg"
                  alt="Background Pattern"
                  className="absolute inset-0 h-full w-full rounded-xl object-cover -z-10 opacity-80"
                />
              </div>

              {/* Screenshot thumbnails */}
              <div className="h-[17vh] w-[30vw] absolute bottom-0 flex justify-center items-end gap-4">
                <div className="h-[15vh] w-[14vw] bg-[#121921] rounded-xl relative">
                  <img
                    src={slide.screenshots[0].path_thumbnail}
                    className="h-full w-full object-cover absolute top-0 left-0 hover:scale-110 hover:z-10 rounded-xl transition-transform duration-300 ease-in-out cursor-pointer hover:shadow-2xl" 
                    alt={`${slide.name} Screenshot 1`}
                  />
                </div>
                <div className="h-[15vh] w-[14vw] bg-[#121921] rounded-xl relative">
                  <img
                    src={slide.screenshots[1].path_thumbnail}
                    className="h-full w-full object-cover absolute top-0 left-0 hover:scale-110 hover:z-10 rounded-xl transition-transform duration-300 ease-in-out cursor-pointer hover:shadow-2xl"
                    alt={`${slide.name} Screenshot 2`}
                  />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    // </div>
  );
}

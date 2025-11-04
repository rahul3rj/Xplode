import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ColorThief from "colorthief";
import {
  addToLibrary,
  requireAuth,
  getUserLibrary,
  removeFromLibrary,
} from "../utils/addToLibrary";
import { Link, useNavigate } from "react-router-dom";

const gamesArr = [
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

const GameList2 = ({ games, title, nextClass, prevClass }) => {
  const [colorPalette, setColorPalette] = useState(null);
  const [userLibrary, setUserLibrary] = useState([]);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const handleAddToLibrary = async (e, game) => {
    e.stopPropagation();
    e.preventDefault();

    if (!requireAuth()) return;

    try {
      const gameData = {
        steam_appid: game.steam_appid || game.appid,
        name: game.name || game.title,
        portrait_image:
          game.portrait_image || game.capsule_image || game.header_image,
        hero_image: {
          url:
            game.hero_image?.[0]?.url ||
            game.background_raw ||
            game.background ||
            game.header_image ||
            game.image,
          thumb:
            game.hero_image?.[0]?.thumb ||
            game.background ||
            game.header_image ||
            game.image,
        },
        developers: game.developers || game.developer,
        publishers: game.publishers || [game.publisher],
        categories: game.categories || [],
        movies: game.movies || [],
      };

      const result = await addToLibrary(gameData);

      // ✅ YEH LINE ADD KARO - Local state update karo
      setUserLibrary((prev) => [...prev, result.game || gameData]);

      alert("Game added to your library!");
    } catch (error) {
      console.error("Failed to add game to library:", error);
      alert(error.message || "Failed to add game to library");
    }
  };

  const handleRemoveFromLibrary = async (e, game) => {
    e.stopPropagation();
    e.preventDefault();

    if (!requireAuth()) return;

    if (
      !window.confirm(
        "Are you sure you want to remove this game from your library?"
      )
    ) {
      return;
    }

    try {
      await removeFromLibrary(game.steam_appid || game.appid);

      // Update local state
      setUserLibrary((prev) =>
        prev.filter(
          (libGame) => libGame.steam_appid !== (game.steam_appid || game.appid)
        )
      );
    } catch (error) {
      console.error("Failed to remove game from library:", error);
      alert(error.message || "Failed to remove game from library");
    }
  };

  const fetchUserLibrary = async () => {
    try {
      if (requireAuth()) {
        const library = await getUserLibrary();
        setUserLibrary(library);
      }
    } catch (error) {
      console.error("Failed to fetch user library:", error);
    }
  };

  const handleClick = (tag) => {
    navigate("/search", {
      state: {
        initialTags: [tag],
      },
    });
  };

  useEffect(() => {
    fetchUserLibrary(); // Add this function call
  }, [games]);

  const isGameInLibrary = (gameAppId) => {
    return userLibrary.some((game) => game.steam_appid === gameAppId);
  };

  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        // yaha backend se image la ke lagana hai
        img.src = gamesArr[0].image;

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
  }, [gamesArr[0].image]);

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
        <h1 className="text-xl text-white">{title}</h1>
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
        {games.map((game, idx) => (
          <SwiperSlide key={idx}>
            <Link
              key={`${game.steam_appid}`}
              to={`/game/${game.steam_appid}`}
              className="w-full h-full flex flex-col justify-start items-center rounded-lg overflow-hidden relative group cursor-pointer"
            >
              <div
                className="absolute h-[40vh] w-[50vh] bottom-7 -z-20 rounded-full bg-[#A641FF] blur-[52px]"
                style={{
                  background: bgcircle,
                }}
              ></div>
              <div className="h-[55%] absolute top-0 left-0 overflow-hidden">
                <img
                  src={game.header_image}
                  alt=""
                  className="w-[100%] h-[100%] object-cover group-hover:scale-105 transition-all duration-400 ease-in-out"
                />
              </div>
              <div
                className="h-[45%] w-full absolute bottom-0 flex flex-col justify-between items-start p-5"
                style={{
                  background: "rgba(9, 32, 37, 0)",
                  backdropFilter: "blur(52px)",
                }}
              >
                <h1 className="w-full text-white text-md font-[gilroy-bold] mb-2 truncate">
                  {game.name}
                </h1>
                <div className="w-full flex flex-row justify-start items-center gap-2 truncate">
                  {(game.genres || []).map((tag, tagIdx) => (
                    <h2
                      key={tagIdx}
                      onClick={() => handleClick(tag)}
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
                <button
                  onClick={(e) =>
                    isGameInLibrary(game.steam_appid || game.appid)
                      ? handleRemoveFromLibrary(e, game)
                      : handleAddToLibrary(e, game)
                  }
                  className={`absolute right-5 top-4 w-8 h-8 text-white text-xs font-[gilroy]  transition-all duration-200 rounded-full flex items-center justify-center cursor-pointer shadow-[0px_4px_30.600000381469727px_0px_rgba(0,0,0,0.25)] backdrop-blur-xs ${
                    isGameInLibrary(game.steam_appid || game.appid)
                      ? "bg-red-500/50 hover:bg-red-500/70"
                      : "bg-[#A641FF]/50 hover:bg-[#A641FF]/70"
                  } `}
                >
                  <i
                    className={`ri-${
                      isGameInLibrary(game.steam_appid || game.appid)
                        ? "delete-bin-line"
                        : "add-line"
                    } text-white`}
                  ></i>
                </button>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GameList2;

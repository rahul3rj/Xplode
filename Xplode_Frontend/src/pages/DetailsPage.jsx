import { React, useState } from "react";
import { addToLibrary, requireAuth } from "../utils/addToLibrary";
import SsSlider from "../components/SsSlider";
import DetailsCommunity from "../components/DetailsCommunity";
import axios from "../utils/axios";
import Footer from "../components/Footer";
import { useEffect } from "react";
import GameList from "../components/GameList";
import { useNavigate, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Likepercent from "../components/Likepercent";

const GameListTitle = ["Trending Games", "Top Games", "Top Records"];

const DetailsPage = () => {
  const { appid } = useParams(); // ✅ param name fix
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [randomIndex1, setRandomIndex1] = useState(-1);
  const [randomIndex2, setRandomIndex2] = useState(-1);
  const [randomIndex3, setRandomIndex3] = useState(-1);
  const [randomIndex4, setRandomIndex4] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/games/game/${appid}`); // ✅ hits backend
        console.log(res.data);
        setGame(res.data); // ✅ single object
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [appid]);

  const handleAddToLibrary = async () => {
    if (!requireAuth()) return;
    try {
      const gameData = {
        steam_appid: game.steam_appid,
        name: game.name,
        portrait_image: game.portrait_image || game.capsule_image,
        hero_image: {
          url:
            game.hero_image[0].url ||
            game.background_raw ||
            game.background ||
            game.header_image,
          thumb:
            game.hero_image[0].thumb || game.background || game.header_image,
        },
        developers: game.developers,
        publishers: game.publishers,
        categories: game.categories || [],
        movies: game.movies || [],
      };

      const result = await addToLibrary(gameData);
      // Show success message
      alert("Game added to your library!");
    } catch (error) {
      console.error("Failed to add game to library:", error);
      alert(error.message || "Failed to add game to library");
    }
  };

  function sanitizeAbout(html) {
    if (!html) return [];

    // 1. Remove video + image containers
    let cleaned = html
      .replace(/<span class="bb_img_ctn">.*?<\/span>/gs, "")
      .replace(/<video.*?<\/video>/gs, "")
      .replace(/<source.*?>/gs, "");

    // 2. Convert line breaks
    cleaned = cleaned
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?p.*?>/gi, "\n");

    // 3. Keep headings but simplify
    cleaned = cleaned
      .replace(/<\/?strong>/gi, "**") // mark headings with **
      .replace(/<\/?u>/gi, "")
      .replace(/<\/?h\d.*?>/gi, "**"); // h1–h6 as heading

    // 4. Strip remaining HTML
    cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, "");

    // 5. Split lines
    return cleaned
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  function getRandomIndex(max) {
    if (!max || max <= 0) return -1;
    return Math.floor(Math.random() * max);
  }

  useEffect(() => {
    if (game?.hero_image?.length > 0) {
      setRandomIndex1(getRandomIndex(game.hero_image.length));
      setRandomIndex2(getRandomIndex(game.hero_image.length));
      setRandomIndex3(getRandomIndex(game.hero_image.length));
      setRandomIndex4(getRandomIndex(game.hero_image.length));
    }
  }, [game?.steam_appid]);

  function getGameImage(game, randomIndex, fallbackType) {
    if (game?.hero_image?.length > 0 && randomIndex >= 0) {
      return game.hero_image[randomIndex]?.url;
    }

    // Fallbacks
    if (fallbackType === 1) {
      return game?.background_raw || game?.capsule || game?.header;
    } else if (fallbackType === 2) {
      return game?.background || game?.background_raw || game?.header;
    } else if (fallbackType === 3) {
      return game?.header_image || game?.capsule || game?.background_raw;
    } else if (fallbackType === 4) {
      return game?.capsule_image || game?.header || game?.capsule;
    }

    return ""; // nothing available
  }

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("/games/home"); // assuming it's a GET now
        setGames(response.data);
      } catch (err) {
        console.error("Failed to fetch games:", err);
      }
    };
    fetchGames();
  }, []);

  const sliderGames = games.filter((game) => game.category === "sliders");
  const trendingGames = games.filter((game) => game.category === "trending");
  const topGames = games.filter((game) => game.category === "top_games");
  const topRecordGames = games.filter(
    (game) => game.category === "top_records"
  );

  const [isActive, setIsActive] = useState(null);

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <img src="../Preloader.svg" alt="loading" className="h-10" />
      </div>
    );
  }

  if (err || !game) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
        <p className="text-white/80">Kuch gadbad: {err || "Game not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#A641FF] rounded text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-auto w-full px-5 ">
      <div className="h-[85svh] w-full flex justify-center items-center rounded-xl relative overflow-hidden mb-15">
        <img
          src={getGameImage(game, randomIndex1, 1)}
          className="h-full w-full object-cover"
          alt=""
        />
        <div className=" absolute z-5 h-full w-[40%] left-0 rounded-l-[13px] bg-[linear-gradient(292deg,_rgba(28,0,0,0)_25.78%,_rgba(42,20,72,0.60)_76.18%)] "></div>
        <div className="absolute z-10 h-[10svh] w-full top-0 flex justify-between items-end px-10">
          <div className="h-[6vh] w-[14vh] flex justify-between items-center">
            <div className="h-[6vh] w-[6vh] rounded-full bg-black/30 hover:bg-black flex items-center justify-center">
              <i class="ri-arrow-left-s-line text-white text-xl"></i>
            </div>
            <div className="h-[6vh] w-[6vh] rounded-full bg-black/30 hover:bg-black flex items-center justify-center">
              <i class="ri-arrow-right-s-line text-white text-xl"></i>
            </div>
          </div>
          <div className="h-[6vh] w-[18vh] flex justify-between items-center">
            <img src="../Slider/win.svg" alt="" />
            <img src="../Slider/PlayStation.svg" alt="" />
            <img src="../Slider/Xbox.svg" alt="" />
          </div>
        </div>
        <div className="absolute z-10 top-30 left-0 px-10 h-[30svh] w-auto flex flex-col items-start justify-center gap-2">
          <h1 className="text-5xl font-[gilroy-ebold] text-white ">
            {game.name}
          </h1>
          <div className="h-[3svh] w-[15vw] flex justify-between items-center">
            <div className="h-[2svh] w-[5svw]"></div>
            {game.genres.map((genre, idx) => (
              <h4
                key={idx}
                className="text-xs font-[gilroy-ebold] text-[#837F7F] cursor-pointer hover:text-[#A641FF]"
              >
                {genre}
              </h4>
            ))}

            <div className="h-[2svh] w-[5svw] flex items-center justify-center">
              <Rating
                name="read-only"
                value={4} // Set to 5 for a 5-star rating
                readOnly
                precision={0.5}
                emptyIcon={
                  <StarIcon
                    style={{ opacity: 0.55, stroke: "#C7C3C3", strokeWidth: 1 }}
                    sx={{ fontSize: "2vh" }}
                  />
                }
                icon={<StarIcon sx={{ fontSize: "2vh" }} />}
              />
            </div>
            <h4 className="text-xs font-[gilroy-ebold] text-[#837F7F] cursor-pointer hover:text-[#A641FF]">
              Dark fantasy{" "}
            </h4>
            <h4 className="text-xs font-[gilroy-ebold] text-[#837F7F] cursor-pointer hover:text-[#A641FF]">
              RPG{" "}
            </h4>
            <h4 className="text-xs font-[gilroy-ebold] text-[#837F7F] cursor-pointer hover:text-[#A641FF]">
              Difficult{" "}
            </h4>
          </div>
          <div className="h-[30%] w-[20vw]">
            <p className="text-xs font-[gilroy] text-[#C7C3C3]">
              {game.description}
            </p>
          </div>
          <div className="h-[20%] w-auto flex justify-between items-center gap-2 mt-2">
            <button className="h-[6vh] w-[10vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg">
              Buy now <i class="ri-arrow-down-wide-line ml-1"></i>
            </button>
            <div className="h-[6vh] w-[6vh] rounded-full bg-black/40 flex items-center justify-center hover:bg-black cursor-pointer shadow-lg">
              <img src="../HomePage/Heart.svg" alt="" className="p-2" />
            </div>
            <div className="h-[6vh] w-[6vh] rounded-full bg-black/40 flex items-center justify-center hover:bg-black cursor-pointer shadow-lg">
              <img src="../HomePage/Shopping Cart.svg" alt="" className="p-2" />
            </div>
            <div
              onClick={handleAddToLibrary}
              className="h-[6vh] w-[6vh] rounded-full bg-black/40 flex items-center justify-center hover:bg-black cursor-pointer shadow-lg"
            >
              <i class="ri-add-line text-white"></i>
            </div>
          </div>
        </div>
        <div className="absolute z-30 bottom-0 h-[30svh] w-[60vw]">
          <SsSlider screenshots={game.screenshots} movies={game.movies} />
        </div>
      </div>
      <div className="h-[50svh] w-full flex justify-between items-center mb-15">
        <div className="h-full w-[58svw] flex flex-col justify-center items-start gap-3">
          <h1 className="text-lg font-[gilroy-bold] text-white">Buy Now</h1>
          <div className="h-[10svh] w-full rounded-sm flex justify-between items-center bg-[#A641FF]/20 px-5">
            <div className="flex justify-center items-center gap-5">
              <div className="h-[6svh] w-[6svh] flex items-center justify-center">
                <img src="/Slider/Steam.svg" alt="" className="h-full" />
              </div>
              <h1 className="text-md font-[gilroy-bold] text-white">
                Steam Store
              </h1>
            </div>
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() =>
                  window.open(
                    `https://store.steampowered.com/app/${game.steam_appid}/`
                  )
                }
                className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2"
              >
                <i class="ri-download-line"></i> Download
              </button>
              <div className="cursor-pointer flex justify-center items-center">
                <i class="ri-arrow-down-s-fill text-white text-2xl"></i>
              </div>
            </div>
          </div>
          <div className="h-[10svh] w-full rounded-sm flex justify-between items-center bg-[#A641FF]/20 px-5">
            <div className="flex justify-center items-center gap-5">
              <div className="h-[6svh] w-[6svh] flex items-center justify-center">
                <img src="/Slider/Epic.svg" alt="" className="h-full" />
              </div>
              <h1 className="text-md font-[gilroy-bold] text-white">
                Epic Game Store
              </h1>
            </div>
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() =>
                  window.open(
                    `https://store.epicgames.com/en-US/p/grand-theft-auto-v`
                  )
                }
                className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2"
              >
                <i class="ri-download-line"></i> Download
              </button>
              <div className="cursor-pointer flex justify-center items-center">
                <i class="ri-arrow-down-s-fill text-white text-2xl"></i>
              </div>
            </div>
          </div>
          <div className="h-[10svh] w-full rounded-sm flex justify-between items-center bg-[#A641FF]/20 px-5">
            <div className="flex justify-center items-center gap-5">
              <div className="h-[6svh] w-[6svh] flex items-center justify-center">
                <img src="/Slider/PlayStation.svg" alt="" className="h-full" />
              </div>
              <h1 className="text-md font-[gilroy-bold] text-white">
                PlayStation Store
              </h1>
            </div>
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() =>
                  window.open(
                    `https://www.playstation.com/en-us/games/dark-souls-iii/`
                  )
                }
                className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2"
              >
                <i class="ri-download-line"></i> Download
              </button>
              <div className="cursor-pointer flex justify-center items-center">
                <i class="ri-arrow-down-s-fill text-white text-2xl"></i>
              </div>
            </div>
          </div>
          <div className="h-[10svh] w-full rounded-sm flex justify-between items-center bg-[#A641FF]/20 px-5">
            <div className="flex justify-center items-center gap-5">
              <div className="h-[6svh] w-[6svh] flex items-center justify-center">
                <img src="/Slider/Xbox.svg" alt="" className="h-full" />
              </div>
              <h1 className="text-md font-[gilroy-bold] text-white">
                Xbox Store
              </h1>
            </div>
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() =>
                  window.open(
                    `https://www.xbox.com/en-US/games/store/dark-souls-iii-deluxe-edition/C23CWXL81H3L/0001`
                  )
                }
                className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2"
              >
                <i class="ri-download-line"></i> Download
              </button>
              <div className="cursor-pointer flex justify-center items-center">
                <i class="ri-arrow-down-s-fill text-white text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-[26svw] flex flex-col justify-center items-start gap-3">
          <h1 className="text-lg font-[gilroy-bold] text-white">Reviews</h1>
          <div className="h-[5svh] w-full flex justify-start items-center ">
            <div className="w-[7svw]">
              <h3 className="text-[#76808C] font-[gilroy-ebold] text-sm ">
                All Time
              </h3>
            </div>
            <div className="h-full w-[12svw] flex justify-between items-center">
              <Likepercent />
            </div>
            <div className="flex justify-end items-center h-full w-auto">
              <h4 className="text-[#A641FF] font-[gilroy-ebold] text-sm ">
                534,170 Reviews
              </h4>
            </div>
          </div>
          <div className="h-[5svh] w-full flex justify-start items-center ">
            <div className="w-[7svw]">
              <h3 className="text-[#76808C] font-[gilroy-ebold] text-sm ">
                Release Date
              </h3>
            </div>
            <h3 className="text-white font-[gilroy-ebold] text-sm">
              {game.release_date}
            </h3>
          </div>
          <div className="h-[5svh] w-full flex justify-start items-center ">
            <div className="w-[7svw]">
              <h3 className="text-[#76808C] font-[gilroy-ebold] text-sm ">
                Developer
              </h3>
            </div>
            {game.developers.map((developer, idx) => (
              <h3
                key={idx}
                className=" text-[#A641FF] font-[gilroy-ebold] text-sm truncate cursor-pointer"
              >
                {developer}
              </h3>
            ))}
          </div>
          <div className="h-[5svh] w-full flex justify-start items-center ">
            <div className="w-[7svw]">
              <h3 className="text-[#76808C] font-[gilroy-ebold] text-sm ">
                Publisher
              </h3>
            </div>
            {game.publishers.map((publisher, idx) => (
              <h3
                key={idx}
                className="w-[18svw] text-[#A641FF] font-[gilroy-ebold] text-sm truncate cursor-pointer"
              >
                {publisher}
              </h3>
            ))}
          </div>
          <div className="h-[10svh] w-full flex flex-col justify-between items-start ">
            <div className="w-[7svw]">
              <h3 className="text-[#76808C] font-[gilroy-ebold] text-sm ">
                Popular Tags
              </h3>
            </div>
            <div className="h-[5svh] w-full flex justify-start items-center gap-2">
              <div className="h-[5svh] w-auto flex justify-center items-center bg-[#A641FF] rounded-sm px-3 cursor-pointer">
                <h3 className="text-white font-[gilroy-bold] text-xs">
                  Souls-Like
                </h3>
              </div>
              <div className="h-[5svh] w-auto flex justify-center items-center bg-[#A641FF] rounded-sm px-3 cursor-pointer">
                <h3 className="text-white font-[gilroy-bold] text-xs">RPG</h3>
              </div>
              <div className="h-[5svh] w-auto flex justify-center items-center bg-[#A641FF] rounded-sm px-3 cursor-pointer">
                <h3 className="text-white font-[gilroy-bold] text-xs">
                  Dark Fantasy
                </h3>
              </div>
              <div className="h-[5svh] w-auto flex justify-center items-center bg-[#A641FF] rounded-sm px-3 cursor-pointer">
                <h3 className="text-white font-[gilroy-bold] text-xs">
                  Open-World
                </h3>
              </div>
              <div className="h-[5svh] w-auto flex justify-center items-center bg-[#A641FF] rounded-sm px-2 cursor-pointer">
                <i class="ri-add-line text-white text-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[50svh] w-full flex justify-start items-start mb-15">
        <DetailsCommunity game={game} />
      </div>
      <div className="h-[25svh] w-full flex justify-start items-start mb-15 rounded-xl overflow-hidden cursor-pointer">
        <div className="h-full w-full flex justify-center items-center bg-black relative">
          <img
            src={getGameImage(game, randomIndex2, 2)}
            alt=""
            className="h-full w-full object-cover rounded-lg mix-blend-luminosity  "
          />

          <div className="h-full w-full absolute z-10 top-0 left-0 bg-black/40 shadow-[inset_0_4px_79.2px_0_rgba(255,41,195,0.50)] rounded-xl"></div>
          <div className="h-full w-full absolute z-10 top-0 left-0 flex justify-center items-center">
            <h1 className="text-white font-[gilroy] font-[600] text-3xl">
              Check out the entire {game.publishers[0]} collection on{" "}
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#FF29C3_53.65%,#A641FF_100%)]">
                Xplode
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div className="h-auto w-full flex flex-col justify-center items-start gap-3 mb-15">
        <div className="h-[5vh] w-full flex justify-start items-center">
          <h4 className="font-[gilroy-bold] text-white ">About This Game</h4>
        </div>
        <div className="h-[1px] w-full bg-[linear-gradient(90deg,#FF29C3_53.65%,#A641FF_100%)] opacity-50"></div>
        <div className="h-[40vh] w-full rounded-xl overflow-hidden">
          <img
            src={getGameImage(game, randomIndex3, 3)}
            className="h-full w-full object-cover"
            alt=""
          />
        </div>
        <div className="min-h-[45vh] w-full flex flex-col justify-center p-10 items-start gap-4">
          {sanitizeAbout(game.about_the_game).map((line, idx) => {
            const isHeading = line.startsWith("**") && line.endsWith("**");
            const text = isHeading ? line.replace(/\*\*/g, "") : line;

            return (
              <p
                key={idx}
                className={`font-[gilroy] text-sm ${
                  isHeading
                    ? "text-white font-[700] text-base mt-4"
                    : "text-[#C7C3C3]"
                }`}
              >
                {text}
              </p>
            );
          })}
        </div>
        <div className="h-[40vh] w-full rounded-xl overflow-hidden">
          <img
            src={getGameImage(game, randomIndex4, 4)}
            className="h-full w-full object-cover"
            alt=""
          />
        </div>
        <div className="h-[1px] w-full bg-[linear-gradient(90deg,#FF29C3_53.65%,#A641FF_100%)] opacity-50 "></div>
      </div>

      <div className="h-[50vh] w-full flex flex-col justify-start items-start gap-5 mb-5">
        <h4 className="font-[gilroy-bold] text-white text-md ">
          System Requirements
        </h4>
        <div className="h-auto w-full flex justify-between items-center">
          {game.pc_requirements?.minimum && (
            <div className="h-auto w-[45%]">
              <h4 className="font-[gilroy-bold] text-[#D7D7D7] text-sm mb-3">
                MINIMUM:
              </h4>
              <ul className="list-disc list-inside text-white text-xs font-[gilroy] ml-4">
                {game.pc_requirements?.minimum
                  ? game.pc_requirements.minimum
                      .match(/<li>(.*?)<\/li>/g) // sab <li> extract karo
                      ?.map((item, idx) => {
                        const clean = item
                          .replace(/<\/?li>/g, "")
                          .replace(/<br>/g, "");
                        const labelMatch = clean.match(
                          /<strong>(.*?)<\/strong>/
                        );
                        const label = labelMatch ? labelMatch[1] : null;
                        const value = clean
                          .replace(/<strong>.*?<\/strong>/, "")
                          .trim();
                        return (
                          <li key={idx} className="mb-2">
                            {label ? (
                              <>
                                <span className="font-[600] text-white">
                                  {label}:
                                </span>{" "}
                                <span className="text-[#9F9B9B]">{value}</span>
                              </>
                            ) : (
                              <span className="text-[#9F9B9B]">{clean}</span>
                            )}
                          </li>
                        );
                      })
                  : "No data available"}
              </ul>
            </div>
          )}
          {game.pc_requirements?.recommended && (
            <div className="h-auto w-[45%]">
              <h4 className="font-[gilroy-bold] text-[#D7D7D7] text-sm mb-3">
                RECOMMENDED:
              </h4>
              <ul className="list-disc list-inside text-white text-xs font-[gilroy] ml-4">
                {game.pc_requirements?.recommended
                  ? game.pc_requirements.recommended
                      .match(/<li>(.*?)<\/li>/g) // sab <li> extract karo
                      ?.map((item, idx) => {
                        const clean = item
                          .replace(/<\/?li>/g, "")
                          .replace(/<br>/g, "");
                        const labelMatch = clean.match(
                          /<strong>(.*?)<\/strong>/
                        );
                        const label = labelMatch ? labelMatch[1] : null;
                        const value = clean
                          .replace(/<strong>.*?<\/strong>/, "")
                          .trim();
                        return (
                          <li key={idx} className="mb-2">
                            {label ? (
                              <>
                                <span className="font-[600] text-white">
                                  {label}:
                                </span>{" "}
                                <span className="text-[#9F9B9B]">{value}</span>
                              </>
                            ) : (
                              <span className="text-[#9F9B9B]">{clean}</span>
                            )}
                          </li>
                        );
                      })
                  : "No data available"}
              </ul>
            </div>
          )}
        </div>
        {/* <div className="h-auto w-full flex justify-center items-center">
          <p className="text-xs text-[#9F9B9B] font-[gilroy]">
            DARK SOULS® III & ©BANDAI NAMCO Entertainment Inc. / ©2011-2016
            FromSoftware, Inc.
          </p>
        </div> */}
      </div>
      <div className=" h-auto w-full">
        {topRecordGames.length > 0 && (
          <GameList
            games={topRecordGames}
            title={GameListTitle[2]}
            nextClass="game-list-swiper-next-2"
            prevClass="game-list-swiper-prev-2"
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DetailsPage;

import { React, useState } from "react";

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
                {genre.description}
              </h4>
            ))}

            <div className="h-[2svh] w-[5svw] flex items-center justify-center">
              <Rating
                name="read-only"
                value={4} // Set to 5 for a 5-star rating
                readOnly
                precision={0.5}
                emptyIcon={<StarIcon style={{ opacity: 0.55, stroke: '#C7C3C3', strokeWidth: 1 }} sx={{ fontSize: '2vh' }} />}
                icon={<StarIcon sx={{ fontSize: '2vh' }} />}
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
            <div className="h-[6vh] w-[6vh] rounded-full bg-black/40 flex items-center justify-center hover:bg-black cursor-pointer shadow-lg">
              <i class="ri-add-line text-white"></i>
            </div>
          </div>
        </div>
        <div className="absolute z-30 bottom-0 h-[30svh] w-[60vw]">
          <SsSlider screenshots={game.screenshots} />
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
              <button onClick={() => window.open(`https://store.steampowered.com/app/374320/`)} className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2">
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
              <button onClick={() => window.open(`https://store.epicgames.com/en-US/p/grand-theft-auto-v`)} className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2">
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
              <button onClick={() => window.open(`https://www.playstation.com/en-us/games/dark-souls-iii/`)} className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2">
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
              <button onClick={() => window.open(`https://www.xbox.com/en-US/games/store/dark-souls-iii-deluxe-edition/C23CWXL81H3L/0001`)} className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2">
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
              {game.release_date?.coming_soon ? "Coming Soon" : game.release_date?.date}
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
        <DetailsCommunity />
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
        <div className="h-[45vh] w-full flex flex-col justify-center items-start gap-7">
          <p className="font-[gilroy] text-sm text-white ">
            Get the DARK SOULS™ III Season Pass now and challenge yourself with
            all the available content!
          </p>
          <p className="font-[gilroy] text-sm text-white ">
            Winner of gamescom award 2015 "Best RPG" and over 35 E3 2015 Awards
            and Nominations.
          </p>
          <p className="font-[gilroy] text-sm text-white ">
            DARK SOULS™ III continues to push the boundaries with the latest,
            ambitious chapter in the critically-acclaimed and genre-defining
            series.
          </p>
          <p className="font-[gilroy] text-sm text-white ">
            As fires fade and the world falls into ruin, journey into a universe
            filled with more colossal enemies and environments. Players will be
            immersed into a world of epic atmosphere and darkness through faster
            gameplay and amplified combat intensity. Fans and newcomers alike
            will get lost in the game hallmark rewarding gameplay and immersive
            graphics.
          </p>
          <p className="font-[gilroy] text-sm text-white ">
            Now only embers remain… Prepare yourself once more and Embrace The
            Darkness!
          </p>


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
          <div className="h-auto w-[45%]">
            <h4 className="font-[gilroy-bold] text-[#D7D7D7] text-sm mb-3">
              Minimum
            </h4>
            <ul className="list-disc list-inside text-[#9F9B9B] text-xs font-[gilroy] ml-4 ">
              <li className="mb-2">
                <span className="font-[600] text-white">OS *:</span> Windows 7
                SP1 64bit, Windows 8.1 64bit Windows 10 64bit
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Processor:</span> Intel
                Core i3-2100 / AMD® FX-6300
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Memory:</span> 4 GB RAM
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Graphics:</span> NVIDIA®
                GeForce GTX 750 Ti / ATI Radeon HD 7950
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">DirectX:</span> Version
                11
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Network:</span>{" "}
                Broadband Internet connection
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Storage:</span> 25 GB
                available space
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Sound Card:</span>{" "}
                DirectX 11 sound device
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Additional Notes:</span>{" "}
                Internet connection required for online play and product
                activation
              </li>
            </ul>
          </div>
          <div className="h-auto w-[45%]">
            <h4 className="font-[gilroy-bold] text-[#D7D7D7] text-sm mb-3">
              RECOMMENDED:
            </h4>
            <ul className="list-disc list-inside text-[#9F9B9B] text-xs font-[gilroy] ml-4 ">
              <li className="mb-2">
                <span className="font-[600] text-white">OS *:</span> Windows 7
                SP1 64bit, Windows 8.1 64bit Windows 10 64bit
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Processor:</span> Intel
                Core i7-3770 / AMD® FX-8350
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Memory:</span> 8 GB RAM
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Graphics:</span> NVIDIA®
                GeForce GTX 970 / ATI Radeon R9 series
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">DirectX:</span> Version
                11
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Network:</span>{" "}
                Broadband Internet connection
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Storage:</span> 25 GB
                available space
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Sound Card:</span>{" "}
                DirectX 11 sound device
              </li>
              <li className="mb-2">
                <span className="font-[600] text-white">Additional Notes:</span>{" "}
                Internet connection required for online play and product
                activation
              </li>
            </ul>
          </div>
        </div>
        <div className="h-auto w-full flex justify-center items-center">
          <p className="text-xs text-[#9F9B9B] font-[gilroy]">
            DARK SOULS® III & ©BANDAI NAMCO Entertainment Inc. / ©2011-2016
            FromSoftware, Inc.
          </p>
        </div>
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

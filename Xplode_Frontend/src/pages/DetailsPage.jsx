import { React, useState } from "react";
import {
  addToLibrary,
  requireAuth,
  getUserLibrary,
  removeFromLibrary,
} from "../utils/addToLibrary";
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
import GameList2 from "../components/GameList2";

const GameListTitle = [
  "Trending Games",
  "Top Games",
  "Top Records",
  "New Releases",
];

const DetailsPage = () => {
  const { appid } = useParams(); // ✅ param name fix
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const [userLibrary, setUserLibrary] = useState([]);
  const [game, setGame] = useState(null);
  const [randomIndex1, setRandomIndex1] = useState(-1);
  const [randomIndex2, setRandomIndex2] = useState(-1);
  const [randomIndex3, setRandomIndex3] = useState(-1);
  const [randomIndex4, setRandomIndex4] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [userReaction, setUserReaction] = useState(null);
  const [likeStats, setLikeStats] = useState({ likes: 0, dislikes: 0 });
  const [loadingReaction, setLoadingReaction] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/games/game/${appid}`);
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

  const handleReaction = async (reactionType) => {
    if (!requireAuth()) return;

    setLoadingReaction(true);
    try {
      const response = await axios.post(
        `/reaction/${appid}/reaction`,
        {
          reaction: reactionType,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setUserReaction(response.data.reaction);

      // Update stats
      const statsResponse = await axios.get(`reaction/${appid}/stats`);
      setLikeStats(statsResponse.data);
    } catch (error) {
      console.error("Reaction error:", error);
      alert("Failed to update reaction");
    } finally {
      setLoadingReaction(false);
    }
  };

  const fetchReactionData = async () => {
    try {
      // Fetch stats (public)
      const statsResponse = await axios.get(`/reaction/${appid}/stats`);
      setLikeStats(statsResponse.data);

      // Fetch user reaction (if logged in)
      if (requireAuth()) {
        const reactionResponse = await axios.get(
          `/reaction/${appid}/my-reaction`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserReaction(reactionResponse.data.reaction);
      }
    } catch (error) {
      console.error("Error fetching reaction data:", error);
    }
  };

  // const fetchComments = async () => {
  //   try {
  //     const response = await axios.get(`/reaction/${appid}/comments`);
  //     setComments(response.data.comments);
  //   } catch (error) {
  //     console.error("Error fetching comments:", error);
  //   }
  // };

  // const handleAddComment = async () => {
  //   if (!requireAuth()) return;
  //   if (!newComment.trim()) {
  //     alert("Please enter a comment");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `/reaction/${appid}/comments`,
  //       {
  //         comment: newComment,
  //         rating: commentRating,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       }
  //     );

  //     setComments((prev) => [response.data.comment, ...prev]);
  //     setNewComment("");
  //     setCommentRating(5);
  //     alert("Comment added successfully!");
  //   } catch (error) {
  //     console.error("Error adding comment:", error);
  //     alert("Failed to add comment");
  //   }
  // };

  // UseEffects
  useEffect(() => {
    fetchReactionData();
  }, [appid]);

  const calculateLikePercentages = () => {
    const totalReactions = likeStats.likes + likeStats.dislikes;

    if (totalReactions === 0) {
      return { likePercentage: 0, dislikePercentage: 0 };
    }

    const likePercentage = Math.round((likeStats.likes / totalReactions) * 100);
    const dislikePercentage = 100 - likePercentage;

    return { likePercentage, dislikePercentage };
  };

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

  useEffect(() => {
    fetchUserLibrary(); // Add this function call
  }, [games]);
  const isGameInLibrary = (gameAppId) => {
    return userLibrary.some((game) => game.steam_appid === gameAppId);
  };
  const calculateRating = () => {
    // Priority order: steam, esrb, pegi, etc.
    if (game?.ratings?.steam?.rating) {
      const steamRating = parseInt(game.ratings.steam.rating);
      // Convert to 5-star scale (assuming steam rating is out of 10)
      return steamRating / 2;
    }

    if (game?.ratings?.esrb?.rating) {
      const esrbRatings = {
        e: 5, // Everyone
        e10: 4, // Everyone 10+
        t: 3, // Teen
        m: 2, // Mature
        a: 1, // Adult
      };
      return esrbRatings[game.ratings.esrb.rating.toLowerCase()] || 3;
    }

    if (game?.ratings?.pegi?.rating) {
      const pegiRating = parseInt(game.ratings.pegi.rating);
      // Convert PEGI (3,7,12,16,18) to 5-star scale
      return Math.min(5, Math.max(1, pegiRating / 4));
    }

    // Default rating agar koi data na mile
    return 4;
  };

  const handleClick = (tag) => {
    navigate("/search", {
      state: {
        initialTags: [tag],
      },
    });
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
    // Use deterministic image indices for each slot instead of random picks.
    // This ensures each placement shows a different image (0..3) when available
    // and falls back using modulo when hero_image length is smaller.
    const len = game?.hero_image?.length || 0;
    if (len > 0) {
      const idxFor = (slot) => (len > slot ? slot : slot % len);
      setRandomIndex1(idxFor(4));
      setRandomIndex2(idxFor(1));
      setRandomIndex3(idxFor(2));
      setRandomIndex4(idxFor(3));
    } else {
      setRandomIndex1(-1);
      setRandomIndex2(-1);
      setRandomIndex3(-1);
      setRandomIndex4(-1);
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

  const topGames = games.filter((game) => game.category === "top_games");
  const newReleases = games.filter((game) => game.category === "New_Releases");
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
        <p className="text-white/80">This game is not available right now. {err || "Game not found"}</p>
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
          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game?.steam_appid}/library_hero_2x.jpg`}
          onError={(e) => {
            e.currentTarget.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game?.steam_appid}/library_hero.jpg`;
            e.currentTarget.onerror = null; // Prevent infinite loops
          }}
          className="h-full w-full object-cover"
          alt=""
        />
        <div className=" absolute z-5 h-full w-[40%] left-0 rounded-l-[13px] bg-[linear-gradient(292deg,_rgba(28,0,0,0)_25.78%,_rgba(42,20,72,0.60)_76.18%)] "></div>
        <div className="absolute z-10 h-[10svh] w-full top-0 flex justify-between items-end px-10">
          <div className="h-[6vh] w-[14vh] flex justify-between items-center">
            {/* <div className="h-[6vh] w-[6vh] rounded-full bg-black/30 hover:bg-black flex items-center justify-center">
              <i class="ri-arrow-left-s-line text-white text-xl"></i>
            </div>
            <div className="h-[6vh] w-[6vh] rounded-full bg-black/30 hover:bg-black flex items-center justify-center">
              <i class="ri-arrow-right-s-line text-white text-xl"></i>
            </div> */}
          </div>
          <div className="h-[6vh] w-[18vh] flex justify-between items-center">
            <img src="../Slider/win.svg" alt="" />
            <img src="../Slider/PlayStation.svg" alt="" />
            <img src="../Slider/Xbox.svg" alt="" />
          </div>
        </div>
        <div className="absolute z-10 top-20 left-0 px-10 h-[43svh] w-[35vw] flex flex-col items-start justify-between gap-2">
          <div className="h-[21svh] w-auto flex justify-center items-center overflow-hidden">
            {/* image logo from steamgridDB */}
            <img
              src={
                appid === "2807960"
                  ? "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2807960/65db0d8229b34cd5f3c17b4ec6c0d94724ea1b30/logo.png"
                  : appid === "1808500"
                  ? "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1808500/fba0705a67bb6e1a51bdb1d87102a3be18d024c0/logo.png"
                  : `https://cdn.cloudflare.steamstatic.com/steam/apps/${game?.steam_appid}/logo.png`
              }
              alt=""
              className="h-full object-contain "
            />
          </div>
          {/* <h1 className="text-5xl font-[gilroy-ebold] text-white ">
            {game.name}
          </h1> */}
          <div className="h-[3svh] w-[25vw] flex justify-start items-center gap-2">
            {/* <div className="h-[2svh] w-[5svw]"></div> */}
            <div className="h-[2svh] w-[5svw] flex items-center justify-center">
              <Rating
                name="read-only"
                value={calculateRating()} // Set to 5 for a 5-star rating
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
            {game.genres.slice(0, 3).map((genre, idx) => (
              <h4
                key={idx}
                onClick={() => handleClick(genre)}
                className={`text-xs font-[gilroy-bold] text-white cursor-pointer hover:bg-[#A641FF]/70 bg-[#A641FF]/50 px-3 py-1 rounded-full backdrop-blur-sm ${
                  idx === 2 ? "truncate max-w-[10vw]" : ""
                }`}
              >
                {genre}
              </h4>
            ))}
          </div>
          <div className="h-auto w-[25vw]">
            <p className="text-xs font-[gilroy] text-zinc-300 line-clamp-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {game.description}
            </p>
          </div>
          <div className="h-auto w-auto flex justify-between items-center gap-2 mt-2">
            <button
              onClick={(e) =>
                isGameInLibrary(game.steam_appid || game.appid)
                  ? handleRemoveFromLibrary(e, game)
                  : handleAddToLibrary(e, game)
              }
              className={`py-3 px-7 ${
                isGameInLibrary(game.steam_appid || game.appid)
                  ? "bg-red-500/50 hover:bg-red-500/70"
                  : "bg-[#A641FF]/50 hover:bg-[#A641FF]/70"
              } transition-all duration-200 font-[gilroy] text-white text-xs rounded-full cursor-pointer gap-2 flex shadow-xl`}
            >
              <i
                className={`ri-${
                  isGameInLibrary(game.steam_appid || game.appid)
                    ? "delete-bin-line"
                    : "add-line"
                } text-white`}
              ></i>
              {isGameInLibrary(game.steam_appid || game.appid)
                ? "Remove Game"
                : "Add Game"}
            </button>
            <div className="h-[6vh] w-[6vh] rounded-full bg-black/40 flex items-center justify-center hover:bg-black cursor-pointer shadow-lg backdrop-blur-sm">
              <img src="../HomePage/Shopping Cart.svg" alt="" className="p-2" />
            </div>
            <div
              onClick={() => !loadingReaction && handleReaction("like")}
              className={`h-[6vh] w-[12vh] rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors gap-2 backdrop-blur-sm ${
                userReaction === "like"
                  ? "bg-[#B561FF]/50"
                  : "bg-black/40 hover:bg-black"
              } ${loadingReaction ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <i
                className={`text-white text-lg ${
                  userReaction === "like"
                    ? "ri-thumb-up-fill"
                    : "ri-thumb-up-line"
                }`}
              ></i>
              <span className="text-white text-sm font-[gilroy-bold]">
                {likeStats.likes || 0}
              </span>
            </div>

            {/* Dislike button - UPDATED WITH REAL FUNCTIONALITY */}
            <div
              onClick={() => !loadingReaction && handleReaction("dislike")}
              className={`h-[6vh] w-[6vh] rounded-full flex items-center backdrop-blur-sm justify-center cursor-pointer shadow-lg transition-colors duration-300 ease-in-out ${
                userReaction === "dislike"
                  ? "bg-[#B42323]/50"
                  : "bg-black/40 hover:bg-black"
              } ${loadingReaction ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <i
                className={`text-white text-lg ${
                  userReaction === "dislike"
                    ? "ri-thumb-down-fill"
                    : "ri-thumb-down-line"
                }`}
              ></i>
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
              {/* <div className="cursor-pointer flex justify-center items-center">
                <i class="ri-arrow-down-s-fill text-white text-2xl"></i>
              </div> */}
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
                    `${
                      game.website ||
                      `https://www.epicgames.com/store/en-US/p/${game.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")}`
                    }`
                  )
                }
                className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2"
              >
                <i class="ri-download-line"></i> Download
              </button>
              {/* <div className="cursor-pointer flex justify-center items-center">
                <i class="ri-arrow-down-s-fill text-white text-2xl"></i>
              </div> */}
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
                    `https://store.playstation.com/en-us/search/${encodeURIComponent(
                      game.name
                    )}`
                  )
                }
                className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2"
              >
                <i class="ri-download-line"></i> Download
              </button>
              {/* <div className="cursor-pointer flex justify-center items-center">
                <i class="ri-arrow-down-s-fill text-white text-2xl"></i>
              </div> */}
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
                    `https://www.xbox.com/en-us/search?q=${encodeURIComponent(
                      game.name
                    )}`
                  )
                }
                className="h-[5svh] w-[9vw] rounded-sm bg-[#A641FF] text-white font-[gilroy-bold] text-sm cursor-pointer hover:bg-[#7a2ed1] flex justify-center items-center shadow-lg gap-2"
              >
                <i class="ri-download-line"></i> Download
              </button>
              {/* <div className="cursor-pointer flex justify-center items-center">
                <i class="ri-arrow-down-s-fill text-white text-2xl"></i>
              </div> */}
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
              <Likepercent
                likePercentage={calculateLikePercentages().likePercentage}
                dislikePercentage={calculateLikePercentages().dislikePercentage}
              />
            </div>
            <div className="flex justify-end items-center h-full w-auto">
              <h4 className="text-[#A641FF] font-[gilroy-ebold] text-sm ">
                {likeStats.likes + likeStats.dislikes} Reviews
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
            <h3 className="font-[gilroy-ebold] text-sm cursor-pointer truncate max-w-[19vw] overflow-hidden whitespace-nowrap flex gap-1">
              {game.developers.slice(0, 3).map((developer, idx) => (
                <span
                  key={idx}
                  className="text-[#A641FF] hover:text-white transition-colors duration-200"
                >
                  {developer}
                  {idx < game.developers.slice(0, 3).length - 1 ? "," : ""}
                </span>
              ))}
            </h3>
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
                className="w-[6svw] mr-2 text-[#A641FF] hover:text-white transition-colors duration-200 font-[gilroy-ebold] text-sm truncate cursor-pointer"
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
              <div className="h-[5svh] w-auto flex justify-start items-center gap-2">
                {game.genres.map((tag, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleClick(tag)}
                    className="h-[5svh] w-auto flex justify-center items-center bg-[#A641FF] rounded-sm px-3 cursor-pointer hover:bg-[#7a2ed1] transition-colors"
                  >
                    <h3 className="text-white font-[gilroy-bold] text-xs truncate max-w-[5vw] overflow-hidden whitespace-nowrap">
                      {tag}
                    </h3>
                  </div>
                ))}
              </div>
              <div className="h-[5svh] w-auto flex justify-center items-center bg-[#A641FF] rounded-sm px-2 cursor-pointer">
                <i class="ri-add-line text-white text-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[50svh] w-full flex justify-start items-start mb-15">
        <DetailsCommunity game={game} appid={game.steam_appid} />
      </div>

      <div
        onClick={() => handleClick(game.publishers[0])}
        className="h-[25svh] w-full flex justify-start items-start mb-15 rounded-xl overflow-hidden cursor-pointer group"
      >
        <div className="h-full w-full flex justify-center items-center bg-black relative">
          <img
            src={getGameImage(game, randomIndex2, 2)}
            alt=""
            className="h-full w-full object-cover rounded-lg mix-blend-luminosity group-hover:scale-110 transition-all duration-300"
          />

          <div className="h-full w-full absolute z-10 top-0 left-0 bg-black/40 shadow-[inset_0_4px_79.2px_0_rgba(255,41,195,0.50)] rounded-xl"></div>
          <div className="h-full w-full absolute z-10 top-0 left-0 flex justify-center items-center">
            <h1 className="text-white font-[gilroy] font-[600] text-3xl">
              Check out the entire {game.publishers[0]} collection on{" "}
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#FF29C3_53.65%,#A641FF_100%)] group-hover:bg-[linear-gradient(270deg,#FF29C3_53.65%,#A641FF_100%)] transition-all duration-500 ease-in-out">
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

      <div className="h-auto w-full flex flex-col justify-start items-start gap-5 mb-5">
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
        <GameList2 games={newReleases} title={GameListTitle[3]} />
        {topGames.length > 0 && (
          <GameList
            games={topGames}
            title={GameListTitle[1]}
            nextClass="game-list-swiper-next-1"
            prevClass="game-list-swiper-prev-1"
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DetailsPage;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { recordCommunityActivity } from "../utils/communityActivity";
import ArtworkImage from "../components/ArtworkImage";
import { useSocket } from "../contexts/SocketContext";

const formatTimeAgo = (dateValue) => {
  if (!dateValue) return "recently";
  const date = new Date(dateValue);
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
};

const getAvatarSrc = (profilePic) => {
  if (!profilePic) return "/profile/profile_pic2.jpg";
  if (typeof profilePic === "string") {
    if (profilePic.startsWith("http") || profilePic.startsWith("/") || profilePic.startsWith("data:")) {
      return profilePic;
    }
    return `data:image/jpeg;base64,${profilePic}`;
  }
  if (profilePic.data) {
    return `data:${profilePic.contentType || "image/jpeg"};base64,${profilePic.data}`;
  }
  return "/profile/profile_pic2.jpg";
};

const LibDetails = ({ game, onVerified }) => {
  const [isVerified, setIsVerified] = useState(game.verified);
  const [verifying, setVerifying] = useState(false);
  const [friendsWhoPlay, setFriendsWhoPlay] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const { socket } = useSocket() || {};
  const navigate = useNavigate();

  const fetchFriendsWhoPlay = useCallback(async () => {
    if (!game?.steam_appid) return;
    try {
      const response = await axios.get(`/library/friends-who-play/${game.steam_appid}`);
      if (Array.isArray(response.data)) {
        setFriendsWhoPlay(response.data);
      }
    } catch (err) {
      console.error("Error fetching friends who play:", err);
    } finally {
      setLoadingFriends(false);
    }
  }, [game?.steam_appid]);

  useEffect(() => {
    setLoadingFriends(true);
    fetchFriendsWhoPlay();
  }, [fetchFriendsWhoPlay]);

  // Real-time listener for friends playing games
  useEffect(() => {
    if (!socket || !game?.steam_appid) return;
    const handleGamePlayed = (data) => {
      if (String(data.steam_appid) === String(game.steam_appid)) {
        fetchFriendsWhoPlay();
      }
    };
    socket.on("gamePlayed", handleGamePlayed);
    return () => {
      socket.off("gamePlayed", handleGamePlayed);
    };
  }, [socket, game?.steam_appid, fetchFriendsWhoPlay]);

  const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

  const { recentlyPlayed, previouslyPlayed } = useMemo(() => {
    const recent = [];
    const previous = [];
    const now = Date.now();

    friendsWhoPlay.forEach((friend) => {
      const playedTimestamp = new Date(friend.lastPlayed).getTime();
      const diff = now - playedTimestamp;
      if (diff < TEN_DAYS_MS) {
        recent.push(friend);
      } else {
        previous.push(friend);
      }
    });

    return { recentlyPlayed: recent, previouslyPlayed: previous };
  }, [friendsWhoPlay]);

   const handleVerify = async () => {
    setVerifying(true);
    try {
      const response = await axios.post(
        `/library/verify/${game.steam_appid}`,
        {}, // empty body since we're using params
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setIsVerified(true);
        onVerified?.(game.steam_appid);
        alert("Game verified successfully!");
      } else {
        alert(`Verification failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error verifying game:", error);
      
      // Better error handling with axios
      if (error.response) {
        // Server responded with error status
        alert(`Verification failed: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response received
        alert("Network error. Please check your connection.");
      } else {
        // Something else happened
        alert("Error verifying game. Please try again.");
      }
    } finally {
      setVerifying(false);
    }
  };

  const handlePlay = async () => {
    // Optimistically update the first friend's lastPlayed in local state so the UI updates immediately
    if (friendsWhoPlay.length > 0) {
      setFriendsWhoPlay((prev) => {
        if (!prev || !prev.length) return prev;
        const now = new Date();
        const updated = [...prev];
        updated[0] = { ...updated[0], lastPlayed: now };
        return updated.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed));
      });
    }

    try {
      await axios.post(`/library/play/${game.steam_appid}`, {
        name: game.name,
        portrait_image: game.portrait_image,
        hero_image: game.hero_image,
      });
      fetchFriendsWhoPlay();
    } catch (err) {
      console.error("Error updating play status:", err);
    }

    recordCommunityActivity(game, "launched");

    // Launch steam protocol safely (doesn't matter if game actually opens or not)
    try {
      if (game?.steam_appid) {
        window.location.href = `steam://rungameid/${game.steam_appid}`;
      }
    } catch (e) {
      console.log("Steam launch skipped:", e);
    }
  };

  if (!game) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-white">Game not found</p>
      </div>
    );
  }
  return (
    <div className="library-detail-content h-full w-full px-5">
      <div className="h-[30vh] w-full relative">
        <div className="h-full w-full onject-cover flex items-center justify-center overflow-hidden rounded-sm">
          <ArtworkImage
            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steam_appid}/library_hero.jpg`}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute h-[20vh] w-[20vw] z-30 bottom-0 left-10 flex items-center justify-center">
          <img
            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steam_appid}/logo.png`}
            alt={game.name}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      <div className="library-detail-actions h-[10vh] w-full flex items-center justify-between">
        {/* verify game files logic dalna hai yaha par */}
        <button
          onClick={isVerified ? handlePlay : handleVerify}
          disabled={verifying}
          className="px-12 py-2 cursor-pointer rounded-sm bg-[#A641FF] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? (
            "Verifying..."
          ) : isVerified ? (
            <>
              <i className="ri-play-fill text-white text-xl"></i> Play
            </>
          ) : (
            <>Verify Now</>
          )}
        </button>
        <div className="library-detail-secondary flex items-center justify-center gap-2">
          <button
            className="px-8 py-2 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white transition-all duration-200 ease-in-out"
            onClick={() => navigate(`/game/${game.steam_appid}`)}
          >
            {" "}
            <i className="ri-store-2-fill text-white text-xl"></i> Store Page
          </button>
          <button className="px-8 py-2 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white flex items-center justify-center gap-1 transition-all duration-200 ease-in-out">
            {" "}
            <img src="/community.svg" alt="" className="py-1" /> Community
          </button>
          <button className="px-3 py-2 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white transition-all duration-200 ease-in-out">
            {" "}
            <img
              src="/HomePage/Shopping Cart.svg"
              alt=""
              className="py-1 h-7"
            />{" "}
          </button>
          <button className="px-3 py-2 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white transition-all duration-200 ease-in-out">
            {" "}
            <i className="ri-settings-3-fill text-white text-xl"></i>{" "}
          </button>
        </div>
      </div>
      <div className="library-detail-lower h-[34vh] w-full flex justify-between items-center overflow-auto hide-scrollbar">
        <div className="library-detail-activity h-[34vh] w-[38vw]">
          <h1 className="text-md font-[gilroy-bold] text-[#A641FF]">
            ACTIVITY
          </h1>
          <div className="flex flex-col justify-center items-end">
            <input
              type="text"
              placeholder="Share your experience to your Friends..."
              className="w-full px-4 py-3 rounded-sm shadow-md placeholder:text-[#696969] outline-none text-white bg-[#8800FF]/20 mt-2 mb-2"
            />
            <button className="px-12 py-3 cursor-pointer rounded-sm hover:bg-[#8800FF]/40 bg-[#8800FF]/20 text-white transition-all duration-200 ease-in-out">
              Post
            </button>
          </div>
          <div className="h-auto w-full flex flex-col justify-center items-center mb-5 mt-5">
            <div className="h-[3vh] w-full flex items-center justify-between">
              <h1 className="text-sm font-[gilroy] text-[#696969] px-3 ">
                September 05
              </h1>
              <div className="h-[1px] w-[79%] bg-[#696969]"></div>
            </div>
            <div className="library-detail-achievement h-[10vh] w-full mt-2 rounded-sm bg-[#8800FF]/20 flex justify-start items-center">
              <img src="/medal.svg" alt="" className="h-full w-[5vw] py-2" />
              <div className="h-full w-auto flex flex-col justify-center items-start">
                <h1 className="text-xs font-[gilroy] text-[#696969]">
                  new Achievement Unlocked!
                </h1>
                <h1 className="text-xl font-[gilroy] text-[#696969]">
                  Brought Your Friend To{" "}
                  <span className="bg-[linear-gradient(90deg,#A641FF_0%,#FF29C3_100%)] bg-clip-text text-transparent">
                    Xplode
                  </span>
                </h1>
              </div>
            </div>
          </div>
          <div className="h-auto w-full flex flex-col justify-center items-center mb-5 ">
            <div className="h-[3vh] w-full flex items-center justify-between">
              <h1 className="text-sm font-[gilroy] text-[#696969] px-3 ">
                September 05
              </h1>
              <div className="h-[1px] w-[79%] bg-[#696969]"></div>
            </div>
            <div className="library-detail-achievement h-[10vh] w-full mt-2 rounded-sm bg-[#8800FF]/20 flex justify-start items-center">
              <img src="/medal.svg" alt="" className="h-full w-[5vw] py-2" />
              <div className="h-full w-auto flex flex-col justify-center items-start">
                <h1 className="text-xs font-[gilroy] text-[#696969]">
                  new Achievement Unlocked!
                </h1>
                <h1 className="text-xl font-[gilroy] text-[#696969]">
                  Brought Your Friend To{" "}
                  <span className="bg-[linear-gradient(90deg,#A641FF_0%,#FF29C3_100%)] bg-clip-text text-transparent">
                    Xplode
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="library-detail-friends h-[34vh] w-[20vw] bg-[#8800FF]/20 rounded-sm px-5 py-5 overflow-y-auto hide-scrollbar">
          <div className="h-auto w-full flex items-center justify-between">
            <h1 className="text-sm font-[gilroy-bold] text-[#A641FF] ">
              FRIENDS WHO PLAY
            </h1>
            {friendsWhoPlay.length > 0 && (
              <span className="text-xs font-[gilroy-bold] text-[#696969]">
                {friendsWhoPlay.length}
              </span>
            )}
          </div>

          {loadingFriends ? (
            <div className="h-[20vh] w-full flex items-center justify-center">
              <span className="text-xs font-[gilroy] text-[#696969]">Loading...</span>
            </div>
          ) : friendsWhoPlay.length === 0 ? (
            <div className="h-[20vh] w-full flex flex-col items-center justify-center text-center px-2">
              <p className="text-xs font-[gilroy] text-[#696969]">
                None of your friends have played this game yet
              </p>
            </div>
          ) : (
            <>
              {recentlyPlayed.length > 0 && (
                <>
                  <div className="flex justify-between items-center mt-3">
                    <h1 className="text-xs font-[gilroy-bold] text-[#696969] whitespace-nowrap mr-2">
                      RECENTLY PLAYED
                    </h1>
                    <div className="h-[1px] flex-1 bg-[#696969]"></div>
                  </div>
                  {recentlyPlayed.map((friend) => (
                    <div key={friend._id} className="h-[7vh] w-full flex justify-start items-center mt-3">
                      <div className="h-[5vh] w-[5vh] flex-shrink-0 rounded-full overflow-hidden border border-[#A641FF]">
                        <img
                          src={getAvatarSrc(friend.profilePic)}
                          alt={friend.name || friend.username}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/profile/profile_pic2.jpg";
                          }}
                        />
                      </div>
                      <div className="h-full w-auto flex flex-col justify-center items-start gap-1 ml-3 truncate">
                        <h1 className="text-sm font-[gilroy-bold] text-white truncate">
                          {friend.name || friend.username}
                        </h1>
                        <h1 className="text-xs font-[gilroy-bold] text-[#696969]">
                          {formatTimeAgo(friend.lastPlayed)}
                        </h1>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {previouslyPlayed.length > 0 && (
                <>
                  <div className="flex justify-between items-center mt-3">
                    <h1 className="text-xs font-[gilroy-bold] text-[#696969] whitespace-nowrap mr-2">
                      PREVIOUSLY PLAYED
                    </h1>
                    <div className="h-[1px] flex-1 bg-[#696969]"></div>
                  </div>
                  {previouslyPlayed.map((friend) => (
                    <div key={friend._id} className="h-[7vh] w-full flex justify-start items-center mt-3">
                      <div className="h-[5vh] w-[5vh] flex-shrink-0 rounded-full overflow-hidden border border-[#A641FF]">
                        <img
                          src={getAvatarSrc(friend.profilePic)}
                          alt={friend.name || friend.username}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/profile/profile_pic2.jpg";
                          }}
                        />
                      </div>
                      <div className="h-full w-auto flex flex-col justify-center items-start gap-1 ml-3 truncate">
                        <h1 className="text-sm font-[gilroy-bold] text-white truncate">
                          {friend.name || friend.username}
                        </h1>
                        <h1 className="text-xs font-[gilroy-bold] text-[#696969]">
                          {formatTimeAgo(friend.lastPlayed)}
                        </h1>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibDetails;

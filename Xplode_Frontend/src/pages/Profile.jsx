import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import ProfilePage from "../pages/ProfilePage";
import CommunitySection from "../components/CommunitySection";
import GameList from "../components/GameList";
import axios from "../utils/axios";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import PreLoader from "../components/PreLoader";

const GameListTitle = ["Trending Games", "Top Games", "Top Records"];

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    bannerPic: "",
    username: "",
    profilePic: null,
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.get("/user/logout", { withCredentials: true });
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get("/games/home"); // assuming it's a GET now
      console.log(response.data);
      setGames(response.data);
    } catch (err) {
      console.error("Failed to fetch games:", err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const trendingGames = games.filter((game) => game.category === "trending");
  const topGames = games.filter((game) => game.category === "top_games");
  const topRecordGames = games.filter(
    (game) => game.category === "top_records"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        });

        const profilePic = res.data.profilePic
          ? `data:${res.data.profilePic.contentType};base64,${res.data.profilePic.data}`
          : "/default.png";
        const bannerPic = res.data.bannerPic
          ? `data:${res.data.bannerPic.contentType};base64,${res.data.bannerPic.data}`
          : "/default.png";

        setUser({
          name: res.data.name,
          username: res.data.username || res.data.name,
          profilePic,
          bannerPic,
          email: res.data.email,
          about: res.data.about,
        });
      } catch (err) {
        console.error(
          "🔒 Auth Error:",
          err.response?.data?.message || err.message
        );
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [navigate]);

  return (
    <div className="h-screen w-full relative bg-transparent">

      {isLoading && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40">
          <PreLoader />
        </div>
      )}
      <div className="relative sticky z-10">
        <NavBar user={user} />
        <SideNav handleLogout={handleLogout} />
        <div className="absolute top-[12svh] left-[10%] h-[88svh] w-[90%] z-30 overflow-y-auto hide-scrollbar">
          <ProfilePage user={user} setUser={setUser} />
          <CommunitySection />
          {topGames.length > 0 && (
            <GameList
              games={topGames}
              title={GameListTitle[1]}
              nextClass="game-list-swiper-next-1"
              prevClass="game-list-swiper-prev-1"
            />
          )}
          {topRecordGames.length > 0 && (
            <GameList
              games={topRecordGames}
              title={GameListTitle[2]}
              nextClass="game-list-swiper-next-2"
              prevClass="game-list-swiper-prev-2"
            />
          )}
          <Footer />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full fixed z-0">
        <img
          src="../bg.svg"
          alt=""
          className="w-full h-auto pointer-events-none select-none saturate-140"
        />
      </div>
    </div>
  );
};

export default Profile;

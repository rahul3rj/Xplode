import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const fetchGames = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/games/fetch?page=${page}&limit=200`);
      setGames(response.data);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          // console.log(res.data);
          const profilePic = res.data.profilePic
            ? `data:${res.data.profilePic.contentType};base64,${res.data.profilePic.data}`
            : "/default.png";
          setUser({ username: res.data.username || res.data.name, profilePic });
        })
        .catch((err) => console.error("Failed to fetch user data:", err));
    }
  }, [navigate]);

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

        setUser({
          username: res.data.username,
          profilePic,
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
      {/* <div className="absolute top-[12svh] left-[10%] h-[88svh] w-[90%] z-30 overflow-y-auto hide-scrollbar">
          {renderPage()}
        </div> */}
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

export default Home;

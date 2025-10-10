import React from "react";
import NavBar from "./components/NavBar";
import SideNav from "./components/SideNav";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "./utils/axios";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [user, setUser] = useState({ username: "", profilePic: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [activePage, setActivePage] = useState("store");
  const navigate = useNavigate();

  const fetchGames = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/games/fetch?page=${page}&limit=200`);
      console.log(response.data);
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

  const handleLogout = async () => {
    try {
      await axios.get("/user/logout", { withCredentials: true });
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

  // This function will set the active page and navigate to the route
  const handleSetActivePage = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  return (
    <div className="h-screen w-full bg-black flex relative">
      <SideNav
        handleLogout={handleLogout}
        setActivePage={handleSetActivePage}
        activePage={activePage}
      />
      <div className="flex-1 flex flex-col">
        <NavBar
          user={user}
          onShowProfile={() => handleSetActivePage("profile")}
        />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

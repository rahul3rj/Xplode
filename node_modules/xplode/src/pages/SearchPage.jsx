import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import SearchResults from "../pages/SearchResults";
import StoreFooter from "../components/StoreFooter";

const SearchPage = () => {
  const [user, setUser] = useState({ username: "", profilePic: null });
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState("store"); // <-- Add this line
  const navigate = useNavigate();

  

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

  const { appid } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  return (
    <div className="search-page-scroll">
      <div className="search-page-content"><SearchResults query={query} /><StoreFooter /></div>
    </div>
  );
};

export default SearchPage;

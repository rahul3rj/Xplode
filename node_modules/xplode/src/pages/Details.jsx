import React from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import SideNav from '../components/SideNav'
import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import DetailsPage from './DetailsPage';



const Details = () => {
  const [user, setUser] = useState({ username: "", profilePic: null });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    <div className="game-details-scroll">
      <DetailsPage />
    </div>
  )
}

export default Details

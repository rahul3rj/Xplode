import React from "react";
import axios from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
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

  return (
    <div className="text-white">
      Home
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-[#D65F30] text-white rounded-full hover:bg-[#D65F30]/80"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;

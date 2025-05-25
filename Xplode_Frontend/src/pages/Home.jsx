import React from "react";
import axios from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import Store from "../pages/Store";

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
    <div className="h-screen w-full relative bg-transparent">
      <div className="relative sticky z-10">
        <NavBar />
        <SideNav handleLogout={handleLogout} />
        <div className="absolute top-[10svh] left-[10%] h-[90svh] w-[90%] z-30 overflow-y-auto hide-scrollbar">
          <Store />
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

export default Home;

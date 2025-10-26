import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Wallet from "./Wallet";
import Notification from "./Notification";

import { useState, useRef, useEffect } from "react";
import { useSearch } from "../lib/SearchContext";

const NavBar = ({ user, onShowProfile }) => {
  const { query, setQuery, filteredGames, isLoading } = useSearch();
  const [showWallet, setShowWallet] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  

  const walletRef = useRef(null);
  const notificationRef = useRef(null);

  const walletButtonRef = useRef(null);
  const notificationButtonRef = useRef(null);


  const handleClickOutside = (event) => {
    if (
      walletRef.current &&
      !walletRef.current.contains(event.target) &&
      walletButtonRef.current &&
      !walletButtonRef.current.contains(event.target)
    ) {
      setShowWallet(false);
    }
  };

  const handleNotificationClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target) &&
      notificationButtonRef.current &&
      !notificationButtonRef.current.contains(event.target)
    ) {
      setShowNotification(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); 
    };
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleNotificationClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleNotificationClickOutside);
    };
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className="h-[12svh] w-full bg-transparent flex justify-between items-center fixed top-0 left-0 z-50">
        <div className="h-[10svh] w-[50%] flex justify-between items-center">
          <Link to={"/store"}
          className=" flex justify-start items-center cursor-pointer">
            <img
            src="/LoginPage/Complete logo.png"
            alt=""
            className="ml-[1.8vw] "
          />
          </Link>
          
          <div className="w-full h-[6svh] ml-[1.7vw]">
            <SearchBar
              query={query}
              setQuery={setQuery}
              filteredGames={filteredGames}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="h-[6svh] w-[39%] flex ml-5 justify-between mr-8 items-center">
          <div
            className="h-[100%] w-[24%] rounded-full bg-[rgba(90,0,169,0.40)] shadow-[0_4px_5.8px_2px_rgba(13,13,13,0.22)] backdrop-blur-[35px] flex justify-between items-center cursor-pointer"
            onClick={() => {
              setShowWallet(!showWallet); // Toggle between true/false
            }}
            ref={walletButtonRef}

          >
            <img
              src="../HomePage/Wallet.svg"
              alt=""
              className="ml-4 h-[3svh]"
            />
            <h4 className="font-[Gilroy-Bold] text-white">₹1500</h4>
            <img
              src="../HomePage/Polygon 6.svg"
              alt=""
              className={`mr-4 h-[1.2svh] ${showWallet ? "rotate-180" : ""}`}

            />
          </div>

          {showWallet && (
            <Wallet ref={walletRef} />
          )}
          
          <div className="h-[6svh] w-[6svh] rounded-full bg-[rgba(90,0,169,0.40)] shadow-[0_4px_5.8px_2px_rgba(13,13,13,0.22)] backdrop-blur-[35px] flex justify-center items-center cursor-pointer"
          onClick={() => {
            console.log("Navigating to wishlist..."); // Debugging log
            navigate("/library?filter=wishlist"); // Navigate to Library with wishlist filter
          }}
          >
            <img
              src="../HomePage/Heart.svg"
              alt="Wishlist"
              className="h-[3svh] w-[3svh]"
            />
          </div>
          <div className="h-[6svh] w-[6svh] rounded-full bg-[rgba(90,0,169,0.40)] shadow-[0_4px_5.8px_2px_rgba(13,13,13,0.22)] backdrop-blur-[35px] flex justify-center items-center cursor-pointer"
          onClick={() => {
            setShowNotification(!showNotification); // Toggle between true/false
          }}
          ref={notificationButtonRef}
          >
            <img
              src="../HomePage/Doorbell.svg"
              alt=""
              className="h-[3svh] w-[3svh]"
            />
          </div>
          {showNotification && (
            <Notification ref={notificationRef} />
          )}

          <div className="h-[6svh] w-[6svh] rounded-full bg-[rgba(90,0,169,0.40)] shadow-[0_4px_5.8px_2px_rgba(13,13,13,0.22)] backdrop-blur-[35px] flex justify-center items-center cursor-pointer">
            <img
              src="../HomePage/Shopping Cart.svg"
              alt=""
              className="h-[3svh] w-[3svh]"
            />
          </div>
          <div onClick={onShowProfile}
            className="h-[5svh] w-[27%] flex justify-between items-center cursor-pointer"
          >
            <div className="h-[5svh] w-[5svh] object-cover rounded-full border-2 border-[#A641FF] " >
              <img
                src={user.profilePic || "../profile/profile_pic.jpg"}
                alt=""
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <h4 className="font-[Gilroy-Bold] text-white">{user.username}</h4>
            <img
              src="../HomePage/Polygon 6.svg"
              alt=""
              className="h-[1.5svh]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

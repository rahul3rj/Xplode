import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const NavBar = ({ user, query, setQuery, filteredGames, isLoading }) => {
  return (
    <>
      {/* Navbar */}
      <div className="h-[12svh] w-full bg-transparent flex justify-between items-center fixed top-0 left-0 z-50">
        <div className="h-[10svh] w-[45%] flex justify-between items-center">
          <img src="./LoginPage/Complete logo.png" alt="" className="ml-10 " />
          <div>
            <SearchBar
              query={query}
              setQuery={setQuery}
              filteredGames={filteredGames}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="h-[6svh] w-[39%] flex ml-5 justify-between mr-8 items-center">
          <div className="h-[100%] w-[24%] rounded-full bg-[#1B0033] flex justify-between items-center cursor-pointer">
            <img
              src="../HomePage/Wallet.svg"
              alt=""
              className="ml-4 h-[3svh]"
            />
            <h4 className="font-[Gilroy-Bold] text-white">₹1500</h4>
            <img
              src="../HomePage/Polygon 6.svg"
              alt=""
              className="mr-4 h-[1.5svh]"
            />
          </div>
          <div className="h-[6svh] w-[6svh] rounded-full bg-[#1B0033] flex justify-center items-center cursor-pointer">
            <img
              src="../HomePage/Heart.svg"
              alt=""
              className="h-[3svh] w-[3svh]"
            />
          </div>
          <div className="h-[6svh] w-[6svh] rounded-full bg-[#1B0033] flex justify-center items-center cursor-pointer">
            <img
              src="../HomePage/Doorbell.svg"
              alt=""
              className="h-[3svh] w-[3svh]"
            />
          </div>
          <div className="h-[6svh] w-[6svh] rounded-full bg-[#1B0033] flex justify-center items-center cursor-pointer">
            <img
              src="../HomePage/Shopping Cart.svg"
              alt=""
              className="h-[3svh] w-[3svh]"
            />
          </div>
          <Link
            to={"/profile"}
            className="h-[5svh] w-[27%] flex justify-between items-center cursor-pointer"
          >
            <div className="h-[5svh] w-[5svh] object-cover rounded-full border-2 border-[#A641FF] ">
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
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;

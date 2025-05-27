import React from "react";

const NavBar = ({user}) => {
  return (
    <>
      {/* Navbar */}
      <div className="h-[10svh] w-full bg-transparent flex justify-between items-center fixed top-0 left-0 z-50">
        <div className="h-[10svh] w-[45%] flex justify-between items-center">
          <img src="./LoginPage/Complete logo.png" alt="" className="ml-10 " />
          <div className="h-[50%] w-[80%] ml-15 relative">
            <img
              src="../HomePage/Search.svg"
              alt=""
              className="absolute top-[50%] left-1/50 transform -translate-y-1/2"
            />
            <input
              placeholder="search games"
              type="text"
              className="h-[100%] w-[80%] lg:w-[100%] py-1 font-[Gilroy-bold] rounded-lg bg-[#1B0033] text-[#5D4275] px-12 outline-none focus:border-white transition-all"
            />
          </div>
        </div>

        <div className="h-[5svh] w-[39%] flex ml-5 justify-between mr-8 items-center">
          <div className="h-[100%] w-[24%] rounded-full bg-[#1B0033] flex justify-between items-center cursor-pointer">
            <img src="../HomePage/Wallet.svg" alt="" className="ml-4" />
            <h4 className="font-[Gilroy-Bold] text-white">₹1500</h4>
            <img src="../HomePage/Polygon 6.svg" alt="" className="mr-4" />
          </div>
          <div className="h-[5svh] w-[5svh] rounded-full bg-[#1B0033] flex justify-center items-center cursor-pointer">
            <img src="../HomePage/Heart.svg" alt="" />
          </div>
          <div className="h-[5svh] w-[5svh] rounded-full bg-[#1B0033] flex justify-center items-center cursor-pointer">
            <img src="../HomePage/Doorbell.svg" alt="" />
          </div>
          <div className="h-[5svh] w-[5svh] rounded-full bg-[#1B0033] flex justify-center items-center cursor-pointer">
            <img src="../HomePage/Shopping Cart.svg" alt="" />
          </div>
          <div className="h-[5svh] w-[27%] flex justify-between items-center cursor-pointer">
            <div className="h-[5svh] w-[5svh] object-cover rounded-full border-2 border-[#A641FF] ">
              <img
                src="../HomePage/profile.jpg"
                alt=""
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <h4 className="font-[Gilroy-Bold] text-white">{ user.username}</h4>
            <img src="../HomePage/Polygon 6.svg" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

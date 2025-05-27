import React from "react";
import { useState } from "react";

const SideNav = ({ handleLogout }) => {
  const [active, setActive] = useState("store");
  return (
    <>
      <div className="h-[90svh] w-[9%] ml-5 flex fixed top-[10svh] left-0 z-40">
        <img
          src="../HomePage/sidenav-bg.svg"
          alt=""
          className="h-[90svh] w-full object-cover rounded-xl z-0"
        />
        {/* icons */}
        <div className="h-[24svh] w-full absolute z-10 cursor-pointer mt-5 ">
          <div
            className="h-[6svh] w-full flex justify-start items-center "
            onClick={() => setActive("store")}
          >
            <div className="h-[6svh] w-[6svh] flex justify-center items-center">
              <img
                src={
                  active === "store"
                    ? "../SidenavPage/store-g.svg"
                    : "../SidenavPage/store.svg"
                }
                alt=""
                className={`${
                  active === "store" ? "h-[6svh] w-[6svh]" : "h-[2svh] w-[2svh]"
                }`}
              />
            </div>
            <h4
              className={`font-[Gilroy-Bold] text-sm ml-2 ${
                active === "store" ? "text-[#A641FF]" : "text-white"
              }`}
            >
              Store
            </h4>
          </div>
          <div
            className="h-[6svh] w-full flex justify-start items-center"
            onClick={() => setActive("Library")}
          >
            <div className="h-[6svh] w-[6svh] flex justify-center items-center">
              <img
                src={
                  active === "Library"
                    ? "../SidenavPage/Books-g.svg"
                    : "../SidenavPage/Books.svg"
                }
                alt=""
                // className={` ${
                //   active === "Library"
                //     ? "h-[6svh] w-[6svh]"
                //     : "h-[2svh] w-[2svh]"
                // }`}
              />
            </div>
            <h4
              className={`font-[Gilroy-Bold] text-sm ml-2 ${
                active === "Library" ? "text-[#A641FF]" : "text-white"
              }`}
            >
              Library
            </h4>
          </div>
          <div
            className="h-[6svh] w-full flex justify-start items-center"
            onClick={() => setActive("comunity")}
          >
            <div className="h-[6svh] w-[6svh] flex justify-center items-center">
              <img
                src={
                  active === "comunity"
                    ? "../SidenavPage/people-g.svg"
                    : "../SidenavPage/people.svg"
                }
                alt=""
                // className={` ${
                //   active === "comunity"
                //     ? "h-[6svh] w-[6svh]"
                //     : "h-[2svh] w-[2svh]"
                // }`}
              />
            </div>
            <h4
              className={`font-[Gilroy-Bold] text-sm ml-2 ${
                active === "comunity" ? "text-[#A641FF]" : "text-white"
              }`}
            >
              community
            </h4>
          </div>
          <div
            className="h-[6svh] w-full flex justify-start items-center"
            onClick={() => setActive("settings")}
          >
            <div className="h-[6svh] w-[6svh] flex justify-center items-center">
              <img
                src={
                  active === "settings"
                    ? "../SidenavPage/Settings-g.svg"
                    : "../SidenavPage/Settings.svg"
                }
                alt=""
                // className={` ${
                //   active === "settings"
                //     ? "h-[6svh] w-[6svh]"
                //     : "h-[2svh] w-[2svh]"
                // }`}
              />
            </div>
            <h4
              className={`font-[Gilroy-Bold] text-sm ml-2 ${
                active === "settings" ? "text-[#A641FF]" : "text-white"
              }`}
            >
              Settings
            </h4>
          </div>
        </div>

        {/* Logout */}
        <div className="h-[6svh] w-full absolute bottom-5">
          <button
            className="h-full w-full cursor-pointer flex justify-end items-center group"
            onClick={handleLogout}
          >
            <img
              src="../SidenavPage/Log.svg"
              alt=""
              className="mx-5 h-[2.5svh] w-[2.5svh] group-hover:hidden"
            />
            <img
              src="../SidenavPage/Log-g.svg"
              alt=""
              className="ml-1 h-[6svh] w-[6svh] hidden group-hover:block"
            />
            <h4 className="h-full w-[70%] flex justify-start items-center font-[Gilroy-Bold] ml-2 text-sm text-white hover:text-[#A641FF]">
              Logout
            </h4>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideNav;

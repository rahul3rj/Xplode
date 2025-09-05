import React from "react";

const SideNav = ({ activePage, setActivePage, handleLogout }) => {
  return (
    <div className="h-[88svh] w-[9%] ml-5 flex fixed top-[12svh] left-0 z-40">
      <img
        src="../HomePage/sidenav-bg.svg"
        alt=""
        className="h-[90svh] w-full object-cover rounded-xl z-0"
      />

      {/* icons */}
      <div className="h-[24svh] w-full absolute z-10 cursor-pointer mt-5 ">
        <div
          className="h-[6svh] w-full flex justify-start items-center"
          onClick={() => setActivePage("store")}
        >
          <div className="h-[6svh] w-[6svh] flex justify-center items-center">
            <img
              src={
                activePage === "store"
                  ? "../SidenavPage/store-g.svg"
                  : "../SidenavPage/store.svg"
              }
              alt=""
              className={`${
                activePage === "store"
                  ? "h-[6svh] w-[6svh]"
                  : "h-[2svh] w-[2svh]"
              }`}
            />
          </div>
          <h4
            className={`font-[Gilroy-Bold] text-sm ml-2 ${
              activePage === "store" ? "text-[#A641FF]" : "text-white"
            }`}
          >
            Store
          </h4>
        </div>

        <div
          className="h-[6svh] w-full flex justify-start items-center"
          onClick={() => setActivePage("library")}
        >
          <div className="h-[6svh] w-[6svh] flex justify-center items-center">
            <img
              src={
                activePage === "library"
                  ? "../SidenavPage/Books-g.svg"
                  : "../SidenavPage/Books.svg"
              }
              alt=""
            />
          </div>
          <h4
            className={`font-[Gilroy-Bold] text-sm ml-2 ${
              activePage === "library" ? "text-[#A641FF]" : "text-white"
            }`}
          >
            Library
          </h4>
        </div>

        <div
          className="h-[6svh] w-full flex justify-start items-center"
          onClick={() => setActivePage("community")}
        >
          <div className="h-[6svh] w-[6svh] flex justify-center items-center">
            <img
              src={
                activePage === "community"
                  ? "../SidenavPage/people-g.svg"
                  : "../SidenavPage/people.svg"
              }
              alt=""
            />
          </div>
          <h4
            className={`font-[Gilroy-Bold] text-sm ml-2 ${
              activePage === "community" ? "text-[#A641FF]" : "text-white"
            }`}
          >
            Community
          </h4>
        </div>

        <div
          className="h-[6svh] w-full flex justify-start items-center"
          onClick={() => setActivePage("settings")}
        >
          <div className="h-[6svh] w-[6svh] flex justify-center items-center">
            <img
              src={
                activePage === "settings"
                  ? "../SidenavPage/Settings-g.svg"
                  : "../SidenavPage/Settings.svg"
              }
              alt=""
            />
          </div>
          <h4
            className={`font-[Gilroy-Bold] text-sm ml-2 ${
              activePage === "settings" ? "text-[#A641FF]" : "text-white"
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
  );
};

export default SideNav;

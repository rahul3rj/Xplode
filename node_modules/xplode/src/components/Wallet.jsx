import React, { forwardRef, useState } from "react";

const Wallet = forwardRef((props, ref) => {
  const [activeTab, setActiveTab] = useState("balance");

  return (
    <div
      ref={ref}
      className="absolute top-[12svh] right-[32vw] h-[50vh] w-[25vw] rounded-xl bg-[rgba(90,0,169,0.40)] shadow-[0_4px_5.8px_2px_rgba(13,13,13,0.22)] backdrop-blur-[35px]"
    >
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-xl font-bold font-[gilroy-bold] text-white">My Wallet</h1>
        <div className="h-[4vh] w-[12vw] rounded-full bg-[#23152F] flex justify-between items-center cursor-pointer relative">
          <div className={`h-[4vh] w-[6vw] bg-white rounded-full absolute transition-all duration-300 ease-in-out ${activeTab === "spend" ? "translate-x-full" : "translate-x-0"}`}></div>

          <div className="h-[4vh] w-[6vw] flex items-center justify-center absolute left-0 rounded-full" onClick={() => setActiveTab("balance")}>
            <p className={` ${activeTab === "balance" ? "text-[#23152F]" : "text-white"} transition-all duration-300 ease-in-out text-xs font-bold font-[gilroy-bold]`} >Balance</p>

          </div>
          <div className="h-[4vh] w-[6vw] flex items-center justify-center absolute right-0 rounded-full" onClick={() => setActiveTab("spend")}>
            <p className={`${activeTab === "spend" ? "text-[#23152F]" : "text-white"} transition-all duration-300 ease-in-out text-xs font-bold font-[gilroy-bold]`} >Total Spend</p>
          </div>
        </div>
        <div className="h-[12vh] w-[20vw] rounded-3xl bg-[#23152F] gap-1 flex flex-col items-center justify-center">
          <h4 className="text-white text-xs font-[gilroy] text-center">{activeTab === "balance" ? "Current Wallet Balance" : "Total Spend"}</h4>

          <h1 className="text-white text-3xl font-[gilroy-bold]">{activeTab === "balance" ? "1500 XP" : "2340 XP"}</h1>
        </div>
        <div className="h-[10vh] w-[20vw] flex justify-between items-center">
          <div className="h-[10vh] w-[10vh] flex flex-col items-center justify-between">
            <div className="h-[7vh] w-[7vh] rounded-full bg-[#23152F] flex justify-center items-center cursor-pointer">
              <img src="./HomePage/Add-money.svg" alt=""  className="h-[4vh]"/>
            </div>
            <h4 className="text-white text-[1.3vh] font-[gilroy]">Add Money</h4>
          </div>
          <div className="h-[10vh] w-[10vh] flex flex-col items-center justify-between">
            <div className="h-[7vh] w-[7vh] rounded-full bg-[#23152F] flex justify-center items-center cursor-pointer">
              <img src="./HomePage/history.svg" alt=""  className="h-[4vh]"/>
            </div>
            <h4 className="text-white text-[1.3vh] font-[gilroy]">History</h4>
          </div>
          <div className="h-[10vh] w-[10vh] flex flex-col items-center justify-between">
            <div className="h-[7vh] w-[7vh] rounded-full bg-[#23152F] flex justify-center items-center cursor-pointer">
              <img src="./HomePage/gift.svg" alt=""  className="h-[4vh]"/>
            </div>
            <h4 className="text-white text-[1.3vh] font-[gilroy]">Gift Card</h4>
          </div>
          <div className="h-[10vh] w-[10vh] flex flex-col items-center justify-between">
            <div className="h-[7vh] w-[7vh] rounded-full bg-[#23152F] flex justify-center items-center cursor-pointer">
              <img src="./HomePage/more.svg" alt=""  className="h-[4vh]"/>
            </div>
            <h4 className="text-white text-[1.3vh] font-[gilroy]">More</h4>
          </div>
        </div>

      </div>
    </div>
  );
});

export default Wallet;

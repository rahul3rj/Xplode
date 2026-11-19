import React from "react";

const Footer = () => {
  return (
    <>
      <div className="h-[40svh] w-full relative">
        <img src="../Footer/bg.png" alt="" className="h-full w-full opacity-"/>
        <div className="absolute h-[40svh] w-full top-0 z-10 flex flex-col justify-center items-start">
            <div className="h-[80%] w-full flex justify-center items-center">
                <div className="h-full w-[30%] flex justify-center items-center ">
                    <img src="../Footer/Logo.svg" alt="" className="w-[50%]"/>
                </div>
                <div className="h-full w-[30%] flex justify-center items-center">
                    <div className="">
                        <h1 className="text-white font-[gilroy-bold] hover:text-[#A641FF] mb-3 text-sm cursor-pointer">Contact</h1>
                        <h1 className="text-white font-[gilroy-bold] hover:text-[#A641FF] mb-3 text-sm cursor-pointer">About</h1>
                        <h1 className="text-white font-[gilroy-bold] hover:text-[#A641FF] mb-3 text-sm cursor-pointer">Privacy Policy</h1>
                        <h1 className="text-white font-[gilroy-bold] hover:text-[#A641FF] mb-3 text-sm cursor-pointer">Terms of Use</h1>
                    </div>
                    <div className=" ml-10">
                        <h1 className="text-white font-[gilroy-bold] hover:text-[#A641FF] mb-3 text-sm cursor-pointer">Privacy Policy</h1>
                        <h1 className="text-white font-[gilroy-bold] hover:text-[#A641FF] mb-3 text-sm cursor-pointer">Legal</h1>
                        <h1 className="text-white font-[gilroy-bold] hover:text-[#A641FF] mb-3 text-sm cursor-pointer">Xplode Subscriber Agreement</h1>
                        <h1 className="text-white font-[gilroy-bold] hover:text-[#A641FF] mb-3 text-sm cursor-pointer">Refunds</h1>
                    </div>
                </div>
            </div>
            <div className="h-[20%] w-full flex justify-center items-center">
                <h1 className="font-[gilroy-bold] text-sm text-zinc-600">© 2025 Xplode. All rights reserved. All trademarks are property of their respective owners in the India and other countries.</h1>
            </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

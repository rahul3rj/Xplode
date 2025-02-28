import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#855656]/10 ">
      <footer className=" h-[40vh] rounded-3xl text-white py-4 borderboxfooter flex flex-col justify-center items-center">
        <div className=" h-[25vh] w-[80vw] flex justify-center items-center">
          <div className="h-[15vh] w-[10vw] istok-web-regular mr-10 flex justify-center items-center">
            <ul className="flex flex-col justify-center items-center ">
              <li className="p-1 text-[#808080]">Home</li>
              <li className="p-1 text-[#808080]">Media Center</li>
              <li className="p-1 text-[#808080]">Contact Us</li>
            </ul>
          </div>
          <div className="h-[15vh] w-[10vw] istok-web-regular mr-10 flex justify-center items-center">
            <ul className="flex flex-col justify-center items-center">
              <li className="p-1 text-[#808080]">About Us</li>
              <li className="p-1 text-[#808080]">Careers</li>
              <li className="p-1 text-[#808080]">Support</li>
            </ul>
          </div>
          <div className="h-[15vh] w-[10vw] istok-web-regular mr-10 flex justify-center items-center">
            <ul className="flex flex-col justify-center items-center">
              <li className="p-1 text-[#808080]">Privacy Policy</li>
              <li className="p-1 text-[#808080]">Terms of Service</li>
              <li className="p-1 text-[#808080]">FAQ</li>
            </ul>
          </div>
        </div>
        <div className="h-[6vh] w-[80vw]  flex justify-center items-center relative">
          <div className="text-sm istok-web-regular">
            &copy; {new Date().getFullYear()} Xplode. All rights reserved.
          </div>
          <div className="h-[6vh] w-[20vw] absolute right-0 flex justify-center items-center">
            <i className="ri-facebook-circle-fill mx-4 text-3xl hover:text-[#D65F30] transition-all ease-in"></i>
            <i className="ri-instagram-fill mx-4 text-3xl hover:text-[#D65F30] transition-all ease-in"></i>
            <i className="ri-youtube-fill mx-4 text-3xl hover:text-[#D65F30] transition-all ease-in"></i>
            <i className="ri-twitter-x-fill mx-4 text-3xl hover:text-[#D65F30] transition-all ease-in"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

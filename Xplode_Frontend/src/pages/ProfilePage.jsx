import React, { useState } from "react";
import { AvatarCircles } from "../magicUi/Friends";
import EditProfile from "../components/EditProfile";

const avatars = [
  {
    imageUrl: "../profile/profile_pic.jpg",
    profileUrl: ""
  },
  {
    imageUrl: "../profile/profile_pic.jpg",
    profileUrl: ""
  },
  {
    imageUrl: "../profile/profile_pic.jpg",
    profileUrl: ""
  },
  {
    imageUrl: "../profile/profile_pic.jpg",
    profileUrl: ""
  },
  {
    imageUrl: "../profile/profile_pic.jpg",
    profileUrl: ""
  },
  
];

const ProfilePage = () => {
  const [showEdit, setShowEdit] = useState(false);
  return (
    <>
      <div className="h-auto w-full">
        <div className="h-[35svh] w-auto mx-10 overflow-hidden flex items-center justify-center rounded-lg">
          <img
            src="../profile/profile_banner.jpg"
            alt=""
            className="object-cover "
          />
        </div>
        <div className="h-[50svh] w-auto mx-10 flex">
          <div className="h-full w-[60svw] flex items-center justify-between">
            <div className="h-full w-[30%] relative flex flex-col items-center justify-center">
              <div className="h-[30svh] w-[30svh] rounded-full border-5 border-[#A641FF] flex items-center justify-center relative shadow-[0_0_24px_0_#A641FF99] absolute -top-35 ">
                <div className="h-[27svh] w-[27svh] overflow-hidden rounded-full flex items-center justify-center">
                  <img src="../profile/profile_pic.jpg" alt="" />
                </div>
                <img
                  src="../profile/play.svg"
                  alt=""
                  className="absolute h-[12svh] -bottom-[6svh] z-10"
                />
              </div>
              <div className="h-[20svh] w-full flex flex-col items-center justify-center gap-2 -mt-35">
                <h4 className="font-[gilroy-ebold] text-sm text-zinc-500">
                  PLAYTIME
                </h4>
                <h1 className="font-[gilroy-bold] text-4xl text-white">
                  68.7 Hrs
                </h1>
              </div>
            </div>
            <div className="h-full w-[70%]">
              <div className="h-[20svh] w-auto flex flex-col items-start justify-center mx-10 gap-2">
                <h1 className="font-[gilroy-bold] text-4xl text-white">
                  Isagi Youichi
                </h1>
                <h4 className="font-[gilroy-bold] text-sm text-zinc-500">
                  @isagii07
                </h4>
              </div>
              <div className="h-[30svh] w-auto flex items-start justify-start mx-10">
                <div className="h-[80%] w-[60%] flex flex-col items-start justify-center gap-2 mr-5">
                  <h4 className="font-[gilroy-ebold] text-sm text-zinc-500">
                    ABOUT ME
                  </h4>
                  <p className="font-[gilroy-bold] text-xs text-white">
                    Hi! I’m Isagi Youichi. I’m a young Japanese streamer originally from Tokyo and now living in London, UK. I adore content creation and streaming but I also love having a voice and being able to use that voice for caus...
                  </p>
                </div>
                <div className="h-[68.5%] w-[40%] flex flex-col items-start justify-center">
                  <h4 className="font-[gilroy-ebold] text-sm text-zinc-500 mb-2">
                    FRIENDS
                  </h4>
                  <AvatarCircles numPeople={99} avatarUrls={avatars} />
                </div>
              </div>
            </div>
          </div>
          <div className="h-full w-[25svw] flex flex-col justify-between items-center relative">
            <div className="h-[10svh] w-full flex items-center justify-center gap-5 absolute">
               <button className="h-[6svh] w-[10svw] bg-[#A641FF] rounded-lg text-white font-[gilroy-bold] text-sm hover:bg-[#A641FF99] transition-all duration-300 cursor-pointer" onClick={() => setShowEdit(true)}>
                Edit Profile
               </button>
               <button className="h-[6svh] w-[10svw] bg-transparent border-2 border-[#A641FF] rounded-lg text-[#A641FF] font-[gilroy-bold] text-sm hover:bg-[#A641FF99] hover:text-white transition-all duration-300 cursor-pointer">
                Message
               </button>
               <img src="../profile/option.svg" alt="" className="h-[20%]"/>
            </div>
            <div className="h-[50svh] w-full flex justify-center items-center ">
              <img src="../profile/Titanium.svg" alt="" className=""/>
              <h1 className="font-[gilroy-ebold] text-[5svh] absolute bottom-5 bg-[linear-gradient(0deg,_rgba(166,65,255,1)_37%,_rgba(219,179,255,1)_100%)] bg-clip-text text-transparent">Titanium</h1>
            </div>
          </div>
        </div>
      </div>

      {showEdit && <EditProfile onClose={() => setShowEdit(false)} />}

    </>
  );
};

export default ProfilePage;

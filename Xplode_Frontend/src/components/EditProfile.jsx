import React from "react";

const EditProfile = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="relative px-15 py-10 w-[50vw] h-[75vh] rounded-[10px]
    bg-[linear-gradient(180deg,_rgba(136,0,255,0.20)_0%,_rgba(255,41,195,0.20)_100%)]
    shadow-[0_4px_128.5px_-14px_#A641FF]
    backdrop-blur-[86.4px] flex flex-col items-center justify-center"
      >
        <img src="../profile/esc.svg" alt="" className="absolute top-4 right-4 text-white text-xl cursor-pointer"
          onClick={onClose}/>
        <div className="h-[30vh] w-full flex items-center justify-center gap-5">
          <div className="h-[30svh] w-[30svh] relative flex items-center justify-center">
            <div className=" h-[30svh] w-[30svh] rounded-full overflow-hidden flex items-center justify-center">
              <img src="../profile/profile_pic.jpg" alt="" />
            </div>
            <img
              src="../profile/edit.svg"
              alt=""
              className="absolute h-[4vh] -bottom-[2vh] z-10"
            />
          </div>
          <div className="h-[30vh] w-full flex flex-col items-center justify-start gap-2">
            <div className="h-[15svh] w-full relative rounded-lg flex items-center justify-center">
              <div className="h-[15svh] w-full rounded-lg overflow-hidden flex items-center justify-center">
                <img src="../profile/profile_banner.jpg" alt="" />
              </div>
              <img
                src="../profile/edit.svg"
                alt=""
                className="absolute h-[4vh] -bottom-[2vh] right-5 z-10"
              />
            </div>
            <div className="h-[15vh] w-full flex items-center justify-between gap-5">
              <div className="h-[10vh] w-[50%] flex flex-col items-start justify-center gap-2">
                <h4 className="font-[gilroy-bold] text-xs text-[#696969]">
                  NAME:{" "}
                </h4>
                <input
                  type="text"
                  defaultValue="Isagi Youichi"
                  className="h-[7vh] w-full rounded-md bg-[#8800FF33] shadow-lg px-5 placeholder-white font-[gilroy-bold] text-xs text-white border-none focus:border-none focus:outline-none"
                />
              </div>
              <div className="h-[10vh] w-[50%] flex flex-col items-start justify-center gap-2">
                <h4 className="font-[gilroy-bold] text-xs text-[#696969]">
                  USERNAME:{" "}
                </h4>
                <input
                  type="text"
                  defaultValue="isagii077"
                  className="h-[7vh] w-full rounded-md bg-[#8800FF33] shadow-lg px-5 placeholder-white font-[gilroy-bold] text-xs text-white border-none focus:border-none focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-[35vh] w-full flex flex-col items-center justify-center ">
          <div className="h-[10vh] w-full flex flex-col items-start justify-center gap-2">
            <h4 className="font-[gilroy-bold] text-xs text-[#696969]">
              EMAIL:{" "}
            </h4>
            <input
              type="text"
              defaultValue="isagii07@gmail.com"
              className="h-[7vh] w-full rounded-md bg-[#8800FF33] shadow-lg px-5 placeholder-white font-[gilroy-bold] text-xs text-white border-none focus:border-none focus:outline-none"
            />
          </div>
          <div className="h-[15vh] w-full flex flex-col items-start justify-center gap-2">
            <h4 className="font-[gilroy-bold] text-xs text-[#696969]">
              ABOUT ME:{" "}
            </h4>
            <textarea
              className="h-[10vh] w-full rounded-md bg-[#8800FF33] shadow-lg px-5 py-2 font-[gilroy-bold] text-xs text-white border-none focus:border-none focus:outline-none resize-none placeholder-white"
              defaultValue="Hi! I’m Isagi Youichi. I’m a young Japanese streamer originally from Tokyo and now living in London, UK. I adore content creation and streaming but I also love having a voice and being able to use that voice for caus..."
            />
          </div>
          <div className="h-[10vh] w-full flex items-center justify-end">
            <button className="h-[6vh] w-[25%] bg-[#A641FF] rounded-full shadow-lg text-white font-[gilroy-bold] text-xs cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>

        {/* Edit profile form content */}
      </div>
    </div>
  );
};

export default EditProfile;

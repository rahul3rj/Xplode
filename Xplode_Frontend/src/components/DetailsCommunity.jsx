import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const squares = [
  {
    image: "https://cdn2.steamgriddb.com/hero/dbb98c5cb7d0c5942a4a7e47c28bf5fb.jpg",
    title: "The Unkindled One 😏",
    description:
      "Dark Souls continues to push the boundaries with the latest, ambitious chapter in the critically-acclaimed and genre-defining series. Prepare yourself and Embrace The Darkness!",
    subscribers: "203k",
    page: "Moneykitty",
    profile:
      "https://i.pinimg.com/1200x/bb/00/fb/bb00fbabd0a58d0bc918cb8bd5664837.jpg",
  },
  {
    image:
      "https://cdn2.steamgriddb.com/hero/3fcedf144be9f3dff1145db6c515fb34.png",
      title: "The Cheap Thrillers 😎",
    description:
      "Dark Souls continues to push the boundaries with the latest, ambitious chapter in the critically-acclaimed and genre-defining series. Prepare yourself and Embrace The Darkness!",
    subscribers: "78k",
    page: "Luffy_07",
    profile:
      "https://i.pinimg.com/736x/21/53/26/2153260146bd63ceb63741b06a82059f.jpg",
  },
  {
    image:
      "https://cdn2.steamgriddb.com/hero/7da5911f451a4d399d9739416bec1535.jpg",
      title: "The Unkindled One 😏",
    description:
      "Dark Souls continues to push the boundaries with the latest, ambitious chapter in the critically-acclaimed and genre-defining series. Prepare yourself and Embrace The Darkness!",
    subscribers: "203k",
    page: "Moneykitty",
    profile:
      "https://i.pinimg.com/1200x/bb/00/fb/bb00fbabd0a58d0bc918cb8bd5664837.jpg",
  },
  {
    image:
      "https://cdn2.steamgriddb.com/hero/865476c5e0cd0523e326757deceaae4a.png",
      title: "The Cheap Thrillers 😎",
    description:
      "Dark Souls continues to push the boundaries with the latest, ambitious chapter in the critically-acclaimed and genre-defining series. Prepare yourself and Embrace The Darkness!",
    subscribers: "78k",
    page: "Luffy_07",
    profile:
      "https://i.pinimg.com/736x/21/53/26/2153260146bd63ceb63741b06a82059f.jpg",
  },
];

const DetailsCommunity = ({ game }) => {
    const [randomIndex1, setRandomIndex1] = useState(-1);
    const [randomIndex2, setRandomIndex2] = useState(-1);
    const [randomIndex3, setRandomIndex3] = useState(-1);
    const [randomIndex4, setRandomIndex4] = useState(-1);

  function getGameImage(game, randomIndex, fallbackType) {
    if (game?.hero_image?.length > 0 && randomIndex >= 0) {
      return game.hero_image[randomIndex]?.url;
    }

    // Fallbacks
    if (fallbackType === 1) {
      return game?.background_raw || game?.capsule || game?.header;
    } else if (fallbackType === 2) {
      return game?.background || game?.background_raw || game?.header;
    } else if (fallbackType === 3) {
      return game?.header_image || game?.capsule || game?.background_raw;
    } else if (fallbackType === 4) {
      return game?.capsule_image || game?.header || game?.capsule;
    }

    return ""; // nothing available
  }
  return (
    <div className=" h-[50vh] w-full">
      <div className="h-auto w-full relative flex justify-between items-center font-[gilroy-bold] mb-3">
        <h1 className="text-lg text-white font-[gilroy-bold]">
          {game.name} Community
        </h1>
        <div className="h-[3vh] w-[10vw] flex justify-between items-center ">
          <img
            src="../GameList/arrow.svg"
            alt=""
            className="scale-x-[-1] com-swiper-prev cursor-pointer h-[3vh] w-[3vh]"
          />
          <h4 className=" h-[3vh] flex cursor-pointer font-[gilroy-bold] text-zinc-600 text-sm">
            Learn More
          </h4>
          <img
            src="../GameList/arrow.svg"
            alt=""
            className="com-swiper-next cursor-pointer h-[3vh] w-[3vh]"
          />
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        slidesPerView={2}
        spaceBetween={56}
        loop={true}
        navigation={{
          nextEl: ".com-swiper-next ",
          prevEl: ".com-swiper-prev",
        }}
        className="w-[87svw] h-[44vh] object-cover"
      >
        {squares.map((num, idx) => (
          <SwiperSlide key={idx}>
            <div className="h-full w-full flex items-center justify-between rounded-lg text-white text-2xl font-bold ">
              <div className="h-full w-full flex items-center justify-center rounded-xl text-white text-2xl font-bold relative ">
                <img
                   src={getGameImage(game, randomIndex2, 1)}
                  alt=""
                  className="h-full w-full object-cover rounded-xl"
                />

                <div className="h-full w-full absolute z-50 top-0 left-0 flex flex-col justify-start items-center px-10">
                  <div className="h-[70%] w-auto flex flex-col justify-start items-start gap-5">
                    <h3 className="mt-10 font-[gilroy-bold] text-3xl">
                      {game.name}
                    </h3>
                    <p className="w-[50%] text-xs font-[gilroy] font-[500] text-[#D7D7D7]">
                      {game.description}
                    </p>
                  </div>
                  <div className="h-[30%] w-full flex items-center justify-between">
                    <button className="text-sm font-[gilroy-bold] px-4 py-3 rounded-lg bg-black/50 shadow-xl cursor-pointer">
                      Join Community
                    </button>
                    <div className="text-sm font-[gilroy-bold] bg-black/50 px-4 py-1 rounded-lg flex justify-center items-center gap-2 shadow-xl cursor-pointer">
                      <div className="h-[5vh] w-[5vh] rounded-full bg-[#174AFF] overflow-hidden border border-[#A641FF]">
                        <img src={`${num.profile}`} alt="" />
                      </div>
                      <div className="h-full w-auto">
                        <h5 className="text-sm font-[gilroy-bold]">
                          {num.page}
                        </h5>
                        <h5 className="text-[1.3svh] font-[gilroy-bold] text-[#AAA6A6]">
                          {num.subscribers} Subscribers
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-full w-full absolute top-0 left-0 z-10 bg-black/40 rounded-xl"></div>
                <div className="h-full w-full absolute top-0 left-0 z-20 bg-[linear-gradient(69deg,rgba(23,74,255,0.44)_0%,rgba(0,0,0,0.00)_100%)] rounded-xl"></div>
                <div className="h-full w-full absolute top-0 left-0 z-30 bg-[linear-gradient(180deg,rgba(166,65,255,0.20)_0%,rgba(0,0,0,0.00)_100%)] rounded-xl"></div>
                <div className="h-full w-full absolute top-0 left-0 z-40 rounded-xl bg-[linear-gradient(345deg,rgba(255,41,195,0.62)_-4.44%,rgba(0,0,0,0)_79.12%)]"></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DetailsCommunity;

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const squares = [
  {
    title: "Hollow Knight: Silksong",
    logo: "https://cdn2.steamgriddb.com/logo/f10de28ee8e81e49938b0e7e45e369fb.png",
    image:
      "https://cdn2.steamgriddb.com/hero/42cc608cfa36537c60ba2b136c5894b9.png",
    description:
      "Set 300 years after the critically acclaimed Ghost of Tsushima, Ghost of Yōtei is a standalone experience set in 1600s rural Japan. The story follows a haunted, lone mercenary named Atsu.",
    plays: "285k",
    rating: "4.5",
    live: "13",
    tags: ["Action", "Adventure", "Horror"],
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
  },
  {
    title: "Ghost of Yōtei",
    logo: "https://cdn2.steamgriddb.com/logo/12a668c9b2cd45ed4574054750709615.png",
    image:
      "https://cdn2.steamgriddb.com/hero/e1a3a6f38219e9a9689dc1d029efa285.png",
    description:
      "Set 300 years after the critically acclaimed Ghost of Tsushima, Ghost of Yōtei is a standalone experience set in 1600s rural Japan. The story follows a haunted, lone mercenary named Atsu.",
    plays: "285k",
    rating: "4.5",
    live: "13",
    tags: ["Action", "Adventure", "Horror"],
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
  },
  {
    title: "Marvel's Spider-Man 2",
    logo: "https://cdn2.steamgriddb.com/logo/49ac4dcbd03f3f39085f257edefb5d0d.png",
    image:
      "https://cdn2.steamgriddb.com/hero/de8e0f5ad05e445d8dbee32f14011466.png",
    description:
      "Set 300 years after the critically acclaimed Ghost of Tsushima, Ghost of Yōtei is a standalone experience set in 1600s rural Japan. The story follows a haunted, lone mercenary named Atsu.",
    plays: "285k",
    rating: "4.5",
    live: "13",
    tags: ["Action", "Adventure", "Horror"],
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
  },
  {
    title: "Red Dead Redemption II",
    logo: "https://cdn2.steamgriddb.com/logo/ff38348a5adb1889dd55c7ccba583c43.png",
    image:
      "https://cdn2.steamgriddb.com/hero/43520458e6b7fa7397d10f7e3bce3e29.webp",
    description:
      "Set 300 years after the critically acclaimed Ghost of Tsushima, Ghost of Yōtei is a standalone experience set in 1600s rural Japan. The story follows a haunted, lone mercenary named Atsu.",
    plays: "285k",
    rating: "4.5",
    live: "13",
    tags: ["Action", "Adventure", "Horror"],
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
  },
];

const CommunitySection = () => {
  return (
    <div className="py-8 h-[65svh]">
      <div className="h-[3vh] w-[87vw] relative flex justify-between items-center font-[gilroy-bold] ml-7 mb-5">
        <h1 className="text-xl text-white">Community</h1>
        <div className="h-[3vh] w-[10vw] flex justify-between items-center ">
          <img
            src="../GameList/arrow.svg"
            alt=""
            className="scale-x-[-1] com-swiper-prev cursor-pointer hover:bg-white/10 transition-all duration-200 rounded-full p-1"
          />
          <h4 className=" h-[3vh] flex cursor-pointer font-[gilroy-bold] text-zinc-600 text-sm hover:text-zinc-400 transition-all duration-200">
            Learn More
          </h4>
          <img
            src="../GameList/arrow.svg"
            alt=""
            className="com-swiper-next cursor-pointer hover:bg-white/10 hover:scale-103 transition-all duration-200 rounded-full p-1"
          />
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        slidesPerView={2}
        spaceBetween={16}
        loop={true}
        navigation={{
          nextEl: ".com-swiper-next ",
          prevEl: ".com-swiper-prev",
        }}
        className="w-[87svw] h-[53svh]"
      >
        {squares.map((num, idx) => (
          <SwiperSlide key={idx}>
            <div className="h-[53svh] w-[43svw] flex items-center justify-between rounded-lg text-white text-2xl overflow-hidden relative ">
              <img
                src={num.image}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="h-full w-full absolute top-0 left-0 z-10 bg-black/50 rounded-lg"></div>
              <div className="h-full w-full absolute top-0 left-0 z-20 bg-[linear-gradient(69deg,rgba(23,74,255,0.44)_0%,rgba(0,0,0,0.00)_100%)] rounded-lg"></div>
              <div className="h-full w-full absolute top-0 left-0 z-30 bg-[linear-gradient(180deg,rgba(166,65,255,0.20)_0%,rgba(0,0,0,0.00)_100%)] rounded-lg"></div>
              <div className="h-full w-full absolute top-0 left-0 z-40 rounded-lg bg-[linear-gradient(345deg,rgba(255,41,195,0.62)_-4.44%,rgba(0,0,0,0)_55.12%)]"></div>

              <div className="absolute w-full h-full flex items-center justify-start z-50">
                <div className="h-[7vw]  top-5 left-7 absolute">
                  <img
                    src={num.logo}
                    alt=""
                    className="h-[6.7vw] object-cover"
                  />
                </div>
                <div className="h-[20vh] w-[19vw] flex flex-col justify-between items-start absolute left-7 top-35">
                  <div className="h-[3vh] w-[10vw] flex items-center justify-between">
                    <div className="text-white flex items-center justify-center font-[gilroy] text-xs text-[gilroy] gap-2">
                      <i class="ri-play-fill text-[#8AFF41]"></i>
                      <h3>{num.plays} Plays</h3>
                    </div>
                    <div className="text-white flex items-center justify-center font-[gilroy] text-xs text-[gilroy] gap-2">
                      <img src="https://img.icons8.com/?size=512&id=HAdDrhGGO64N&format=png" alt="" className="w-4 h-4"/>
                      <h3>{num.live} Live</h3>
                    </div>

                  </div>
                  <div className="h-[10vh] w-[19vw]">
                    <p className="text-white text-xs font-[gilroy]">{num.description}</p>
                  </div>
                  <div className="h-[4vh] w-[15vw] flex items-center justify-center">
                  {num.tags.map((tag, tagIdx) => (
                    <h2
                      key={tagIdx}
                      className={`text-white text-xs font-[gilroy] cursor-pointer px-4 py-1 rounded-full transition-all duration-600 ${
                        tagIdx === 0
                          ? "bg-[#A641FF]/50"
                          : "hover:bg-[#A641FF]/50 "
                      }`}
                      onMouseEnter={(e) => {
                        // Remove highlight from all tags in this card
                        e.currentTarget.parentElement
                          .querySelectorAll("h2")
                          .forEach((el) =>
                            el.classList.remove("bg-[#A641FF]/50")
                          );
                        // Highlight hovered tag
                        e.currentTarget.classList.add("bg-[#A641FF]/50");
                      }}
                      onMouseLeave={(e) => {
                        // Remove highlight from all tags in this card
                        e.currentTarget.parentElement
                          .querySelectorAll("h2")
                          .forEach((el) =>
                            el.classList.remove("bg-[#A641FF]/50")
                          );
                        // Re-highlight first tag
                        e.currentTarget.parentElement
                          .querySelector("h2")
                          .classList.add("bg-[#A641FF]/50");
                      }}
                    >
                      {tag}
                    </h2>
                  ))}
                  </div>
                </div>
                <div className="h-[6vh] w-[90%] absolute left-7 bottom-7 flex items-center justify-between">
                  <h2 className="text-white text-xs font-[gilroy] bg-[#A641FF]/50 hover:bg-[#A641FF]/70 transition-all duration-200 px-6 py-3 rounded-full gap-2 flex items-center justify-center cursor-pointer shadow-[0px_4px_30.600000381469727px_0px_rgba(0,0,0,0.25)] backdrop-blur-xs"><i class="ri-play-fill text-white"></i>Community Media</h2>
                  <h2 className="text-white text-xs font-[gilroy] bg-[#A641FF]/50 hover:bg-[#A641FF]/70 transition-all duration-200 px-6 py-3 rounded-full gap-2 flex items-center justify-center cursor-pointer shadow-[0px_4px_30.600000381469727px_0px_rgba(0,0,0,0.25)] backdrop-blur-xs"><i class="ri-add-line text-white"></i>Add Game</h2>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CommunitySection;

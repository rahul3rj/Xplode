import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const squares = [
  {
    title: "Elden Ring",
    image: "../GameList/er.jpg",
    image2: "../GameList/er1.jpg",
    price1: "$23.09",
    price2: "$34.99",
    discount: "-20%",
    username: "natasha_07",
    profile: "",
    description: "Always knew this animation reminds me something",
    Likes: "58k",
    Comments: "23k",
  },
  {
    title: "Counter Strike 2",
    image: "../GameList/cs2.jpg",
    image2: "../GameList/er1.jpg",
    price1: "$23.09",
    price2: "$34.99",
    discount: "-20%",
    username: "natasha_07",
    profile: "",
    description: "Always knew this animation reminds me something",
    Likes: "58k",
    Comments: "23k",
  },
];

const CommunitySection = () => {
  return (
    <div className="py-8 h-[65svh]">
        <div className="h-[3vh] w-[87vw] relative flex justify-between items-center font-[gilroy-bold] ml-7 mb-5">
        <h1 className="text-xl text-white">Community</h1>
        <div className="h-[3vh] w-[10vw] flex justify-between items-center ">
            <img src="../GameList/arrow.svg" alt="" className="scale-x-[-1] com-swiper-prev cursor-pointer"/>
            <h4 className=" h-[3vh] flex cursor-pointer font-[gilroy-bold] text-zinc-600 text-lg">
              Learn More 
            </h4>
            <img src="../GameList/arrow.svg" alt="" className="com-swiper-next cursor-pointer"/>
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        spaceBetween={16}
        loop={true}
        navigation={{
            nextEl: ".com-swiper-next ",
            prevEl: ".com-swiper-prev"
          }}
        className="w-[87svw] h-[53svh]"
      >
        {squares.map((num, idx) => (
          <SwiperSlide key={idx}>
            <div className="h-[53svh] w-[87svw] flex items-center justify-between rounded-lg text-white text-2xl font-bold">
              <div className="h-[53svh] w-[43svw] flex items-center justify-center rounded-3xl text-white text-2xl font-bold relative">
                <img src={`${num.image2}`} alt="" className="h-full w-full rounded-3xl" />
                <div className="h-[20%] absolute z-10 bottom-0 w-[100%] rounded-lg flex justify-center items-center backdrop-blur-sm">
                  <div className="h-[10svh] w-[60%] flex flex-col justify-center items-start">
                    <h1 className="font-[gilroy-ebold] text-xl ml-7">
                      {num.title}
                    </h1>
                    <img src="../Slider/win.svg" alt="" className="ml-7 py-2" />
                  </div>
                  <div className="h-[10svh] w-[40%] flex justify-center items-center">
                    <div className="h-[50%] w-[30%] rounded-sm bg-[#8AFF41] flex justify-center items-center">
                      <h1 className="font-[gilroy-ebold] text-black text-xl">
                        {num.discount}
                      </h1>
                    </div>
                    <div className="h-[60%] w-[45%] flex flex-col justify-center items-center">
                      <h1 className="font-[gilroy-ebold] text-[#696969] line-through">
                        {num.price2}
                      </h1>
                      <h1 className="font-[gilroy-ebold] text-[#8AFF41]">
                        {num.price1}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[53svh] w-[43svw] bg-transparent flex items-center justify-center rounded-lg text-white text-2xl font-bold relative">
                <img
                  src="../Slider/details1.svg"
                  alt=""
                  className="h-full w-full opacity-30 "
                />
                <div className="absolute h-[100%] w-[100%] flex flex-col justify-center items-center">
                  <div className=" w-[90%] flex justify-between items-center mb-3">
                    <h1 className="font-[gilroy-ebold]">Top Post</h1>
                    <img src="../threedot.svg" alt="" className="cursor-pointer" />
                  </div>
                  <div className=" w-[90%] flex justify-start items-center mb-3">
                    <div className="h-[6svh] w-[6svh] rounded-full object-cover">
                      <img
                        src="../HomePage/profile.jpg"
                        alt=""
                        className="object-cover h-full w-full rounded-full"
                      />
                    </div>
                    <div className="h-[6svh] w-[40svh]">
                        <h2 className="text-xl font-[gilroy-bold] ml-5 text-white">xp/{num.title}</h2>
                        <h2 className="text-sm font-[gilroy-bold] ml-5 text-zinc-600">@{num.username}</h2>
                    </div>
                  </div>
                  <div className="w-[90%] flex justify-start items-center mb-3">
                    <h2 className="font-[gilroy-bold] text-lg">{num.description}</h2>
                  </div>
                  <div className="h-[40%] w-[90%] object-cover overflow-hidden rounded-lg flex justify-center items-center mb-3">
                    <img src={`${num.image}`} alt="" className=" w-full "/>
                  </div>
                  <div className="h-[10%] w-[90%] flex justify-start items-center">
                    <div className="h-[4svh] w-[10svh] rounded-full bg-[#A641FF]/33 flex justify-between items-center cursor-pointer mr-3">
                      <img src="../CommunitySection/Like.svg" alt="" className="h-[70%] ml-3" />
                      <h2 className="text-lg font-[gilroy-bold] mr-3">{num.Likes}</h2>
                    </div>
                    <div className="h-[4svh] w-[10svh] rounded-full bg-[#A641FF]/33 flex justify-between items-center cursor-pointer mr-3">
                      <img src="../CommunitySection/comment.svg" alt="" className="h-[70%] ml-3" />
                      <h2 className="text-lg font-[gilroy-bold] mr-3">{num.Comments}</h2>
                    </div>
                    <div className="h-[4svh] w-[4svh] rounded-full bg-[#A641FF]/33 flex justify-center items-center cursor-pointer">
                      <img src="../CommunitySection/share.svg" alt="" className="h-[70%]" />
                    </div>
                  </div>
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

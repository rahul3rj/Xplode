import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

const categories = [
  {
    name: "Action",
    image: "../CategoryPage/Action.png",
  },
  {
    name: "RPG",
    image: "../CategoryPage/RPG.png",
  },
  {
    name: "Free-to-play",
    image: "../CategoryPage/FTP.png",
  },
  {
    name: "Anime",
    image: "../CategoryPage/Anime.png",
  },
  {
    name: "Co-Op",
    image: "../CategoryPage/Co-op.png",
  },
  {
    name: "Action",
    image: "../CategoryPage/Action.png",
  },
  {
    name: "RPG",
    image: "../CategoryPage/RPG.png",
  },
  {
    name: "Free-to-play",
    image: "../CategoryPage/FTP.png",
  },
  {
    name: "Anime",
    image: "../CategoryPage/Anime.png",
  },
  {
    name: "Co-Op",
    image: "../CategoryPage/Co-op.png",
  },
];

const Category = () => {
  return (
    <>
      <div className="h-[35svh] w-full flex flex-col justify-center items-center relative">
        <div className="h-[10%] w-[87vw] flex justify-between items-center mb-5">
          <h1 className="text-xl font-[gilroy-bold] text-white">Category</h1>
          <h4 className="text-lg font-[gilroy-bold] text-zinc-600 cursor-pointer">
            Learn More
          </h4>
        </div>
        <img
          src="../GameList/arrow.svg"
          alt=""
          className="category-swiper-next absolute top-1/2 right-1/20 cursor-pointer"
        />
        <img
          src="../GameList/arrow.svg"
          alt=""
          className="category-swiper-prev absolute top-1/2 left-1/20 scale-x-[-1] cursor-pointer"
        />
        <Swiper
          modules={[Navigation]}
          slidesPerView={6}
          spaceBetween={60}
          loop={true}
          navigation={{
            nextEl: ".category-swiper-next ",
            prevEl: ".category-swiper-prev",
          }}
          className="w-[75vw] flex justify-center items-center cursor-pointer"
        >
          {categories.map((cat, idx) => (
            <SwiperSlide key={idx} className="flex justify-center items-center">
              <div className="w-[20svh] h-[20svh] bg-transparent rounded-lg flex items-center justify-center text-xl font-bold relative">
                <img
                  src={`${cat.image}`}
                  alt=""
                  className="h-full w-full rounded-lg"
                />
                <h1 className="absolute z-10 text-white font-[gilroy-bold]">{`${cat.name}`}</h1>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default Category;

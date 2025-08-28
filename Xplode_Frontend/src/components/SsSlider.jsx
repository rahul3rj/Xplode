import React, { useState } from "react";

const images = [
  "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_12c4d9a3c04d6d340ffea9335441eb2ad84e0028.600x338.jpg",
  "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_1318a04ef11d87f38aebe6d47a96124f8f888ca8.600x338.jpg",
  "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/ss_1c0fa39091901496d77cf4cecfea4ffb056d6452.600x338.jpg",
];

const SsSlider = () => {
  const [index, setIndex] = useState(1); 

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const leftImg = images[(index - 1 + images.length) % images.length];
  const centerImg = images[index];
  const rightImg = images[(index + 1) % images.length];

  return (
    <div className="h-full w-full flex justify-center items-end relative">
      {/* left */}
      <div className="h-[20vh] w-[18vw]">
        <div className="relative h-full w-full">
          <img src={leftImg} alt="left" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      </div>
      {/* center */}
      <div className="h-[30vh] w-[24vw]">
        <img
          src={centerImg}
          alt="center"
          className="h-full w-full object-cover"
        />
      </div>
      {/* right */}
      <div className="h-[20vh] w-[18vw]">
        <div className="relative h-full w-full">
          <img src={rightImg} alt="right" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      </div>

      {/* prev button */}
      <div
        onClick={prevSlide}
        className=" absolute left-0 top-1/2 -translate-y-1/2 z-30 cursor-pointer bg-black/40 hover:bg-black rounded-full h-[6svh] w-[6svh] flex items-center justify-center"
      >
        <i className="ri-arrow-left-s-line text-white text-2xl"></i>
      </div>

      {/* next button */}
      <div
        onClick={nextSlide}
        className=" absolute right-0 top-1/2 -translate-y-1/2 z-30 cursor-pointer bg-black/40 hover:bg-black rounded-full h-[6svh] w-[6svh] flex items-center justify-center"
      >
        <i className="ri-arrow-right-s-line text-white text-2xl"></i>
      </div>
    </div>
  );
};

export default SsSlider;













{/* <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            centeredSlides={true}
            slidesPerView={3}
            initialSlide={Math.floor(images.length / 2)}
            loop={false}
            spaceBetween={0}
            className="w-full h-full"
          >
            {images.map((img, idx) => (
              <SwiperSlide
                key={idx}
                className="flex justify-center items-center"
              >
                {({ isActive }) => (
                  <img
                    src={img}
                    alt=""
                    className={`transition-all duration-500 mx-auto rounded-xl shadow-lg object-cover
            ${
              isActive
                ? "w-[32vw] h-[40vh] translate-y-0 scale-100 z-40 absolute z-90 "
                : "w-[25vw] h-[30vh] translate-y-8 -translate-x-8 first:translate-x-8 scale-80 opacity-70 z-30"
            }
          `}
                  />
                )}
              </SwiperSlide>
            ))}

            <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-30 cursor-pointer bg-black/40 hover:bg-black rounded-full h-[6svh] w-[6svh] flex items-center justify-center">
              <i className="ri-arrow-left-s-line text-white text-2xl"></i>
            </div>
            <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-30 cursor-pointer bg-black/40 hover:bg-black rounded-full h-[6svh] w-[6svh] flex items-center justify-center">
              <i className="ri-arrow-right-s-line text-white text-2xl"></i>
            </div>
          </Swiper> */}


"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    title: "Modern Warfare 3",
    description: "Modern Warfare 3 (2023) is a fast-paced FPS where Task Force 141 battles Makarov in an intense campaign with evolved multiplayer.",
    price: "₹2999 INR",
    image: "/cover1.jpg",
    screenshots: ["/img_1.jpg", "/img_2.jpg"]
  },
  {
    title: "Cyberpunk 2077",
    description: "Cyberpunk 2077 is an open-world RPG set in Night City, offering high-octane action, deep storylines, and immersive world-building.",
    price: "₹3499 INR",
    image: "/cover2.jpg",
    screenshots: ["/2_img1.jpg", "/2_img2.jpg"]
  },
  {
    title: "Elden Ring",
    description: "Elden Ring is an epic action RPG from FromSoftware, featuring vast exploration, intense combat, and deep lore.",
    price: "₹3999 INR",
    image: "/cover3.jpg",
    screenshots: ["/3_img1.jpg", "/3_img_2.jpg"]
  },
  {
    title: "God of War Ragnarok",
    description: "Embark on a mythological journey with Kratos and Atreus in God of War Ragnarok, featuring intense battles and gripping storytelling.",
    price: "₹4499 INR",
    image: "/cover4.jpg",
    screenshots: ["/4_img1.jpg", "/4_img2.jpg"]
  }
];

export default function GameSlider() {
  return (
    // <div className="w-full h-screen flex justify-center items-center bg-[#2D142C]">
      <Swiper
        slidesPerView={1}
        effect="fade"
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="h-[65vh] w-[81vw]  flex"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="flex flex-col gap-6">
            {/* Left: Main Image */}
            <div className="h-[60vh] w-[53vw] bg-zinc-600 rounded-2xl overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-xl "
              />
            </div>

            {/* Right: Game Details */}
            <div className="h-[65vh] w-[31vw] flex absolute top-0 right-[-3vw]">
              <div className='h-[65vh] w-[31vw] flex relative'>
                <div className='h-[40vh] w-[27vw] bg-[#121921] mx-5 rounded-2xl absolute z-0 istok-web-regular'>
                    <h1 className='absolute z-20 text-white istok-web-regular text-[3vh] ml-10 mt-10 mb-5 '>{slide.title}</h1>
                    <p className='w-[20vw] absolute z-20 top-21 text-zinc-400 istok-web-regular text-[2vh] ml-10 pt-5 mb-5'>{slide.description}</p>
                    <p className='w-[20vw] absolute z-20 top-51 text-white istok-web-regular text-[2vh] ml-10 pt-5 mb-5'>{slide.price}</p>
                    <button className='absolute z-20 h-[6vh] w-[12vw] bg-[#090909]/37 text-white text-xl bottom-10 ml-10 rounded-xl cursor-pointer shadow-xl'>Available now</button>
                    <img src="/win_logo.png" className='absolute z-20 bottom-13 right-15 ' alt="" width='30' />
                            
                    <div className='grad_1 h-[40vh] w-[27vw] bg-[#121921] rounded-2xl z-10 absolute'></div>
                    <div className='grad_2 h-[40vh] w-[27vw] bg-[#121921] rounded-2xl z-10 absolute'></div>
                    <div className='grad_3 h-[40vh] w-[27vw] bg-[#121921] rounded-2xl z-10 absolute'></div>
                </div>
                <div className='h-[25vh] w-[27vw] absolute bottom-0 mx-5 flex '>
                    <div className='h-[18vh] w-[13vw] bg-[#121921]  my-5 mr-5 rounded-2xl overflow-hidden'>
                        <img src={slide.screenshots[0]} className='h-full w-full object-cover' alt="" />
                    </div>
                    <div className='h-[18vh] w-[13vw] bg-[#121921]  my-5 rounded-2xl overflow-hidden'>
                        <img src={slide.screenshots[1]} className='h-full w-full object-cover' alt="" />
                    </div>
                </div>
            </div>
            </div>
            
          </SwiperSlide>
        ))}
      </Swiper>
    // </div>
  );
}

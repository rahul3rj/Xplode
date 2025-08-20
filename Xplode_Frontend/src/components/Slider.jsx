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
    image: "https://cdn2.steamgriddb.com/grid/976e6cb2f9caea318b775f8ab300ebd1.jpg",
    screenshots: ["../Slider/ss1.jpg", "../Slider/ss2.jpg"]
  },
  {
    title: "Cyberpunk 2077",
    description: "Cyberpunk 2077 is an open-world RPG set in Night City, offering high-octane action, deep storylines, and immersive world-building.",
    price: "₹3499 INR",
    image: "https://cdn2.steamgriddb.com/grid/8c048326e93a94589190693897ce3456.jpg",
    screenshots: ["../Slider/ss1.jpg", "../Slider/ss2.jpg"]
  },
  {
    title: "Elden Ring",
    description: "Elden Ring is an epic action RPG from FromSoftware, featuring vast exploration, intense combat, and deep lore.",
    price: "₹3999 INR",
    image: "https://cdn2.steamgriddb.com/grid/d00afdeafe11d50fcecedac911e278aa.png",
    screenshots: ["../Slider/ss1.jpg", "../Slider/ss2.jpg"]
  },
  {
    title: "God of War Ragnarok",
    description: "Embark on a mythological journey with Kratos and Atreus in God of War Ragnarok, featuring intense battles and gripping storytelling.",
    price: "₹4499 INR",
    image: "https://cdn2.steamgriddb.com/grid/245c498e6413ad98feab0bb3ae6275d5.png",
    screenshots: ["../Slider/ss1.jpg", "../Slider/ss2.jpg"]
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
        className="h-[55vh] w-[87vw]  flex"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="flex flex-col gap-6">
            {/* Left: Main Image */}
            <div className="h-[50vh] w-[54.5vw] bg-zinc-600 rounded-2xl overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-xl "
              />
            </div>

            {/* Right: Game Details */}
            <div className="h-[50vh] w-[30vw] flex absolute top-0 right-[2vw]">
              <div className='h-[50vh] w-[31vw] flex relative'>
                {/* Game details card */}
                <div className='h-[33vh] w-[29vw] bg-[#121921] mx-2 rounded-2xl absolute z-10 font-[gilroy-bold] p-9 flex flex-col justify-center'>
                    <h1 className='text-white font-[gilroy-bold] text-lg mb-4'>{slide.title}</h1>
                    <p className='text-zinc-400 font-[gilroy] text-xs mb-4'>{slide.description}</p>
                    <p className='text-white font-[gilroy-bold] text-[2vh] mb-4'>{slide.price}</p>
                    <div className='flex items-center justify-between'>
                        <button className='h-[5vh] w-[10vw] bg-[#090909]/37 hover:bg-[#A641FF] transition-colors text-white text-sm rounded-xl cursor-pointer shadow-xl'>
                            Add to vault
                        </button>
                        <img 
                            src="../Slider/win.svg" 
                            className='h-8 w-auto' 
                            alt="Windows Platform" 
                        />
                    </div>
                    <img 
                        src="../Slider/details1.svg" 
                        alt="Background Pattern" 
                        className="absolute inset-0 h-full w-full rounded-2xl object-cover -z-10"
                    />        
                </div>

                {/* Screenshot thumbnails */}
                <div className='h-[17vh] w-[30vw] absolute bottom-0 flex justify-center items-end gap-4'>
                    <div className='h-[15vh] w-[14vw] bg-[#121921] rounded-2xl overflow-hidden'>
                        <img 
                            src={slide.screenshots[0]} 
                            className='h-full w-full object-cover' 
                            alt={`${slide.title} Screenshot 1`} 
                        />
                    </div>
                    <div className='h-[15vh] w-[14vw] bg-[#121921] rounded-2xl overflow-hidden'>
                        <img 
                            src={slide.screenshots[1]} 
                            className='h-full w-full object-cover' 
                            alt={`${slide.title} Screenshot 2`} 
                        />
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
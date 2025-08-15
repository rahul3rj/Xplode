import React, { useState } from "react";
import GameCard from "./GameCard";
import GameBanner from "./GameBanner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// about_the_game
// : 
// "The apocalypse came and a huge number of zombies invaded the planet. Help the main character protect himself and his refuge from the attack of bloodthirsty monsters.<br />\r\n<br />\r\nThe game is a 2D platformer with a side view of the game. The main task of the game is to protect the checkpoint from bloodthirsty zombies and prevent them from breaking inside, because there are people in the building, and the walking dead are eager to taste their brains. Destroying the wave of enemies after the wave, we collect the fallen coins, on which we can buy improved weapons and supplies for them, as well as we can upgrade the structure.<br />\r\n<br />\r\nGame Features:<br />\r\n- 4 types of weapons<br />\r\n- Old school gameplay<br />\r\n- Pixel art graphics"
// appid
// : 
// 1211800
// capsule_image
// : 
// "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1211800/capsule_231x87.jpg?t=1577701236"
// description
// : 
// "The game is a 2D platformer with a side view of the game. The main task of the game is to protect the checkpoint from bloodthirsty zombies and prevent them from breaking inside"
// genres
// : 
// (4) ['Action', 'Adventure', 'Indie', 'Simulation']
// header_image
// : 
// "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1211800/header.jpg?t=1577701236"
// lastUpdated
// : 
// "2025-05-26T13:18:39.792Z"
// mac_requirements
// : 
// []
// name
// : 
// "Live checkpoint"
// pc_requirements
// : 
// {minimum: '<strong>Minimum:</strong><br><ul class="bb_ul"><li…>Storage:</strong> 8 MB available space</li></ul>'}
// platforms
// : 
// {windows: true, mac: false, linux: false}
// portraitUrl
// : 
// "https://cdn2.steamgriddb.com/grid/a2e03ee2dcf2a4270725d336fbb3db30.jpg"
// price
// : 
// "₹ 31"
// release_date
// : 
// "30 Dec, 2019"
// supported_languages
// : 
// "English"
// website
// : 
// "No website available"
// __v
// : 
// 0
// _id
// : 
// "68346a2f957dffa8f3b73097"


// const gamess = [
//     { title: "Elden Ring", image: "../GameList/er.jpg", image2: "../GameList/er1.jpg", price1:"$23.09", price2:"$34.99", discount:"-20%"  },
//     { title: "Counter Strike 2", image: "../GameList/cs2.jpg", image2: "../GameList/er1.jpg", price1:"$23.09", price2:"$34.99", discount:"-20%"  },
//     { title: "Cyberpunk 2077", image: "../GameList/cyberpunk.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
//     { title: "Stray", image: "../GameList/stray.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
//     { title: "Red Dead Redemption 2", image: "../GameList/cyberpunk.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
//     { title: "The Witcher 3", image: "../GameList/stray.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99",  discount:"-20%"  },
//     { title: "Counter Strike 2", image: "../GameList/cs2.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
//     { title: "Cyberpunk 2077", image: "../GameList/cyberpunk.jpg", image2: "../GameList/er1.jpg" , price1:"$23.09", price2:"$34.99", discount:"-20%"  },
//   ];

  const truncate = (str, maxLength) => {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const GameList = ({games, title, nextClass, prevClass }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const chunkSize = 6; // Number of games per slide/banner
    const gameChunks = chunkArray(games, chunkSize);
  return (
    <>
      <div className="py-8 text-white">
      <div className="h-[3vh] w-[87vw] relative flex justify-between items-center font-[gilroy-bold] ml-7 ">
        <h1 className="text-xl">{title}</h1>
        <div className="h-[3vh] w-[10vw] flex justify-between items-center ">
            <img src="../GameList/arrow.svg" alt="" className={`scale-x-[-1] ${prevClass} cursor-pointer`} />
            <h4 className=" h-[3vh] flex cursor-pointer font-[gilroy-bold] text-zinc-600 text-lg">
              Learn More 
            </h4>
            <img src="../GameList/arrow.svg" alt="" className={`${nextClass} cursor-pointer`} />
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        spaceBetween={20}
        navigation={{
          nextEl: `.${nextClass}`,
          prevEl: `.${prevClass}`
        }}
        loop={false}
        className="mt-5 w-[87vw] "
      >
        {gameChunks.map((chunk, idx) => (
          <SwiperSlide key={idx}>
            <GameBanner games={chunk} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </>
  );
};

export default GameList;

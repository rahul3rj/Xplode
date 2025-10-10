import React, { useState, useEffect, useRef } from "react";
import ColorThief from "colorthief";

const GameCard = ({ image, bg, name, price, genres, isActive }) => {
  const [colorPalette, setColorPalette] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = bg;

        img.onload = () => {
          const colorThief = new ColorThief();
          // Get palette of 5 colors instead of just dominant color
          const palette = colorThief.getPalette(img, 5);
          // Sort colors from lightest to darkest
          const sortedPalette = [...palette].sort((a, b) => {
            const brightnessA = (a[0] * 299 + a[1] * 587 + a[2] * 114) / 1000;
            const brightnessB = (b[0] * 299 + b[1] * 587 + b[2] * 114) / 1000;
            return brightnessB - brightnessA;
          });
          setColorPalette(sortedPalette);
        };
      } catch (error) {
        console.error("Error extracting colors:", error);
      }
    };

    loadImage();
  }, [bg]);

  const gradientBackground = colorPalette
    ? `linear-gradient(to bottom, 
          rgba(54, 20, 65, 0.4)
      )`
    : "linear-gradient(to bottom, rgba(69, 40, 10, 0.3), rgba(69, 40, 10, 0.7))";

  const bgcircle = colorPalette
    ? `linear-gradient(to bottom, 
          rgba(${colorPalette[3][0]}, ${colorPalette[3][1]}, ${colorPalette[3][2]}, 0.8)
      )`
    : "linear-gradient(to bottom, rgba(69, 40, 10, 0.3), rgba(69, 40, 10, 0.7))";

  return (
    <>
      <div className="relative overflow-hidden"> 
        {/* Image container - unified transition duration and easing */}
        <div
          className={`h-[36vh] rounded-t-lg overflow-hidden shadow-lg cursor-pointer relative transition-all duration-500 ease-in-out transform ${
            isActive ? "w-[28vw]" : "w-[11vw]"
          }`}
        >
          <img
            ref={imageRef}
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out transform absolute z-10 ${
              isActive ? "opacity-0" : "opacity-100"
            }`}
          />
          <img
            src={bg}
            alt={name}
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out absolute`}
          />
        </div>

        {/* Bottom bar - synced transition */}
        <div
          className="h-[11svh] w-full px-5 flex justify-between items-center cursor-pointer relative rounded-b-lg transition-all duration-500 ease-in-out"
          style={{
            background: gradientBackground,
          }}
        >
          <div
            className={`h-[8svh] ${
              isActive ? "w-full" : "w-[8vw]"
            } flex flex-col justify-between items-start transition-all duration-500 ease-in-out`}
          >
            <h1
              className={`text-white text-[1rem] w-full font-bold font-[gilroy-bold] truncate`}
            >
              {name}
            </h1>
            <div className="w-full flex flex-row justify-start items-center gap-2 truncate">
              {genres
                .slice(0, isActive ? 4 : 2)
                .map((genre, idx, arr) => (
                  <h3
                    key={idx}
                    className={`text-white text-[10px] font-[gilroy] px-3 py-1 rounded-full transition-all duration-500 ease-in-out ${
                      isActive
                        ? idx === arr.length - 1
                          ? "truncate"
                          : ""
                        : idx === 1
                        ? "truncate"
                        : ""
                    }`}
                    style={{
                      background: bgcircle.replace("0.8", "0.3"),
                    }}
                  >
                    {genre}
                  </h3>
                ))}
            </div>
          </div>

          {/* Win icon - synced fade */}
          <div
            className={`h-[4svh] flex flex-col transition-all duration-500 ease-in-out absolute right-4 justify-between items-end ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="h-[4svh] flex flex-col justify-center items-center">
              <img src="../Slider/win.svg" alt="" />
            </div>
          </div>
        </div>

        {/* Blur circle - synced transition */}
        <div
          className={`absolute -z-10 top-4/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out h-[20svh] ${
            isActive ? "w-[70vh]" : "w-[40svh]"
          } rounded-[50%] blur-2xl bg-[#696969]`}
          style={{
            background: bgcircle,
          }}
        ></div>
      </div>
    </>
  );
};

export default GameCard;

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

  // rgba(${colorPalette[0][0]}, ${colorPalette[0][1]}, ${colorPalette[0][2]}, 0.5),
  // rgba(${colorPalette[1][0]}, ${colorPalette[1][1]}, ${colorPalette[1][2]}, 0.5),
  // rgba(${colorPalette[2][0]}, ${colorPalette[2][1]}, ${colorPalette[2][2]}, 0.5),
  // rgba(${colorPalette[3][0]}, ${colorPalette[3][1]}, ${colorPalette[3][2]}, 0.5),
  // rgba(${colorPalette[4][0]}, ${colorPalette[4][1]}, ${colorPalette[4][2]}, 0.5)

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

        <div
          className={`h-[36vh] rounded-t-lg overflow-hidden shadow-lg cursor-pointer relative duration-600 transform ${isActive ? "w-[28vw]" : "w-[11vw]"
            }`}
        >
          <img
            ref={imageRef}
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-opacity duration-400 ease-in-out transform absolute z-10 ${isActive ? "opacity-0" : "opacity-100"
              }`}
          />
          <img
            src={bg}
            alt={name}
            className={`w-full h-full object-cover transition-opacity absolute`}
          />
        </div>
        <div
          className="h-[11svh] w-full px-[1.4vw] flex justify-between items-center cursor-pointer relative rounded-b-lg"
          style={{
            background: gradientBackground,
            transition: "background 0.5s ease",
          }}
        >
          <div className="h-[11svh] flex flex-col justify-center items-start">
            <h1 className="text-white text-[1rem] font-bold font-[gilroy-bold]">
              {name}
            </h1>
            <h4 className="text-[#696969] text-[0.7rem] font-[gilroy-bold] mb-1">Valve</h4>
            <h3 className="text-white text-sm font-[gilroy-ebold]">{price}</h3>

          </div>
          <div
            className={`h-[8svh] flex flex-col transition-opacity absolute right-4 ${isActive ? "duration-700" : "duration-300"
              } ease-in-out ${isActive ? "opacity-100" : "opacity-0"
              } justify-between items-end`}
          >
            <div className="flex flex-row justify-center items-center gap-2">
              {genres.map((genre, idx) => (
                <h3
                  key={idx}
                  className="text-white text-xs font-[gilroy-bold]">
                  {genre}
                </h3>
              ))}
            </div>
            <div className="h-[4svh] flex flex-col justify-center items-center">
              <img src="../Slider/win.svg" alt="" />
            </div>
          </div>
        </div>
        <div
          className={`absolute -z-10 top-4/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 h-[20svh]  ${isActive ? "w-[70vh]" : "w-[40svh]"
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

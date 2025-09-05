import React, { useRef, useState, useEffect, useMemo } from "react";
import { gsap } from "gsap";

const SsSlider = ({ screenshots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsRef = useRef([]);
  const isAnimating = useRef(false);

 const visibleScreenshots = useMemo(() => {
    if (!screenshots || screenshots.length === 0) return [];
    return screenshots.slice(0, 3); // bas pehli 3 images
  }, [screenshots]);


  // Handle circular navigation
  const goToSlide = (direction) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setCurrentIndex(
      (prev) => (prev + direction + visibleScreenshots.length) % visibleScreenshots.length
    );
  };

  // Animation effect
  useEffect(() => {

    // Now animate to new positions
    const animationPromises = itemsRef.current.map((item, index) => {
      if (!item) return Promise.resolve();

      const position = (index - currentIndex + visibleScreenshots.length) % visibleScreenshots.length;
      const isCenter = position === 0;
      const isRight = position === 1;
      const isLeft = position === visibleScreenshots.length - 1;

      if (isCenter || isLeft || isRight) {
        let xPosition, scale, opacity, zIndex;

        if (isCenter) {
          xPosition = 0;
          scale = 1;
          opacity = 1;
        } else if (isRight) {
          xPosition = 275;   // right side
          scale = 0.6;
          opacity = 0.8;
        } else if (isLeft) {
          xPosition = -275;  // left side
          scale = 0.6;
          opacity = 0.8;
        }

        // Create timeline for this item
        const tl = gsap.timeline();

        // Position and scale animations
        tl.to(item, {
          x: xPosition,
          scale: scale,
          opacity: opacity,
          zIndex: isCenter ? 10 : 1,
          duration: 0.1,
          ease: "power2.out",
        });

        tl.eventCallback("onComplete", () => {
          if (isCenter) isAnimating.current = false;
        });

        return tl;
      }
      return Promise.resolve();
    });

    Promise.all(animationPromises);
  }, [currentIndex, visibleScreenshots.length]);

  // Handle empty screenshots
  if (!visibleScreenshots || visibleScreenshots.length === 0) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        No screenshots available
      </div>
    );
  }

  return (
    <div className="h-full w-full flex justify-center items-center relative overflow-hidden">
      {/* Slider track */}
      <div className="flex items-center justify-center h-full w-full relative">
        {visibleScreenshots.map((screenshot, index) => {
          const position = (index - currentIndex + visibleScreenshots.length) % visibleScreenshots.length;
          const isVisible = position === 0 || position === 1 || position === visibleScreenshots.length - 1;

          return (
            <div
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              className="absolute h-[35vh] w-[28vw] transition-all duration-300"
              style={{
                pointerEvents: position === 0 ? "auto" : "none",
                display: isVisible ? "block" : "none",
              }}
            >
              {/* Main image container with hexagon clip */}
              <div className="absolute inset-0 [clip-path:polygon(0%_0%,75%_0%,100%_25%,100%_100%,25%_100%,0%_75%)] bg-black/50">
                {/* Image */}
                <img
                  className="h-full w-full object-cover"
                  src={screenshot.path_thumbnail}
                  alt={`Screenshot ${index + 1}`}
                />

                {/* Color bar */}
                <div
                  className="absolute w-[1vw] h-[15vh] bottom-0 right-0 color-bar"
                  style={{
                    backgroundColor: position === 0 ? "#56179dff" : "#808080",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={() => goToSlide(-1)}
        className="absolute left-2 md:left-10 cursor-pointer text-[#9D2117] scale-[150%] top-1/2 z-20 -translate-y-1/2 duration-300 p-2 rounded-full hover:scale-[200%] transition-transform w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black"
      >
        <i className="ri-arrow-left-s-line"></i>
      </button>
      <button
        onClick={() => goToSlide(1)}
        className="absolute right-2 md:right-10 cursor-pointer text-[#9D2117] scale-[150%] top-1/2 z-20 -translate-y-1/2 duration-300 p-2 rounded-full hover:scale-[200%] transition-transform w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black"
      >
        <i className="ri-arrow-right-s-line"></i>
      </button>
    </div>
  );
};

export default SsSlider;
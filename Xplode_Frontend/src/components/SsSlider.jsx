import React, { useRef, useState, useEffect, useMemo } from "react";
import { gsap } from "gsap";

const SsSlider = ({ screenshots, movies }) => {
  const [playingIndex, setPlayingIndex] = useState(null);
  const itemsRef = useRef([]);
  const [activeVideo, setActiveVideo] = useState(null);

  const isAnimating = useRef(false);

  const combinedItems = useMemo(() => {
    let ss = (screenshots || []).map((s) => ({
      type: "screenshot",
      thumbnail: s.path_thumbnail,
    }));

    let mv = (movies || []).map((m) => ({
      type: "movie",
      thumbnail: m.thumbnail,
      webm480: m.webm?.["480"],
      webm: m.webm?.max,
    }));

    if (!movies || movies.length === 0) {
      return ss.slice(0, 3); // Show only 3 screenshots if no movies
    }

    return [...ss.slice(0, 2), ...mv.slice(0, 1)]; // 2 screenshots + 1 movie
  }, [screenshots, movies]);

  const movieIndex = combinedItems.findIndex((item) => item.type === "movie");
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Agar movie mil gayi to uska index, warna 0
    return movieIndex !== -1 ? movieIndex : 0;
  });

  // Handle circular navigation
  const goToSlide = (direction) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setCurrentIndex(
      (prev) => (prev + direction + combinedItems.length) % combinedItems.length
    );
  };

  // Animation effect
  useEffect(() => {
    // Now animate to new positions
    const animationPromises = itemsRef.current.map((item, index) => {
      if (!item) return Promise.resolve();

      const position =
        (index - currentIndex + combinedItems.length) % combinedItems.length;
      const isCenter = position === 0;
      const isRight = position === 1;
      const isLeft = position === combinedItems.length - 1;

      if (isCenter || isLeft || isRight) {
        let xPosition, scale, opacity, zIndex;

        if (isCenter) {
          xPosition = 0;
          scale = 1;
          opacity = 1;
        } else if (isRight) {
          xPosition = 275; // right side
          scale = 0.6;
          opacity = 0.8;
        } else if (isLeft) {
          xPosition = -275; // left side
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
  }, [currentIndex, combinedItems.length]);

  // Handle empty screenshots
  if (!combinedItems || combinedItems.length === 0) {
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
        {combinedItems.map((item, index) => {
          const position =
            (index - currentIndex + combinedItems.length) %
            combinedItems.length;
          const isVisible =
            position === 0 ||
            position === 1 ||
            position === combinedItems.length - 1;

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
              <div className="absolute inset-0 [clip-path:polygon(0%_0%,75%_0%,100%_25%,100%_100%,25%_100%,0%_75%)] bg-black/50 relative">
                {/* Screenshot */}
                {item.type === "screenshot" && (
                  <img
                    className="h-full w-full object-cover"
                    src={item.thumbnail}
                    alt={`Screenshot ${index + 1}`}
                  />
                )}

                {/* Movie */}
                {item.type === "movie" && (
                  <div className="relative h-full w-full">
                    <img
                      className="h-full w-full object-cover"
                      src={item.thumbnail}
                      alt={`Movie ${index + 1}`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setActiveVideo(item)}
                        className="bg-black/60 p-4 rounded-full text-white hover:scale-110 transition"
                      >
                        <i className="ri-play-fill text-3xl"></i>
                      </button>
                    </div>
                  </div>
                )}
                {/* Color bar */}
                <div
                  className="absolute w-[1vw] h-[15vh] bottom-0 right-0"
                  style={{
                    backgroundColor: position === 0 ? "#56179dff" : "#808080",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-[80%] h-[80%]">
            <video className="w-full h-full object-contain" controls autoPlay>
              {activeVideo.webm && (
                <source src={activeVideo.webm480} type="video/webm" />
              )}
            </video>

            {/* Close button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-2 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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

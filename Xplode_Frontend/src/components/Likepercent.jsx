import React from "react";

const Likepercent = ({ likePercentage = 0, dislikePercentage = 0 }) => {
  // Ensure percentages are valid numbers
  const validLikePercentage = Math.max(0, Math.min(100, likePercentage));
  const validDislikePercentage = Math.max(0, Math.min(100, dislikePercentage));

  return (
    <div className="h-full w-full flex flex-col justify-center items-center pr-4">
      <div className="h-[60%] w-full flex justify-between items-center">
        <div className="flex justify-center items-center gap-1">
          <h4 className="text-[#A641FF] font-[gilroy-ebold] text-sm">
            {validLikePercentage}%
          </h4>
          <img src="/Like.svg" alt="" />
        </div>
        <div className="flex justify-center items-center gap-1">
          <h4 className="text-[#CD5444] font-[gilroy-ebold] text-sm">
            {validDislikePercentage}%
          </h4>
          <img src="/Dislike.svg" alt="" />
        </div>
      </div>
      <div className="h-[40%] w-full flex justify-center items-center gap-1">
        <div
          className="h-[4px] bg-[#A641FF] rounded-full transition-all duration-300"
          style={{ width: `${validLikePercentage}%` }}
        ></div>
        <div
          className="h-[4px] bg-[#CD5444] rounded-full transition-all duration-300"
          style={{ width: `${validDislikePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Likepercent;

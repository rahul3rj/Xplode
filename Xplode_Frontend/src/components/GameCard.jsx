import React, { useState } from 'react';
const GameCard = ({ image, bg, title, isActive }) => {
    return (
      <>
      <div className={`h-[38vh]  rounded-xl overflow-hidden shadow-lg  cursor-pointer relative duration-500 transform ${isActive ? 'w-[24vw]' : 'w-[11.55vw]'}`}>
        <img src={image} alt={title} className={`w-full h-full object-cover transition-opacity duration-500 transform absolute z-10 ${isActive ? 'opacity-0' : 'opacity-100'}`} />
        <img src={bg} alt={title} className={`w-full h-full object-cover transition-opacity  absolute `} />
      </div>
      </>
    );
  };
  
  export default GameCard;
import React, { forwardRef, useState } from "react";

const Notification = forwardRef((props, ref) => {
  return (
    <div ref={ref} className='absolute top-[12svh] right-[21vw] h-[50vh] w-[25vw] rounded-xl bg-[rgba(90,0,169,0.40)] shadow-[0_4px_5.8px_2px_rgba(13,13,13,0.22)] backdrop-blur-[35px] py-5 px-7'>
      <div className='h-[10%] w-full flex justify-between items-center'>
        <h4 className='font-[Gilroy-Bold] text-white text-md'>Notifications</h4>
      </div>
      <div className='h-[10%] w-full flex justify-between items-center gap-2'>
        <h4 className='font-[Gilroy-Bold] text-[#A641FF] text-xs'>Important</h4>
        <div className="h-[2px] w-full bg-[#696969]"></div>
      </div>
      <div className="h-[35%] w-full flex items-center justify-start">
        <div className="h-[80%] w-[55%] rounded-md overflow-hidden">
            <img src="https://cdn2.steamgriddb.com/grid/8c048326e93a94589190693897ce3456.jpg" alt="" />
        </div>
        <div className="h-[80%] w-[45%] px-2 flex flex-col justify-between items-center">
            <div className="h-[50%] w-full flex flex-col justify-between">
                <h4 className="font-[Gilroy-Bold] text-white text-md">DLC Released</h4>
                <p className="font-[Gilroy] text-[#B5B5B5] text-[1.3vh]">Cyberpunk 2077</p>
            </div>
            <div className="h-[20%] w-full flex flex-col justify-between">
                <p className="font-[Gilroy-bold] text-[#B5B5B5] text-xs">1 hours ago</p>
            </div>
        </div>
      </div>
      <div className='h-[10%] w-full flex justify-between items-center gap-2'>
        <h4 className='font-[Gilroy-Bold] text-[#A641FF] text-xs'>More</h4>
        <div className="h-[2px] w-full bg-[#696969]"></div>
      </div>
      <div className="h-[35%] w-full flex items-center justify-start">
        <div className="h-[80%] w-[55%] rounded-md overflow-hidden">
            <img src="https://cdn2.steamgriddb.com/grid/095cbfc2bef4012059a1641551b1f46f.png" alt="" />
        </div>
        <div className="h-[80%] w-[45%] px-2 flex flex-col justify-between items-center">
            <div className="h-[50%] w-full flex flex-col justify-between">
                <h4 className="font-[Gilroy-Bold] text-white text-md">LIVE stream Watch Now!!</h4>
                <p className="font-[Gilroy] text-[#B5B5B5] text-[1.3vh]">Sekiro: Shadows Die Twice</p>
            </div>
            <div className="h-[20%] w-full flex flex-col justify-between">
                <p className="font-[Gilroy-bold] text-[#B5B5B5] text-xs">3 hours ago</p>
            </div>
        </div>
      </div>
    </div>


  )
});


export default Notification
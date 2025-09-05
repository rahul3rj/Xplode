import React from 'react'

const Likepercent = () => {
  return (
    <div className='h-full w-full flex flex-col justify-center items-center pr-4'>
      <div className='h-[60%] w-full flex justify-between items-center'>
        <div className='flex justify-center items-center gap-1'>
            <h4 className='text-[#A641FF] font-[gilroy-ebold] text-sm'>90%</h4>
            <img src="/Like.svg" alt="" />
        </div>
        <div className='flex justify-center items-center gap-1'>
            <h4 className='text-[#CD5444] font-[gilroy-ebold] text-sm'>10%</h4>
            <img src="/Dislike.svg" alt="" />
        </div>
      </div>
      <div className='h-[40%] w-full flex justify-center items-center gap-1'>
        <div className='h-[4px] w-[90%] bg-[#A641FF] rounded-full'></div>
        <div className='h-[4px] w-[10%] bg-[#CD5444] rounded-full'></div>
      </div>
    </div>
  )
}

export default Likepercent
import React from 'react'

const Community = () => {
  return (
    <div className='absolute h-screen w-full z-30 overflow-y-auto hide-scrollbar'>
      <img
    src="../bg.svg"
    alt=""
    className="fixed inset-0 w-full h-full object-cover pointer-events-none select-none saturate-140 -z-10"
    style={{ zIndex: -10 }}
  />
  <div className='absolute top-[12svh] left-[10%] h-[88svh] w-[90%] z-30 overflow-y-auto hide-scrollbar'>
    <div className='h-full w-full flex flex-col items-center justify-center'>
      <h1 className='text-5xl font-bold text-white'>Coming soon</h1>
    </div>
  </div>
    </div>
  )
}

export default Community
import React from 'react'

const PreLoader = () => {
  return (
    <div className='fixed w-full h-screen flex justify-center items-center'>
      <img className='w-full h-full object-cover' src="../bg.svg" alt="" />
      <img className='absolute scale-130' src="../Preloader.svg" alt="" />

    </div>
  )
}

export default PreLoader
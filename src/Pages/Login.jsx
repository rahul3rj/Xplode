import React from 'react';
import './Login.css';
import PasswordInput from'../components/eye';
import { useState } from "react";

function Login() {
  const [activeDiv, setActiveDiv] = useState("signin");

  return (
    <div className="h-screen w-screen bg-[#121921] relative">
      <div className='grad1 h-screen w-screen bg-red-300 absolute '></div>
      <div className='grad2 h-screen w-screen bg-red-600 absolute '></div>
      <div className='h-screen w-screen absolute '>
        {/* logo */}
        <div className="h-[7vh] w-[100vw] flex justify-center items-center">
          <img src="/public/logo.png" alt="" width="100" />
        </div>
        {/* login form */}
        <div className="h-[93vh] w-[100vw] flex justify-center items-center ">
          <div className='h-[80vh] w-[70vw] bg-black/20 shadow-2xl rounded-[5vh] borderbox relative '>
            <div className='h-[10vh] w-[70vw] rounded-t-[5vh] flex justify-center items-center absolute z-10'>
              <button onClick={() => setActiveDiv("signin")} className={`text-white pt-3 pb-3 pr-6 pl-6 rounded-full mx-3  backdrop-blur-md text-white shadow-lg   ${activeDiv === "signin" ? 'bg-[#D65F30] ' : ' bg-white/10 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer'}`} ><h4 className=''>Sign-In</h4></button>
              <button onClick={() => setActiveDiv("reg")} className={`text-white pt-3 pb-3 pr-6 pl-6 rounded-full mx-3  backdrop-blur-md text-white shadow-lg ${activeDiv === "signin" ? 'bg-white/10 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer' : ' bg-[#D65F30] '}`}><h4 className=''>Register</h4></button>
            </div>
            {activeDiv === "signin" &&(
                <div className='h-[70vh] w-[70vw] flex absolute bottom-0'>
                {/* image */}
                <div className='h-[70vh] w-[35vw] flex justify-center items-center rounded-b-[5vh] '>
                  <img className='absolute bottom-1' src="/public/creed.png" alt="" width='500' />
                </div>
                {/* form */}
                <div className='h-[70vh] w-[35vw] flex flex-col justify-center items-center relative'>
                  <h1 className='text-white font-bold text-3xl w-[25vh] text-center istok-web-bold'>Hello Welcome Back!</h1>
                  <input type="email" placeholder="Email" className='bg-white w-[17vw] h-[4vh] mt-5 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none' />
                  <PasswordInput />
                  {/* <input type="password" placeholder="OTP" className='bg-white w-[17vw] h-[4vh] mt-8 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none' /> */}
                  <div className='h-[7vh] w-[18vw] flex justify-center items-center'>
                    <div className='h-[0.2vh] w-[12vw] bg-[#6A6969]'></div>
                    <h5 className='istok-web-regular text-xs p-2 text-[#6A6969] cursor-pointer'>Resend OTP?</h5>
                  </div>
                  <button className=' istok-web-regular bg-[#4E4E4E]/33 w-[17vw] h-[5vh] rounded-lg shadow-lg hover:bg-[#D65F30] hover:text-white transition-all duration-300 cursor-pointer'><h4 className='text-white'>Sign In</h4></button>
                  <div className='h-[7vh] w-[18vw] flex justify-center items-center'>
                    <div className='h-[0.2vh] w-[5.5vw] bg-[#6A6969]'></div>
                    <h5 className='istok-web-regular text-xs p-2 text-[#6A6969]'>Or continue with</h5>
                    <div className='h-[0.2vh] w-[5.5vw] bg-[#6A6969]'></div>
                  </div>
                  <div className=' h-[7vh] w-[18vw] flex justify-center items-center'>
                    <button className=' istok-web-regular bg-[#4E4E4E]/33 w-[4vw] h-[5vh] rounded-lg shadow-lg hover:bg-[#D65F30] hover:text-white transition-all duration-300 cursor-pointer flex justify-center items-center '><img width="35" height="35" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo"/></button>
                    <button className='mx-[2vw] istok-web-regular bg-[#4E4E4E]/33 w-[4vw] h-[5vh] rounded-lg shadow-lg hover:bg-[#D65F30] hover:text-white transition-all duration-300 cursor-pointer flex justify-center items-center'><img width="35" height="35" src="/public/apple.png" alt="mac-os"/></button>
                    <button className=' istok-web-regular bg-[#4E4E4E]/33 w-[4vw] h-[5vh] rounded-lg shadow-lg hover:bg-[#D65F30] hover:text-white transition-all duration-300 cursor-pointer flex justify-center items-center'><img width="35" height="35" src="https://img.icons8.com/color/35/facebook-new.png" alt="facebook-new"/></button>
                  </div>
                  <div className='h-[5vh] w-[17vw]  flex justify-center items-center'>
                    <h5 className='istok-web-regular text-xs  text-[#6A6969]'>Don’t have an account ?</h5>
                    <h5 className='istok-web-regular text-xs font-bold text-white pl-1 cursor-pointer '>Create Account!</h5>
                  </div>
                  <div className='h-[10vh] w-full'></div>
                </div>
              </div>
            ) }
            {activeDiv === "reg" && (
              <div className='h-[70vh] w-[70vw] flex absolute bottom-0'>
                {/* form */}
              <div className='h-[70vh] w-[35vw] flex flex-col justify-center items-center relative'>
                <h1 className='text-white font-bold text-3xl w-[25vh] text-center istok-web-bold'>Hello Welcome To Xplode!</h1>
                <input type="email" placeholder="Email" className='bg-white w-[17vw] h-[4vh] mt-5 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none' />
                <PasswordInput />
                {/* <input type="password" placeholder="OTP" className='bg-white w-[17vw] h-[4vh] mt-8 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none' /> */}
                <div className='h-[7vh] w-[18vw] flex justify-center items-center'>
                  <div className='h-[0.2vh] w-[12vw] bg-[#6A6969]'></div>
                  <h5 className='istok-web-regular text-xs p-2 text-[#6A6969] cursor-pointer'>Resend OTP?</h5>
                </div>
                <button className=' istok-web-regular bg-[#4E4E4E]/33 w-[17vw] h-[5vh] rounded-lg shadow-lg hover:bg-[#D65F30] hover:text-white transition-all duration-300 cursor-pointer'><h4 className='text-white'>Register</h4></button>
                <div className='h-[7vh] w-[18vw] flex justify-center items-center'>
                  <div className='h-[0.2vh] w-[5.5vw] bg-[#6A6969]'></div>
                  <h5 className='istok-web-regular text-xs p-2 text-[#6A6969]'>Or continue with</h5>
                  <div className='h-[0.2vh] w-[5.5vw] bg-[#6A6969]'></div>
                </div>
                <div className=' h-[7vh] w-[18vw] flex justify-center items-center'>
                  <button className=' istok-web-regular bg-[#4E4E4E]/33 w-[4vw] h-[5vh] rounded-lg shadow-lg hover:bg-[#D65F30] hover:text-white transition-all duration-300 cursor-pointer flex justify-center items-center '><img width="35" height="35" src="https://img.icons8.com/fluency/48/google-logo.png" alt="google-logo"/></button>
                  <button className='mx-[2vw] istok-web-regular bg-[#4E4E4E]/33 w-[4vw] h-[5vh] rounded-lg shadow-lg hover:bg-[#D65F30] hover:text-white transition-all duration-300 cursor-pointer flex justify-center items-center'><img width="35" height="35" src="/public/apple.png" alt="mac-os"/></button>
                  <button className=' istok-web-regular bg-[#4E4E4E]/33 w-[4vw] h-[5vh] rounded-lg shadow-lg hover:bg-[#D65F30] hover:text-white transition-all duration-300 cursor-pointer flex justify-center items-center'><img width="35" height="35" src="https://img.icons8.com/color/35/facebook-new.png" alt="facebook-new"/></button>
                </div>
                <div className='h-[5vh] w-[17vw]  flex justify-center items-center'>
                  <h5 className='istok-web-regular text-xs  text-[#6A6969]'>Already have an account ?</h5>
                  <h5 className='istok-web-regular text-xs font-bold text-white pl-1 cursor-pointer '>Login!</h5>
                </div>
                <div className='h-[10vh] w-full'></div>
              </div>
              {/* image */}
              <div className='h-[70vh] w-[35vw] flex justify-center items-center rounded-b-[5vh] '>
                <img className='absolute z-0 bottom-1' src="/public/ds.png" alt="" width="550" />
              </div>
              
            </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
import React from 'react'

const Items_vault = () => {
  return (
    <>
      <div className="h-[32vh] w-[58vw]">
        <div className="h-[30vh] w-[58vw] rounded-lg bg-[#461F35] rounded-lg flex justify-start items-center ">
          {/* poster image */}
          <div className="h-[30vh] w-[10.5vw] object-cover rounded-lg flex justify-center items-center">
            <img
              src="./public/rdr2.jpg"
              alt=""
              className="h-[27vh] rounded-lg"
            />
          </div>
          {/* Details  */}
          <div className="h-[30vh] w-[32vw] p-4">
            <div className="h-[3vh] w-[3.5vw] rounded-md bg-[#6B465B] flex justify-center items-center">
              <p className="text-[1.5vh] text-[#E0C6D2] h-[2.6vh]">Classic</p>
            </div>
            <div className="h-[10vh] w-[30vw] mt-4">
              <h2 className="text-[3vh] text-white istok-web-regular">
                Red Dead Redemption 2
              </h2>
              <h4 className="text-[1.5vh] text-zinc-400 istok-web-regular">
                112.8 GB
              </h4>
              <div className="h-[3vh] w-[30vw] flex justify-start items-center">
                <img src="./public/Discount.png" alt="" className="h-[2vh]" />
                <h4 className="text-[1.5vh] px-2 text-[#D65F30] istok-web-regular">
                  Summer Sale discount of 5%
                </h4>
              </div>
            </div>
            <div className=" h-[4vh] w-[4vh] mt-12 ">
              <img
                src="./public/win_logo.png"
                alt=""
                className="onhover:scale-110 cursor-pointer"
              />
            </div>
          </div>
          {/* pricing */}
          <div className="h-[20vh] w-[14vw] flex flex-col justify-between items-end">
            <h3 className="text-[2.5vh] text-white">₹4299</h3>
            <div className="h-[2vh] w-[12vw] flex justify-between items-center">
              <h3 className="text-[1.5vh] text-zinc-400 istok-web-regular onhover:cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 hover:after:w-full ">
                Remove
              </h3>
              <h3 className="text-[1.5vh] text-zinc-400 istok-web-regular onhover:cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 hover:after:w-full ">
                Move to wishlist
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Items_vault;




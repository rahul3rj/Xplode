import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-[17vw]">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="OTP" className='bg-white w-[17vw] h-[4vh] mt-8 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none'
      />
      <button
        type="button"
        className="absolute inset-y-[1vh] right-3 flex place-items-end text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
{/* <input type="password" placeholder="OTP" className='bg-white w-[17vw] h-[4vh] mt-8 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none' /> */}

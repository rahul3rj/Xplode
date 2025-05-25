import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const OtpInput = ({ otp, setOtp, step }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (step !== 2) return null; // Only render OTP input when on step 2

  return (
    <div className="w-[45%]  relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="h-[5vh] w-[80%] lg:w-[100%] rounded-lg mb-5 bg-black text-white px-4 py-1 outline-none border border-gray-700 focus:border-white transition-all"
      />
      <button
        type="button"
        className="absolute top-2 right-13 lg:top-2 lg:right-3 cursor-pointer text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <Eye size={25} /> : <EyeOff size={25} />}
      </button>
    </div>
  );
};

const PasswordInput = ({ password, setPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="lg:w-[45%] w-[100%] relative flex flex-col justify-center items-center">

      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-[5vh] w-[80%] lg:w-[100%] rounded-lg bg-black mb-5 text-white px-4 py-1 outline-none border border-gray-700 focus:border-white transition-all"
      />
      <button
        type="button"
        className="absolute top-2 right-13 lg:top-2 lg:right-3 cursor-pointer text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <Eye size={25} /> : <EyeOff size={25} />}
      </button>
    </div>
  );
};

export { OtpInput, PasswordInput };

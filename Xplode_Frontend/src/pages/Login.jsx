import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { OtpInput, PasswordInput } from "../components/eye";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [activeDiv, setActiveDiv] = useState("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleGoogleRegister = () => {
    try {
      window.location.href = "http://localhost:5000/auth/google";
    } catch (err) {
      console.error("Error registering with Google:", err);
    }
  };

  const handleGoogle = () => {
    try {
      window.location.href = "http://localhost:5000/auth/google";
    } catch (err) {
      console.error("Error logging in with Google:", err);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/home");
    }
  }, [navigate]);

  const handleRegistration = async () => {
    if (step === 1) {
      if (!email) {
        alert("Please enter your email!");
        return;
      }
      try {
        const res = await axios.post("/user/send-otp", { email });
        console.log("Response from backend:", res.data);
        if (res.data.success) {
          alert(res.data.message);
          setStep(2);
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        console.error(
          "Error response:",
          err.response ? err.response.data : err.message
        );
        alert(err.response?.data?.message || "Error sending OTP");
      }
    } else if (step === 2) {
      if (!otp) {
        alert("Please enter the OTP!");
        return;
      }
      try {
        const res = await axios.post("/user/verify-otp", {
          email,
          otp,
          name,
          password,
        });
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          navigate("/home");
        } else {
          alert("Invalid OTP. Please try again.");
        }
      } catch (err) {
        console.error("Error verifying OTP:", err);
        alert("Error verifying OTP");
      }
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please enter your email or password!");
      return;
    }

    try {
      const res = await axios.post("/user/login", { email, password });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      } else {
        alert(res.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="h-screen w-full bg-black flex relative overflow-hidden">
      <div>
        <div className="flex justify-center items-center absolute z-100 bottom-10 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => setActiveDiv("signin")}
            className={`text-white pt-3 pr-6 pl-6 rounded-full mx-3 backdrop-blur-md shadow-lg ${
              activeDiv === "signin"
                ? "bg-[#A641FF] pb-3"
                : " hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
            }`}
          >
            <div className="flex flex-col items-center">
              <h4>Login</h4>
              {activeDiv !== "signin" && (
                <div className="w-4 h-0.5 bg-white mt-2 rounded"></div>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveDiv("reg")}
            className={`text-white pt-3  pr-6 pl-6 rounded-full mx-3 backdrop-blur-md shadow-lg ${
              activeDiv === "signin"
                ? " hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                : "bg-[#A641FF] pb-3"
            }`}
          >
            <div className="flex flex-col items-center">
              <h4>Register</h4>
              {activeDiv !== "reg" && (
                <div className="w-4 h-0.5 bg-white mt-2 rounded"></div>
              )}
            </div>
          </button>
        </div>
      </div>

      <img
        src="../LoginPage/Complete logo.png"
        alt=""
        className="absolute top-15 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      {activeDiv === "signin" && (
        <>
          <div className="h-screen w-[15%] flex justify-start items-center ">
            <h1 className="font-[gilroy-ebold] text-white text-[13vw] rotate-90 -ml-90 opacity-[19%]">
              XPLODE
            </h1>
          </div>
          <div className="h-screen w-[40%] flex justify-center items-start pt-10"></div>
          <img
            src="../LoginPage/character.png"
            alt=""
            style={{ mixBlendMode: "luminosity" }}
            className="absolute w-[80%] lg:-left-30 lg:-top-10 z-11 -bottom-70 -left-15"
          />
          <img
            src="../LoginPage/gradient.png"
            alt=""
            className="absolute saturate-300 bottom-0"
          />
          <div className="h-screen w-[100%] lg:w-[40%] flex flex-col justify-center items-center absolute z-99 left-1/2 lg:translate-x-0 -translate-x-1/2">
            <h1 className="text-white font-[gilroy-bold] text-3xl lg:text-4xl mb-10">
              Hello Welcome Back!
            </h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[5%] w-[80%] lg:w-[45%] py-1 rounded-lg bg-black text-white px-4 outline-none border border-gray-700 focus:border-white transition-all mb-5"
            />

            <PasswordInput password={password} setPassword={setPassword} />

          
            <div className="h-[2%] w-[80%] lg:w-[45%] flex justify-center items-center mb-5">
              <div className="h-[1px] w-[10%] bg-[#8F8F8F]"></div>
              <h4 className="font-[gilroy-bold] text-sm text-[#8F8F8F] cursor-pointer mx-5">
                or
              </h4>
              <div className="h-[1px] w-[10%] bg-[#8F8F8F]"></div>
            </div>
            <button
              onClick={handleGoogle}
              className="w-[80%] lg:w-[45%] h-[5%] rounded-full bg-white text-sm font-[gilroy-bold] text-gray-500 px-4 outline-none border border-gray-700 mb-5 cursor-pointer hover:shadow-lg hover:shadow-[#A641FF]/50"
            >
              <div className="flex items-center justify-center gap-2">
                Login with Google
                <img
                  src="../LoginPage/google.png"
                  alt="Google"
                  className="w-5 h-5"
                />
              </div>
            </button>
            <button
              onClick={handleSubmit}
              className="w-[80%] lg:w-[45%] h-[5%] rounded-full bg-[#A641FF] text-sm font-[gilroy-bold] text-white px-4 outline-none border border-gray-700 hover:shadow-lg hover:shadow-[#A641FF]/50 transition-all mb-5 cursor-pointer"
            >
              Login
            </button>
            <div className="h-[2%] w-[80%] lg:w-[45%] flex justify-center items-center mb-5">
              <h4 className="font-[gilroy-bold] text-sm text-[#8F8F8F]">
                Don’t have an account ? &nbsp;
              </h4>
              <h4 className="font-[gilroy-bold] text-sm text-[#D5A4FF] cursor-pointer">
                Create Account!
              </h4>
            </div>
          </div>
          <div className="h-[50%] w-[5%] flex flex-col justify-center items-end absolute right-0 top-0">
            <img src="../LoginPage/lines.svg" alt="" className="mb-10" />
            <img src="../LoginPage/Synchronize.svg" alt="" />
          </div>
        </>
      )}
      {activeDiv === "reg" && (
        <div className="w-full flex justify-end items-center">
          <>
            <div className="h-screen w-[100%] lg:w-[40%] flex flex-col justify-center items-center absolute z-99 right-1/2 lg:translate-x-0 translate-x-1/2">
              <h1 className="text-white font-[gilroy-bold] text-3xl lg:text-4xl mb-10 w-[80%] lg:w-[45%] text-center">
                Hello Welcome to Xplode!
              </h1>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={step === 2}
                className="w-[80%] lg:w-[45%] h-[5%] rounded-lg bg-black text-white px-4 outline-none border border-gray-700 focus:border-white transition-all mb-5"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={step === 2}
                className="w-[80%] lg:w-[45%] h-[5%] rounded-lg bg-black text-white px-4 outline-none border border-gray-700 focus:border-white transition-all mb-5"
              />
              <PasswordInput password={password} setPassword={setPassword} />

              {step === 2 && <OtpInput otp={otp} setOtp={setOtp} step={step} />}
              <div className="h-[2%] w-[80%] lg:w-[45%] flex justify-end items-center mb-5">
                <h4 className="font-[gilroy-bold] text-sm text-[#D5A4FF] cursor-pointer">
                  Resend OTP?
                </h4>
              </div>
              <div className="h-[2%] w-[80%] lg:w-[45%] flex justify-center items-center mb-5">
                <div className="h-[1px] w-[10%] bg-[#8F8F8F]"></div>
                <h4 className="font-[gilroy-bold] text-sm text-[#8F8F8F] cursor-pointer mx-5">
                  or
                </h4>
                <div className="h-[1px] w-[10%] bg-[#8F8F8F]"></div>
              </div>
              <button
                onClick={handleGoogleRegister}
                className="w-[80%] lg:w-[45%] h-[5%] rounded-full bg-white text-sm font-[gilroy-bold] text-gray-500 px-4 outline-none border border-gray-700 mb-5 cursor-pointer hover:shadow-lg hover:shadow-[#A641FF]/50"
              >
                <div className="flex items-center justify-center gap-2">
                  Register using Google
                  <img
                    src="../LoginPage/google.png"
                    alt="Google"
                    className="w-5 h-5"
                  />
                </div>
              </button>
              <button
                onClick={handleRegistration}
                className="w-[80%] lg:w-[45%] h-[5%] rounded-full bg-[#A641FF] text-sm font-[gilroy-bold] text-white px-4 outline-none border border-gray-700 hover:shadow-lg hover:shadow-[#A641FF]/50 transition-all mb-5 cursor-pointer"
              >
                {step === 1 ? "Send OTP" : "Verify OTP & Register"}
              </button>
              <div className="h-[2%] w-[80%] lg:w-[45%] flex justify-center items-center mb-5">
                <h4 className="font-[gilroy-bold] text-sm text-[#8F8F8F]">
                  Already have an account ? &nbsp;
                </h4>
                <h4 className="font-[gilroy-bold] text-sm text-[#D5A4FF] cursor-pointer">
                  Login!
                </h4>
              </div>
            </div>
            <div className="h-screen w-[15%] flex justify-end items-center ">
              <h1 className="font-[gilroy-ebold] text-white text-[13vw] -rotate-90 -mr-90 opacity-[19%]">
                XPLODE
              </h1>
            </div>

            <img
              src="../LoginPage/character2.png"
              alt=""
              style={{ mixBlendMode: "luminosity" }}
              className="absolute lg:h-[100%] lg:w-[80%] lg:-right-100 scale-x-[-1] z-11 bottom-0 -right-30"
            />
            <img
              src="../LoginPage/gradient.png"
              alt=""
              className="absolute saturate-300 scale-x-[-1] bottom-0"
            />
            <div className="h-[50%] w-[5%] flex flex-col justify-center items-start absolute left-0 top-0">
              <img src="../LoginPage/lines.svg" alt="" className="mb-10" />
              <img src="../LoginPage/Synchronize.svg" alt="" />
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default Login;

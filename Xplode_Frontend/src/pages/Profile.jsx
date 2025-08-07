import React, { useEffect, useState } from 'react'
import { Link} from "react-router-dom";
import axios from "../utils/axios";
import { div } from "framer-motion/client";
import { Eye, EyeOff } from "lucide-react";



const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", username: "", phone: "", profilePic: null });
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isEditable, setIsEditable] = useState(false); // Name editing toggle
  const [query, setQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [preview, setPreview] = useState(null);

  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setFilteredGames([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/games/search?q=${query}`);
      setFilteredGames(response.data);
    } catch (err) {
      console.error('❌ Search error:', err.message);
      setFilteredGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => fetchSearchResults(query), 300);
    return () => clearTimeout(delay);
  }, [query]);


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profilePic = res.data.profilePic
          ? `data:${res.data.profilePic.contentType};base64,${res.data.profilePic.data}`
          : "/default.png";

        setUser({ ...res.data, profilePic });
        setName(res.data.name);
        setUsername(res.data.username);
        setPhone(res.data.phone);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("phone", phone);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const res = await axios.post("/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          name: res.data.user.name,
          username: res.data.user.username,
          phone: res.data.user.phone,
          profilePic: res.data.user.profilePic
            ? `data:${res.data.user.profilePic.contentType};base64,${res.data.user.profilePic.data}`
            : prevUser.profilePic,
        }));
        setPreview(null);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="main h-screen w-full bg-[#121921] select-none relative overflow-hidden  ">
      <img
        src="./public/bg.png"
        className="h-screen w-full absolute z--1"
        alt=""
      />
      <div className="navSide h-[90vh] w-[16vw] flex flex-col justify-center items-start z-50 absolute bottom-0">
        <div className="icons h-[90vh] w-[13vw] flex mt-5 group">
          <div className="h-[90vh] w-[5vw] relative">
            <div className="h-[3vh] w-[0.3vw] bg-[#D65F30] absolute right-0 top-3 rounded-full mr-3 shadow"></div>
          </div>
          <div className="h-[90vh] w-[3vw] flex flex-col justify-between items-start ">
            <div className="top-part">
              <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img src="/game2.png" alt="" width="30" className="z-10" />
                </div>
              </div>
              <div className="h-[6vh] w-[3vw]">
                <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                    <img
                      src="/Library.png"
                      alt=""
                      width="25"
                      className="z-10"
                    />
                  </div>
                </div>
              </div>
              <div className="h-[6vh] w-[3vw]">
                <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                    <img
                      src="/community.png"
                      alt=""
                      width="25"
                      className="z-10"
                    />
                  </div>
                </div>
              </div>
              <div className="h-[6vh] w-[3vw]">
                <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                    <img
                      src="/friends.png"
                      alt=""
                      width="25"
                      className="z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-part">
              <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img
                    src="/settings.png"
                    alt=""
                    width="40"
                    className="z-10"
                  />
                </div>
              </div>
              <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img src="/help.png" alt="" width="40" className="z-10" />
                </div>
              </div>
              <div className="h-[6vh] w-[3vw] flex items-center justify-start">
                <div className="h-[6vh] w-[3vw] flex items-center justify-center relative cursor-pointer">
                  <img
                    src="/downloads.png"
                    alt=""
                    width="40"
                    className="z-10"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="h-[90vh] w-[5vw] flex flex-col justify-between items-start transform -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <div className="top-part2">
              <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                <div className="h-[6vh] w-[8vw] text-[#D65F30] istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Game store</h4>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw]">
                <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                    <h4 className="text-sm">Library</h4>
                  </div>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw]">
                <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                    <h4 className="text-sm">Community</h4>
                  </div>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw]">
                <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                  <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                    <h4 className="text-sm">Friends</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-part2">
              <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Settings</h4>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Help</h4>
                </div>
              </div>
              <div className="h-[6vh] w-[8vw] flex items-center justify-start">
                <div className="h-[6vh] w-[8vw] text-white istok-web-regular flex justify-start items-center p-3 cursor-pointer">
                  <h4 className="text-sm">Downloads</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="navTop h-[10vh] w-[100vw] absolute top-0 right-0 flex justify-between items-center z-50">
        <div className="logo w-[16vw] h-[10vh] flex ml-[5.6vw] items-center">
          <img src="/logo.png" alt="" width="120" />
        </div>
  


        <div className="h-[10vh] w-[24vw] flex justify-center items-center">
          <button className="h-[5vh] w-[5vh] bg-[#BFBABA]/12 rounded-full flex justify-center items-center cursor-pointer drop-shadow-xl hover:drop-shadow-none transition-all duration-300 mr-10">
            <img src="/bell.png" alt="" width="25" />
          </button>
          <Link to="/vault" className="h-[5vh] w-[5vh] bg-[#BFBABA]/12 rounded-full flex justify-center items-center cursor-pointer drop-shadow-xl hover:drop-shadow-none transition-all duration-300 mr-10">
            <img src="/cart.png" alt="" width="25" />
          </Link>
          <div className="flex justify-center items-center">
            <div className='h-[5vh] w-[5vh] bg-[#BFBABA]/12 rounded-full flex justify-center items-center cursor-pointer drop-shadow-xl hover:drop-shadow-none overflow-hidden transition-all duration-300 mr-3 border-2 border-[#D65F30]  bg-cover bg-center'>
              <img src={user.profilePic || "/default.jpg"} className='w-full h-full object-cover' alt="" />
            </div>
            <div className="h-[10vh] w-[6vw] flex items-center justify-between text-white istok-web-regular cursor-pointer">
              <h4>{user.username}</h4>
              <i className="ri-arrow-down-s-fill text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[90vh] w-[88vw]  relative mt-[10vh] ml-[12vw] flex justify-between items-center">
        <div className="h-[90vh] w-[55vw] flex flex-col justify-between items-center">
          <div className="h-[40vh] w-full flex justify-between items-center">
            <div className="_text_ h-[20vh] w-[20vw] ml-21">
              <h1 className="text-[4vh] text-zinc-100 istok-web-regular">
                {user.username || "User"}
              </h1>
              <h4 className="text-[1.5vh] text-zinc-400 istok-web-regular">
                {user.email || "@User"}
              </h4>
              <h4 className="text-[1.5vh] text-green-400">
                <i class="ri-circle-fill text-green-400 istok-web-regular"></i>{" "}
                Online
              </h4>
            </div>
            <div className="_profilePic_ h-[17vw] w-[17vw] mr-[8vw] relative">
              <div className="_profilePic_ h-[17vw] w-[17vw] overflow-hidden rounded-full flex justify-center items-center  mr-11">
                <img src={preview || user.profilePic} className='w-full h-full object-cover' alt="" />
                <div className="h-[18.5vw] w-[18.5vw] absolute rounded-full rotate-0 flex justify-center items-center  ">
                  <img
                    src="./semi-circle.png"
                    alt=""
                    className="h-[11vw] absolute top-[-0.5vw] right-[-0.5vw]"
                  />
                </div>
                <div className="h-[17vw] w-[17vw] absolute rounded-full rotate-0 flex justify-center items-center  shade z-10"></div>
                <form className="h-[4vw] w-[4vw] absolute z-20 rounded-full bottom-[-4vh] bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none transition-all duration-300">
                  <label htmlFor="fileInput" className='cursor-pointer'>
                    <i class="ri-pencil-fill text-white text-[3vh]"></i>

                  </label>
                  <input
                    id='fileInput'
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="h-[50vh] w-full flex justify-between items-center">
            <form onSubmit={handleSubmit} className="_EditProfile_ h-[40vh] w-[20vw] ml-21 flex flex-col justify-center gap-2 items-center">

              {["name", "username", "phone"].map((field) => (

                <div key={field} className="h-[8vh] w-full ">
                  <h4 className="text-[1.5vh] capitalize text-zinc-400 istok-web-regular">
                    {field}
                  </h4>
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={field === "name" ? name : field === "username" ? username : phone}
                      onChange={(e) => (field === "name" ? setName(e.target.value) : field === "username" ? setUsername(e.target.value) : setPhone(e.target.value))}
                      readOnly={!isEditable}
                      placeholder={field === "name" ? user.name : field === "username" ? user.username : user.phone}
                      className="bg-white w-[17vw] h-[4vh] mt-2 mb-2 p-2 px-5 rounded-lg focus:border-transparent focus:ring-0 focus:outline-none"
                    />
                    <div onClick={() => setIsEditable(true)} className="h-[5vh] w-[2.5vw]  rounded-full bottom-[-4vh] bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none transition-all duration-300">
                      <i class="ri-pencil-fill text-white text-[2vh]"></i>
                    </div>
                  </div>
                </div>


              ))}

              <div className="flex justify-between items-center w-full mt-2">
                <button
                  type="button"
                  className="h-[5vh] w-[9vw] rounded-lg bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none hover:bg-white hover:text-black hover:border-none transition-all duration-300 text-white istok-web-regular"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="h-[5vh] w-[9vw] rounded-lg bg-[#DA4F25] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-none hover:bg-white hover:text-black transition-all duration-300 text-white istok-web-regular"
                >
                  Save Changes
                </button>
              </div>
            </form>


          </div>
        </div>
        <div className="h-[90vh] w-[28vw] flex flex-col justify-between items-center mr-11">


        </div>
      </div>
    </div>
  );
}

export default Profile

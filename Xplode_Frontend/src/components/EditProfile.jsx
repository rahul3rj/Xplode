import React, { useRef, useState } from "react";
import axios from "../utils/axios";

const EditProfile = ({ onClose, user, setUser }) => {

  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [about, setAbout] = useState(user.about || "");
  const [profilePic, setProfilePic] = useState(null);
  const [bannerPic, setBannerPic] = useState(null);
  const profilePicInputRef = useRef(null);
  const bannerPicInputRef = useRef(null);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("about", about);
      if (profilePic) formData.append("profilePic", profilePic);
      if (bannerPic) formData.append("bannerPic", bannerPic);

      const res = await axios.post("/profile/edit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setUser((prev) => ({
          ...prev,
          name,
          username,
          email,
          about,
          profilePic: profilePic
            ? URL.createObjectURL(profilePic)
            : prev.profilePic,
          bannerPic: bannerPic
            ? URL.createObjectURL(bannerPic)
            : prev.bannerPic,
        }));
        onClose();
      }
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="relative px-15 py-10 w-[50vw] h-[75vh] rounded-[10px]
    bg-[linear-gradient(180deg,_rgba(136,0,255,0.20)_0%,_rgba(255,41,195,0.20)_100%)]
    shadow-[0_4px_128.5px_-14px_#A641FF]
    backdrop-blur-[86.4px] flex flex-col items-center justify-center"
      >
        <img src="../profile/esc.svg" alt="" className="absolute top-4 right-4 text-white text-xl cursor-pointer"
          onClick={onClose} />
        <div className="h-[30vh] w-full flex items-center justify-center gap-5">
          <div className="h-[30svh] w-[30svh] relative flex items-center justify-center">
            <div className=" h-[30svh] w-[30svh] rounded-full overflow-hidden flex items-center justify-center">
              <div>
                <img
                  src={profilePic ? URL.createObjectURL(profilePic) : user.profilePic}
                  alt=""
                  className="rounded-full h-32 w-32 object-cover"
                />
                <input
                  type="file"
                  ref={profilePicInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => setProfilePic(e.target.files[0])}

                />
              </div>
            </div>
            <img
              src="../profile/edit.svg"
              alt=""
              className="absolute h-[4vh] -bottom-[2vh] z-10 cursor-pointer"
              onClick={() => profilePicInputRef.current && profilePicInputRef.current.click()}

            />
          </div>
          <div className="h-[30vh] w-full flex flex-col items-center justify-start gap-2">
            <div className="h-[15svh] w-full relative rounded-lg flex items-center justify-center">
              <div className="h-[15svh] w-full rounded-lg overflow-hidden flex items-center justify-center">
                <div className="h-full w-full">
                  <img
                    src={bannerPic ? URL.createObjectURL(bannerPic) : user.bannerPic}
                    alt=""
                    className="rounded-lg w-full h-full object-cover"
                  />
                  <input
                    type="file"
                    ref={bannerPicInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => setBannerPic(e.target.files[0])}

                  />
                </div>
              </div>
              <img
                src="../profile/edit.svg"
                alt=""
                className="absolute h-[4vh] -bottom-[2vh] right-5 z-10 cursor-pointer"
                onClick={() => bannerPicInputRef.current && bannerPicInputRef.current.click()}

              />
            </div>
            <div className="h-[15vh] w-full flex items-center justify-between gap-5">
              <div className="h-[10vh] w-[50%] flex flex-col items-start justify-center gap-2">
                <h4 className="font-[gilroy-bold] text-xs text-[#696969]">
                  NAME:{" "}
                </h4>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  defaultValue="hgvkh"
                  className="h-[7vh] w-full rounded-md bg-[#8800FF33] shadow-lg px-5 placeholder-white font-[gilroy-bold] text-xs text-white border-none focus:border-none focus:outline-none"
                />
              </div>
              <div className="h-[10vh] w-[50%] flex flex-col items-start justify-center gap-2">
                <h4 className="font-[gilroy-bold] text-xs text-[#696969]">
                  USERNAME:{" "}
                </h4>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-[7vh] w-full rounded-md bg-[#8800FF33] shadow-lg px-5 placeholder-white font-[gilroy-bold] text-xs text-white border-none focus:border-none focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-[35vh] w-full flex flex-col items-center justify-center ">
          <div className="h-[10vh] w-full flex flex-col items-start justify-center gap-2">
            <h4 className="font-[gilroy-bold] text-xs text-[#696969]">
              EMAIL:{" "}
            </h4>
            <input
              type="email"
              value={email}
              disabled
              defaultValue={user.email}
              className="h-[7vh] w-full rounded-md bg-[#8800FF33] shadow-lg px-5 placeholder-white font-[gilroy-bold] text-xs text-white border-none focus:border-none focus:outline-none"
            />
          </div>
          <div className="h-[15vh] w-full flex flex-col items-start justify-center gap-2">
            <h4 className="font-[gilroy-bold] text-xs text-[#696969]">
              ABOUT ME:{" "}
            </h4>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="h-[10vh] w-full rounded-md bg-[#8800FF33] shadow-lg px-5 py-2 font-[gilroy-bold] text-xs text-white border-none focus:border-none focus:outline-none resize-none placeholder-white"
              defaultValue={user.about || ""}
            />
          </div>
          <div className="h-[10vh] w-full flex items-center justify-end">
            <button onClick={handleSave} className="h-[6vh] w-[25%] bg-[#A641FF] rounded-full shadow-lg text-white font-[gilroy-bold] text-xs cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>

        {/* Edit profile form content */}
      </div>
    </div>
  );
};

export default EditProfile;

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { Camera, LogOut, ArrowUpRight, UserRound, SlidersHorizontal, Shield } from "lucide-react";
import axios from "../utils/axios";
import LoadingIndicator from "../components/LoadingIndicator";
import { readTheme, saveTheme, watchTheme } from "../utils/theme";
import "./settings.css";

const imageSrc = (value, fallback) => {
  if (typeof value === "string" && value) return value;
  return value?.data && value?.contentType ? `data:${value.contentType};base64,${value.data}` : fallback;
};

export default function Settings() {
  const { handleLogout, setHeaderUser } = useOutletContext();
  const [profile, setProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [autoplay, setAutoplay] = useState(() => localStorage.getItem("xplode-banner-autoplay") !== "false");
  const [theme, setTheme] = useState(readTheme);
  const [themeError, setThemeError] = useState("");
  const avatarInput = useRef(null);
  const bannerInput = useRef(null);
  const settingsMain = useRef(null);
  const location = useLocation();

  useEffect(() => watchTheme(setTheme), []);

  useEffect(() => {
    let active = true;
    axios.get("/profile", { headers: { "Cache-Control": "no-cache" } }).then(({ data }) => {
      if (active) setProfile({ name: data.name || "", username: data.username || "", email: data.email || "", about: data.about || "", profilePic: imageSrc(data.profilePic, "/defaultprofile.jpg"), bannerPic: imageSrc(data.bannerPic, "/defaultbanner.jpg") });
    }).catch(() => { if (active) setError("Could not load your profile. Please refresh and try again."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (loading || location.hash !== "#creator-profile") return;
    const frame = requestAnimationFrame(() => {
      const container = settingsMain.current;
      const section = container?.querySelector("#creator-profile");
      if (section) container.scrollTo({ top: section.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop, behavior: "auto" });
    });
    return () => cancelAnimationFrame(frame);
  }, [loading, location.hash]);

  useEffect(() => {
    if (!avatar) { setAvatarPreview(""); return; }
    const url = URL.createObjectURL(avatar); setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);
  useEffect(() => {
    if (!banner) { setBannerPreview(""); return; }
    const url = URL.createObjectURL(banner); setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [banner]);

  const update = (field, value) => { setProfile((current) => ({ ...current, [field]: value })); setMessage(""); };
  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      const form = new FormData();
      for (const field of ["name", "username", "email", "about"]) form.append(field, profile[field]);
      if (avatar) form.append("profilePic", avatar);
      if (banner) form.append("bannerPic", banner);
      const { data } = await axios.post("/profile/edit", form);
      if (!data?.success) throw new Error(data?.message || "Could not save your profile.");
      if (avatar || banner) {
        try {
          const refreshed = await axios.get("/profile", { headers: { "Cache-Control": "no-cache" } });
          const profilePic = imageSrc(refreshed.data.profilePic, "/defaultprofile.jpg");
          const bannerPic = imageSrc(refreshed.data.bannerPic, "/defaultbanner.jpg");
          setProfile((current) => ({ ...current, profilePic, bannerPic }));
          setHeaderUser((current) => ({ ...current, username: profile.username || profile.name, profilePic }));
          setAvatar(null); setBanner(null);
          if (avatarInput.current) avatarInput.current.value = "";
          if (bannerInput.current) bannerInput.current.value = "";
        } catch { setMessage("Profile saved. Refresh the page to see your new images."); return; }
      } else setHeaderUser((current) => ({ ...current, username: profile.username || profile.name }));
      setMessage("Profile changes saved.");
    } catch (err) { setError(err.response?.data?.message || err.message || "Could not save your profile. Please try again."); }
    finally { setSaving(false); }
  };

  const changeAutoplay = (event) => {
    const value = event.target.checked;
    try { localStorage.setItem("xplode-banner-autoplay", String(value)); setAutoplay(value); }
    catch { setError("Could not save this preference in your browser."); }
  };

  const changeTheme = (value) => {
    try { saveTheme(value); setTheme(value); setThemeError(""); }
    catch { setThemeError("Could not save this preference in your browser."); }
  };

  const navigateSection = (event, id) => {
    event.preventDefault();
    const container = settingsMain.current;
    const section = container?.querySelector(`#${id}`);
    if (!section) return;
    const top = section.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    container.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return <main className="settings-page"><div className="settings-content">
    <header className="settings-header"><h1>Settings</h1><p>Manage your profile and preferences.</p></header>
    <div className="settings-layout"><nav className="settings-nav" aria-label="Settings sections"><a href="#settings-profile" onClick={(event) => navigateSection(event, "settings-profile")}><UserRound size={17} /> Profile</a><a href="#settings-preferences" onClick={(event) => navigateSection(event, "settings-preferences")}><SlidersHorizontal size={17} /> Preferences</a><a href="#settings-account" onClick={(event) => navigateSection(event, "settings-account")}><Shield size={17} /> Account</a></nav><div className="settings-main" ref={settingsMain} tabIndex={0} aria-label="Settings content">
    <section id="settings-profile" className="settings-section settings-profile-section" aria-labelledby="profile-settings-title"><div className="settings-section-title"><div><h2 id="profile-settings-title">Your profile</h2><p>Update how you appear on Xplode.</p></div><Link to="/profile">View profile <ArrowUpRight size={15} /></Link></div>
      {loading ? <div className="settings-loading"><LoadingIndicator label="Loading profile" /></div> : profile ? <form onSubmit={saveProfile} className="settings-profile-form">
        <div className="settings-images"><div className="settings-banner"><img src={bannerPreview || profile.bannerPic} alt="" /><button type="button" onClick={() => bannerInput.current?.click()}><Camera size={16} /> Change banner</button><input ref={bannerInput} type="file" accept="image/*" aria-label="Choose banner image" onChange={(event) => { setBanner(event.target.files?.[0] || null); setMessage(""); }} /></div><div className="settings-avatar-row"><img src={avatarPreview || profile.profilePic} alt="Profile" /><div><button type="button" onClick={() => avatarInput.current?.click()}><Camera size={15} /> Change photo</button><p>Choose an image from your device.</p></div><input ref={avatarInput} type="file" accept="image/*" aria-label="Choose profile image" onChange={(event) => { setAvatar(event.target.files?.[0] || null); setMessage(""); }} /></div></div>
        <div className="settings-fields"><label>Name<input value={profile.name} onChange={(event) => update("name", event.target.value)} /></label><label>Username<input value={profile.username} onChange={(event) => update("username", event.target.value)} /></label><label className="settings-full">Email<input type="email" value={profile.email} disabled /><span>Your email cannot be changed here.</span></label><label className="settings-full">About<textarea value={profile.about} onChange={(event) => update("about", event.target.value)} placeholder="Tell us a little about yourself" /></label></div>
        <div className="settings-form-bottom"><div>{error && <p className="settings-error" role="alert">{error}</p>}{message && <p className="settings-success" role="status">{message}</p>}</div><button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button></div>
      </form> : <p className="settings-error" role="alert">{error}</p>}
      {profile && <div id="creator-profile" className="settings-creator-card"><div className="settings-creator-copy"><h3>Creator profile</h3><p>Request a creator profile. Your account becomes a creator after approval.</p><p className="settings-creator-note">Creator requests are coming soon.</p></div><button type="button" disabled>Request creator profile</button></div>}
    </section>
    <section id="settings-preferences" className="settings-section" aria-labelledby="preferences-title"><div className="settings-section-title"><div><h2 id="preferences-title">Preferences</h2><p>Make Xplode feel right for you.</p></div></div><div className="settings-preference-card"><div className="settings-row"><div><h3>Banner autoplay</h3><p>Automatically cycle featured games on the store page. Saved on this device.</p></div><label className="settings-switch"><input type="checkbox" checked={autoplay} onChange={changeAutoplay} aria-label="Banner autoplay" /><span /></label></div><div className="settings-row settings-appearance-row"><div><h3>Appearance</h3><p>Choose your theme. Saved on this device.</p>{themeError && <p className="settings-error" role="alert">{themeError}</p>}</div><div className="settings-theme-control" role="group" aria-label="Appearance theme"><button type="button" aria-pressed={theme === "dark"} onClick={() => changeTheme("dark")}>Dark</button><button type="button" aria-pressed={theme === "light"} onClick={() => changeTheme("light")}>Light</button></div></div></div></section>
    <section id="settings-account" className="settings-section settings-session" aria-labelledby="session-title"><div className="settings-section-title"><div><h2 id="session-title">Account</h2><p>Manage your current session.</p></div></div><div className="settings-session-card"><div><h3>Log out</h3><p>Sign out of your Xplode account on this device.</p></div><button type="button" className="settings-logout" onClick={handleLogout}><LogOut size={17} /> Log out</button></div></section>
    </div></div>
  </div></main>;
}

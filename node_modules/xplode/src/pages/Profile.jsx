import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Gamepad2, Pencil, Users } from "lucide-react";
import axios from "../utils/axios";
import { getUserLibrary } from "../utils/addToLibrary";
import { libraryArtwork } from "../utils/libraryArtwork";
import ArtworkImage from "../components/ArtworkImage";
import LoadingIndicator from "../components/LoadingIndicator";
import { getStreamFavoriteKey, getFavoriteHomies, STREAM_FAVORITES_CHANGED } from "../utils/streamFavorites";
import "./profile.css";

const imageSrc = (image, fallback) => {
  if (typeof image === "string" && image) return image;
  return image?.data && image?.contentType ? `data:${image.contentType};base64,${image.data}` : fallback;
};

function Homie({ stream }) {
  const [failed, setFailed] = useState(false);
  const platform = { youtube: "YouTube", twitch: "Twitch", kick: "Kick" }[stream.platform] || "YouTube";
  return <Link className="profile-homie" to={`/community/live/${encodeURIComponent(stream.id)}`}>
    <span className="profile-homie-avatar">{stream.avatarUrl && !failed ? <img src={stream.avatarUrl} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span>{(stream.creator || "?").charAt(0).toUpperCase()}</span>}</span>
    <span className="profile-homie-name">{stream.creator}</span><span className="profile-homie-platform">{platform}</span>
  </Link>;
}

function LibraryCover({ game }) {
  const sources = libraryArtwork(game);
  const [index, setIndex] = useState(0);
  return <Link className="profile-game" to="/library" aria-label={`View ${game.name || "game"} in library`}>
    <span className="profile-game-cover"><ArtworkImage src={sources[index]} alt="" loading="lazy" onError={() => setIndex((current) => Math.min(current + 1, sources.length - 1))} /></span>
    <span className="profile-game-name">{game.name || game.title || "Untitled game"}</span>
  </Link>;
}

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [libraryError, setLibraryError] = useState("");
  const [homies, setHomies] = useState([]);

  const isSelf = !userId || profile?.isSelf;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProfileError("");

    const endpoint = userId ? `/profile/user/${encodeURIComponent(userId)}` : "/profile";

    axios
      .get(endpoint, { headers: { "Cache-Control": "no-cache" } })
      .then(({ data }) => {
        if (!active) return;
        const profileData = {
          _id: data._id,
          name: data.name || "User",
          username: data.username || "",
          about: data.about || "",
          profilePic: imageSrc(data.profilePic, "/defaultprofile.jpg"),
          bannerPic: imageSrc(data.bannerPic, "/defaultbanner.jpg"),
          favHomies: Array.isArray(data.favHomies) ? data.favHomies : [],
          friendsCount: data.friendsCount || 0,
          isSelf: !userId || data.isSelf,
        };
        setProfile(profileData);
        setHomies(profileData.favHomies);
      })
      .catch(() => {
        if (active) setProfileError("Could not load profile. Please refresh and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // If viewing own profile, also load library
    if (!userId) {
      getUserLibrary()
        .then((data) => {
          if (active) setGames(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          if (active) setLibraryError("Could not load library right now.");
        })
        .finally(() => {
          if (active) setLibraryLoading(false);
        });
    } else {
      setLibraryLoading(false);
    }

    return () => {
      active = false;
    };
  }, [userId]);

  // Listen for favorite changes if viewing own profile
  useEffect(() => {
    if (!isSelf) return;

    const handleFavChange = (event) => {
      if (event?.detail?.homies) {
        setHomies(event.detail.homies);
      } else {
        getFavoriteHomies(true).then((list) => setHomies(list || []));
      }
    };

    window.addEventListener(STREAM_FAVORITES_CHANGED, handleFavChange);
    return () => {
      window.removeEventListener(STREAM_FAVORITES_CHANGED, handleFavChange);
    };
  }, [isSelf]);

  return <main className="profile-page"><div className="profile-content">
    {loading ? <div className="profile-state"><LoadingIndicator label="Loading profile" /></div> : profileError ? <div className="profile-state" role="alert">{profileError}</div> : profile && <>
      <div className="profile-cover"><img src={profile.bannerPic} alt="" /></div>
      <section className="profile-identity" aria-label="Your profile">
        <img className="profile-avatar" src={profile.profilePic} alt="" />
        <div className="profile-name"><h1>{profile.name}</h1>{profile.username && <p>@{profile.username}</p>}</div>
        {profile.isSelf && <div className="profile-actions"><Link className="profile-creator-link" to="/settings#creator-profile">Creator profile <ArrowUpRight size={15} /></Link><Link className="profile-edit" to="/settings#settings-profile"><Pencil size={15} /> Edit profile</Link></div>}
      </section>
      <div className="profile-sections">
        <div className="profile-column">
        <section className="profile-about" aria-labelledby="profile-about-title"><h2 id="profile-about-title">About</h2><p>{profile.about || (profile.isSelf ? "Add a little about yourself to your profile." : "No bio provided.")}</p>{profile.isSelf && !profile.about && <Link to="/settings#settings-profile">Add bio <ArrowUpRight size={14} /></Link>}</section>
        <section className="profile-friends" aria-labelledby="profile-friends-title"><div className="profile-section-heading"><h2 id="profile-friends-title">Friends</h2>{profile.isSelf && <Link to="/chat">View all <ArrowUpRight size={15} /></Link>}</div><div className="profile-friends-empty"><Users size={20} aria-hidden="true" /><p>{profile.friendsCount ? `${profile.friendsCount} ${profile.friendsCount === 1 ? "friend" : "friends"}` : "No friends added yet."}</p></div></section>
        </div>
        <div className="profile-column">
        <section className="profile-homies" aria-labelledby="profile-homies-title"><div className="profile-section-heading"><div><h2 id="profile-homies-title">Fav Homies</h2><p>{profile.isSelf ? "Your favorite creators" : `${profile.name}'s favorite creators`}</p></div><Link to="/community/home">Explore <ArrowUpRight size={15} /></Link></div>{homies.length ? <div className="profile-homies-list">{homies.map((stream) => <Homie key={getStreamFavoriteKey(stream)} stream={stream} />)}</div> : <p className="profile-homies-empty">{profile.isSelf ? "Favorite a creator to see them here." : "No favorite creators yet."}</p>}</section>
        {profile.isSelf && (
          <section className="profile-library" aria-labelledby="profile-library-title"><div className="profile-section-heading"><div><h2 id="profile-library-title">Your games</h2>{!libraryLoading && !libraryError && <p>{games.length} {games.length === 1 ? "game" : "games"} in your library</p>}</div><Link to="/library">View library <ArrowUpRight size={15} /></Link></div>
            {libraryLoading ? <div className="profile-library-state"><LoadingIndicator label="Loading your games" small /></div> : libraryError ? <p className="profile-library-state" role="alert">{libraryError}</p> : games.length ? <div className="profile-game-grid">{games.slice(0, 6).map((game, index) => <LibraryCover key={game.steam_appid || game.appid || game.id || index} game={game} />)}</div> : <div className="profile-library-empty"><Gamepad2 size={22} /><p>Your library is waiting for its first game.</p><Link to="/store">Explore games <ArrowUpRight size={14} /></Link></div>}
          </section>
        )}
        </div>
      </div>
    </>}
  </div></main>;
}

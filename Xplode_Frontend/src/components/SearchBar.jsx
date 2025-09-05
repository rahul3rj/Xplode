import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const DEBOUNCE_MS = 600;

const SearchBar = ({ query, setQuery, filteredGames = [], isLoading = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(query || "");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // keep local input in sync if parent changes query from outside
  useEffect(() => setLocalValue(query || ""), [query]);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // debounce updates sent to parent (prevents spammy network calls)
  useEffect(() => {
    const t = setTimeout(() => {
      if ((query || "") !== localValue) setQuery(localValue);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  const renderSearchContent = () => {
    const hasQuery = (localValue || "").trim().length > 0;
    if (!hasQuery) return null;

    if (isLoading) {
      return (
        <div className="p-6 text-center text-white font-medium animate-pulse">
          <div className="flex items-center justify-center gap-2 ">
            <img src="./Preloader.svg" alt="" className="h-6 text-[#A641FF]" />
          </div>
        </div>
      );
    }

    if (!filteredGames || filteredGames.length === 0) {
      return null;
    }

    return filteredGames.map((game, index) => (
      <Link
        key={`${game.appid || index}  `}
        to={`/game/${game.appid }`}
        className="flex items-center gap-4 p-2 px-5 hover:bg-[#A641FF]/20 transition-all duration-300 cursor-pointer"
      >
        <img
          src={game.capsule_image || game.header_image || "/default.png"}
          alt={game.name}
          className="w-[13vw] h-[11vh] rounded-lg object-cover shadow-md"
          onError={(e) => {
            e.currentTarget.src = "/default.png";
          }}
        />
        <div className="h-[11vh] w-[18vw] flex flex-col justify-center items-between">
          <div className="w-[18vw] h-[8vh] flex flex-col justify-start items-start">
            <h3 className="text-white w-full font-medium truncate">
              {game.name}
            </h3>
            <h5 className="text-[#B5B5B5] font-[gilroy] font-[600] text-[10px]">
              {game.publisher}
            </h5>
          </div>
          <div className="w-full flex justify-between items-end">
            <h5 className="text-white font-[gilroy-bold] text-sm">
              {game.price}
            </h5>
          </div>
        </div>
      </Link>
    ));
  };

  return (
    <div className="w-full relative" ref={searchRef}>
      <div
        className={`w-[35vw] flex flex-col items-start justify-start ml-[2vw] rounded-xl bg-[rgba(90,0,169,0.40)] shadow-[0_4px_5.8px_2px_rgba(13,13,13,0.22)] backdrop-blur-[35px] absolute transition-all duration-300 ease-in-out overflow-hidden${
          localValue && isFocused ? "h-[60vh]" : "h-[6vh]"
        }`}
      >
        <img
          src="../HomePage/Search.svg"
          alt=""
          className="absolute top-[3vh] left-1/50 transform -translate-y-1/2"
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search games..."
          className="h-[6vh] w-full font-[gilroy-bold] placeholder-[#653591] bg-transparent py-3 text-[#fff] px-12 outline-none focus:border-white transition-all"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setLocalValue("");
              setQuery("");
              setIsFocused(false);
            }
            if (e.key === "Enter") {
              e.preventDefault();
              setIsFocused(false);
              navigate(`/search?q=${encodeURIComponent(localValue)}`);
            }
          }}
        />

        {localValue && (
          <div
            onClick={() => {
              setLocalValue("");
              setQuery("");
            }}
            className="text-white bg-transparent absolute right-0 rounded-xl flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-[#A641FF]/20 transition-opacity ease-out duration-500"
          >
            <i className="ri-close-large-line text-sm"></i>
          </div>
        )}

        {localValue && isFocused && (
          <div className="w-full max-h-[54vh] overflow-y-auto hide-scrollbar bg-transparent shadow-lg overflow-hidden">
            {renderSearchContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

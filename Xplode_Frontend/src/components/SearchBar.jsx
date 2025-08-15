import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const SearchBar = ({ query, setQuery, filteredGames, isLoading }) => {
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSearchContent = () => {
    if (!query.trim()) {
      return null;
    }
    if (isLoading) {
      return (
        <div className="p-6 text-center text-white font-medium animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-[#D65F30] border-t-transparent rounded-full animate-spin"></div>
            <span>Searching games...</span>
          </div>
        </div>
      );
    }

    if (filteredGames.length === 0) {
      return (
        <div className="p-6 text-center text-white font-medium">
          🚫 No games found. Try something else!
        </div>
      );
    }

    return filteredGames.map((game, index) => (
      <Link
        key={`${game.appid || game.id}-${index}`} // Added index to make key unique
        to={`/game/${game.appid || game.id}`}
        className="flex items-center gap-4 p-4 hover:bg-[#1B0033] transition-all duration-300 cursor-pointer border-b border-zinc-800 last:border-b-0"
      >
        <img
          src={game.background_image || "/default.png"}
          alt={game.name}
          className="w-14 h-14 rounded-lg object-cover shadow-md"
          onError={(e) => (e.target.src = "/default.png")}
        />
        <div>
          <h3 className="text-white font-medium">{game.name}</h3>
        </div>
      </Link>
    ));
  };

  return (
    <div className="w-[50vw] relative" ref={searchRef}>
      <div className="h-[60%] w-[80%] flex items-center ml-15 relative">
        <img
          src="../HomePage/Search.svg"
          alt=""
          className="absolute top-[50%] left-1/50 transform -translate-y-1/2"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search games..."
          className=" h-full w-[80%] py-1 font-[Gilroy-bold]  rounded-lg bg-[#1B0033] py-2 text-[#fff] px-12 outline-none focus:border-white transition-all"
        />

        {query && (
          <div
            onClick={() => setQuery("")}
            className="text-white bg-[#1B0033]/80 rounded-full flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-[#1B0033] transition-colors duration-300"
          >
            <i className="ri-close-large-line text-lg"></i>
          </div>
        )}
      </div>

      {query && isFocused && (
        <div className="absolute w-[40vw] max-h-[45vh] overflow-y-auto z-10 top-[120%] bg-[#1c1c1c]  shadow-lg border-[1px] border-[#1B0033]">
          {renderSearchContent()}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

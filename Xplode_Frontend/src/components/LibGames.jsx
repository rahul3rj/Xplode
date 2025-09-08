import React from "react";

const LibGames = ({ games, onSelect }) => {
  // Example data – replace with real data / props / API call if desired
  if (games.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <i className="ri-gamepad-line text-[#A641FF] text-6xl mb-5"></i>
        <h3 className="text-white text-lg font-[gilroy-bold] mb-2">
          Your library is empty
        </h3>
        <p className="text-[#696969] text-sm text-center max-w-md">
          Games you add from the store will appear here. <br />
          Browse our collection to find your next adventure!
        </p>
      </div>
    );
  }

  return (


    <div className="h-auto w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-5">
      {games.map((game) => (
        <div className="relative h-[35vh] w-[23vh] cursor-pointer group" onClick={() => onSelect(game.steam_appid)}>
          {/* Shadow behind card */}
          <img
            src={game.portrait_image || "/default-game-cover.jpg"}
            alt={game.name}
            className="absolute top-0 left-0 w-full h-full object-cover blur-lg scale-95 group-hover:scale-100 opacity-0 group-hover:opacity-80 rounded-xl transition-all ease-in-out duration-400"
          />

          {/* Actual Card */}
          <div className="relative h-full w-full overflow-hidden rounded-sm transition duration-400 ease-in-out group-hover:scale-106">
            <img
              src={game.portrait_image || "/default-game-cover.jpg"}
              alt={game.name}
              className="w-full h-full object-cover relative z-10 "
            />

            {/* Shine overlay */}
            <div
              className="absolute inset-0 z-10 -top-50 hover:top-0 transition-all ease-in-out duration-400 opacity-10 group-hover:opacity-50 blur-sm "
              style={{
                background:
                  "linear-gradient(204deg, rgba(255,255,255,0) 32.73%, rgba(255,255,255,0.5) 46.22%, rgba(255,255,255,0.5) 51.29%, rgba(255,255,255,0) 67.12%)",
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LibGames;

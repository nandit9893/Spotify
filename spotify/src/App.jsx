import React, { useContext } from "react";
import SideBar from "./Components/SideBar";
import Player from "./Components/Player";
import Display from "./Components/Display";
import { PlayerContext } from "./Context/PlayerContext";
import Loader from "./Components/Loader";

const App = () => {
  const { audioRef, track, songsData, loading } = useContext(PlayerContext);

  return (
    <div className="h-screen bg-black">
      <audio ref={audioRef} src={track ? track.file : ""}preload="auto"></audio>
      {
        loading ? 
        (
          <div className="flex justify-center items-center flex-col gap-5 h-screen max-w-md mx-auto">
            <Loader />
            <p className="text-2xl text-white font-semibold">Server is uploaded on render.com using free service (Loading ...)</p>
          </div>
        ) 
        : 
        (
          songsData.length > 0 && (
            <>
              <div className="h-[90%] flex">
                <SideBar />
                <Display />
              </div>
              <Player />
            </>
          )
        )
      }
    </div>
  );
};

export default App;

import React, { useContext } from "react";
import SideBar from "./Components/SideBar";
import Player from "./Components/Player";
import Display from "./Components/Display";
import { PlayerContext } from "./Context/PlayerContext";

const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);

  return (
    <div className="h-screen bg-black">
      <audio ref={audioRef} src={track ? track.file : ""} preload="auto"></audio>
      {
        songsData.length !== 0 ? 
        (
          <>
            <div className="h-[90%] flex">
              <SideBar />
              <Display />
            </div>
            <Player />
          </>
        ) 
        : 
        null
      }
    </div>
  );
};

export default App;

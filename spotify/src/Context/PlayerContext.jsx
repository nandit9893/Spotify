import React, { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const url = "http://localhost:8000";
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    await songsData.map((item) => {
      if (id === item._id) {
        setTrack(item);
      }
    })
    await audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = async () => {
    songsData.map(async (item, index) => {
      if (track._id === item._id && index > 0) {
        await setTrack(songsData[index-1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
    })
  };

  const next = async () => {
    songsData.map(async (item, index) => {
      if (track._id === item._id && index < songsData.length) {
        await setTrack(songsData[index+1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
    })
  };

  const seekSong = async (event) => {
    audioRef.current.currentTime = ((event.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration);
  };

  const getAllSongs = async () => {
    const newURL = `${url}/spotify/nandit/songs/list/song`;
    try {
      const response = await axios.get(newURL);
      if (response.data.success) {
        setSongsData(response.data.data);
        setTrack(response.data.data[0]);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAlbums = async () => {
    const newURL = `${url}/spotify/nandit/albums/list/album`;
    try {
      const response = await axios.get(newURL);
      if (response.data.success) {
        setAlbumsData(response.data.data);
      } else {}
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSongs();
    getAllAlbums();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%";
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime%60),
            minute: Math.floor(audioRef.current.currentTime/60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration%60),
            minute: Math.floor(audioRef.current.duration/60),
          },
        });
      };
    }, 1000);
  }, [audioRef]);

  const contextValues = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    next, 
    previous,
    seekSong,
    songsData,
    albumsData,
  };

  return (
    <PlayerContext.Provider value={contextValues}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;

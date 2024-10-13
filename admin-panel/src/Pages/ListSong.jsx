import React, { useEffect, useState } from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import url from "../Utils/URL.js";
const ListSong = () => {
  const [data, setData] = useState([]);

  const fetchAllSongs = async () => {
    const newURL = `${url}/spotify/nandit/songs/list/song`;
    try {
      const response = await axios.get(newURL);
      if (response.data.success) {
        setData(response.data.data);
      } else {

      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllSongs();
  },[]);

  const deleteSong = async (id) => {
    const newURL = `${url}/spotify/nandit/songs/delete/song`;
    try {
      const response = await axios.post(newURL, { id: id});
      if (response.data.success) {
        toast.success("Song removed successfully");
        await fetchAllSongs();
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>All Songs List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-30 text-sm mr-5 bg-gray-50">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>
        {
          data.map((item, index) => {
            return (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5">
                <img className="w-12" src={item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.album}</p>
                <p>{item.duration}</p>
                <p onClick={()=>deleteSong(item._id)} style={{width: "55px", padding: "7px", color: "white", fontWeight: 600, borderRadius: "7px", backgroundColor: "red", cursor: "pointer"}}>Delete</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default ListSong
import React, { useEffect, useState } from "react";
import url from "../Utils/URL.js";
import axios from "axios";
import { toast } from "react-toastify";
const ListAlbum = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAllAlbums();
  }, []);

  const fetchAllAlbums = async () => {
    const newURL = `${url}/spotify/nandit/albums/list/album`;
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

  const deleteAlbum = async (id) => {
    const newURL = `${url}/spotify/nandit/albums/delete/album`;
    try {
      const response = await axios.post(newURL);
      if (response.data.success) {
        toast.success("Album deleted successfully");
        await fetchAllAlbums();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>All Albums List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Color</b>
          <b>Action</b>
        </div>
        {
          data.map((item, index) => {
            return (
              <div className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5" key={index}>
                <img className="w-12" src={item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.desc}</p>
                <input type="color" value={item.bgColor} readOnly style={{pointerEvents: "none"}} />
                <p onClick={()=>deleteAlbum(item._id)} style={{width: "55px", padding: "7px", color: "white", fontWeight: 600, borderRadius: "7px", backgroundColor: "red", cursor: "pointer"}}>Delete</p>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default ListAlbum;

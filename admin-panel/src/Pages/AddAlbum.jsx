import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import url from "../Utils/URL.js";
const AddAlbum = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    bgColor: "#121212",
    desc: "",
    image: "",
  });

  const [image, setImage] = useState(null);
  const [isImageLink, setIsImageLink] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value, files } = event.target;
    if (name === "file" && !isImageLink) {
      const selectedImage = files[0];
      setImage(selectedImage);
      setData((prev) => ({ ...prev, image: selectedImage }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setIsImageLink(value === "link");
    if (value === "link") {
      setImage(null); 
      setData((prev) => ({ ...prev, image: "" }));
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("desc", data.desc);
    formData.append("bgColor", data.bgColor);
    if (isImageLink) {
      formData.append("imageUrl", data.image);
    } else if (data.image) {
      formData.append("image", data.image);
    }
    const newURL = `${url}/spotify/nandit/albums/add/album`;
    try {
      const response = await axios.post(newURL, formData, {
        "headers": {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success("Album added successfully");
        setData({
          name: "",
          desc: "",
          bgColor: "#121212",
          image: "",
        })
        setImage(null);
      } else {

      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred. Please try again."
        );
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error in setting up the request. Please try again.");
      }
    }
    setLoading(false);
  };

  return loading ? 
  ( <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin">
      </div>
    </div>
  )
  :  
  (
    <div className="flex flex-auto">
      <form onSubmit={submitHandler} className="flex flex-col items-start gap-4 text-gray-600">
        <div className="flex gap-8">
          <div className="flex flex-col gap-4">
            <p>Album Image</p>
            <input type="file" id="image" accept="image/*" hidden name="file" onChange={onChangeHandler} disabled={isImageLink} />
            <label htmlFor="image">
              <img className="w-24 cursor-pointer" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
            </label>
          </div>
          <div className="flex flex-col items-center mt-14 mb-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <input className="cursor-pointer" type="radio" id="link" name="link" value="link" onChange={handleRadioChange} checked={isImageLink} />
                <label className="cursor-pointer text-lg font-normal">Image Link</label>
              </div>
              <div className="flex items-center gap-2">
                <input className="cursor-pointer" type="radio" id="file" name="link" value="file" onChange={handleRadioChange} checked={!isImageLink} />
                <label className="cursor-pointer text-lg font-normal">Image File</label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <p>Album name</p>
          <input className="bg-transparent outline-green-600 border-2 border-gray-400 p-1.5 w-[30vw]" type="text" placeholder="Type here" name="name" value={data.name} onChange={onChangeHandler} />
        </div>
        <div className="flex flex-col gap-2.5">
          <p>Album description</p>
          <input className="bg-transparent outline-green-600 border-2 border-gray-400 p-1.5 w-[30vw]" type="text" placeholder="Type here" name="desc" value={data.desc} onChange={onChangeHandler} />
        </div>
        {
          isImageLink && 
          (
            <div className="flex flex-col gap-2.5">
              <p>Album Image Link</p>
              <input type="text" className="bg-transparent outline-green-600 border-2 border-gray-400 p-1.5 w-[30vw]" placeholder="Type here" value={data.image} name="image" onChange={onChangeHandler} />
            </div>
          )
        }
        <div className="flex flex-col gap-3">
          <p>Background Color</p>
          <input className="cursor-pointer" type="color" name="bgColor" value={data.bgColor} onChange={onChangeHandler} />
        </div>
        <button className="text-base bg-black text-white py-2.5 px-14 cursor-pointer" type="submit">ADD</button>
      </form>
      <div className="flex flex-col gap-4 mr-7 ml-7 p-5 flex-1">
        <h2 className="text-center text-5xl font-semibold">Album Instructions</h2>
        <hr className="items-end w-full h-1 bg-black my-4 mt-0" /> 
        <p className="text-black-600 pl-5 pr-5 text-[10px] font-normal m-0 md:text-[20px]">Please fill out all fields and upload your song and image.</p>
        <p className="text-black-600 pl-8 pr-8 text-base font-normal m-0">&bull; Upload album image either by link or by file.</p>
      </div>
    </div>
  );
};

export default AddAlbum;

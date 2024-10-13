import Song from "../models/song.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const addSong = async (req, res) => {
  const { name, desc, album, imageUrl } = req.body;
  const localAudioFile = req.files?.audio?.[0]?.path;
  const localImageFile = req.files?.image?.[0]?.path;
  if (!name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
    });
  }
  if (!desc.trim()) {
    return res.status(400).json({
      success: false,
      message: "Description is required",
    });
  }
  if (!album.trim()) {
    return res.status(400).json({
      success: false,
      message: "Album is required",
    });
  }
  if (!localAudioFile) {
    return res.status(400).json({
      success: false,
      message: "Audio file is required",
    });
  }
  try {
    const songAvailable = await Song.findOne({name: name});
    if (songAvailable) {
        return res.status(404).json({
            success: false,
            message: `${name} is already available`,
        });
    }
    let imageUrlToSave;
    if (localImageFile) {
      const imageResponse = await uploadOnCloudinary(localImageFile, "image");
      if (!imageResponse) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
      imageUrlToSave = imageResponse.secure_url;
    } else if (imageUrl && imageUrl.trim()) {
      imageUrlToSave = imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        message: "Image file or image URL is required",
      });
    }
    const audioResponse = await uploadOnCloudinary(localAudioFile, "video");
    if (!audioResponse) {
      return res.status(500).json({
        success: false,
        message: "Audio upload failed",
      });
    }

    const audioUrl = audioResponse.secure_url;
    const duration = `${Math.floor(audioResponse.duration / 60)}:${Math.floor(audioResponse.duration % 60)}`;
    const newSong = new Song({
      name,
      desc,
      album,
      image: imageUrlToSave,
      file: audioUrl,
      duration,
    });
    await newSong.save();
    return res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      data: newSong,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while saving the songs",
    });
  }
};

const listSong = async (req, res) => {
  try {
    const allSongs = await Song.find({});
    return res.status(200).json({
      success: true,
      message: "All songs fetched successfully",
      data: allSongs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the songs",
    });
  }
};

const deleteSong = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id is required",
    });
  }
  try {
    const deletedSong = await Song.findById(id);
    if (!deletedSong) {
      return res.status(404).json({
        success: false,
        message: "Song not deleted",
      });
    }
    const image = deletedSong.image;
    const audio = deletedSong.file;
    if (image) {
      const imageDeleteResponse = await deleteFromCloudinary(image, "image");
      if (!imageDeleteResponse) {
        return res.status(500).json({
          success: false,
          message: "Image deletion from Cloudinary failed",
        });
      }
    }
    if (audio) {
      const audioDeleteResponse = await deleteFromCloudinary(audio, "video");
      if (!audioDeleteResponse) {
        return res.status(500).json({
          success: false,
          message: "Audio deletion from Cloudinary failed",
        });
      }
    }
    await Song.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Song deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the songs",
    });
  }
};

export { addSong, listSong, deleteSong };

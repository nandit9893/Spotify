import Album from "../models/album.models.js";
import Song from "../models/song.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const addAlbum = async (req, res) => {
  const { name, bgColor, desc, imageUrl } = req.body;
  const localImageFile = req.file?.path;
  if (!name?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Album name is required",
    });
  }
  if (!bgColor?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Background color is required",
    });
  }
  if (!desc?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Album description is required",
    });
  }
  try {
    const albumAvailable = await Album.findOne({ name: name });
    if (albumAvailable) {
      return res.status(409).json({
        success: false,
        message: `Album '${name}' already exists`,
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
    } else if (imageUrl?.trim()) {
      imageUrlToSave = imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        message: "Image file or image URL is required",
      });
    }
    const newAlbum = new Album({
      name,
      bgColor,
      desc,
      image: imageUrlToSave,
    });

    await newAlbum.save();

    return res.status(201).json({
      success: true,
      message: "Album uploaded successfully",
      data: newAlbum,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while saving the album",
    });
  }
};

const listAlbum = async (req, res) => {
    try {
        const allAlbums = await Album.find({});
        return res.status(200).json({
          success: true,
          message: "All albums fetched successfully",
          data: allAlbums,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "An error occurred while fetching the albums",
        });
      }
};

const deleteAlbum = async (req, res) => {
    const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id is required",
    });
  }
  try {
    const deletedAlbum = await Album.findById(id);
    if (!deletedAlbum) {
      return res.status(404).json({
        success: false,
        message: "Album not deleted",
      });
    }
    const albumName = deletedAlbum.name;
    const image = deletedAlbum.image;
    const deletedSongs = await Song.find({album: albumName});
    if (deletedSongs.length > 0) {
      for (const song of deletedSongs) {
        if (song.image) {
          const imageDeleteResponse = await deleteFromCloudinary(song.image, "image");
          if (!imageDeleteResponse) {
            return res.status(500).join({
              success: false,
              message: "Failed to delete image for song",
            });
          }
        }
        if (song.file) {
          const audioDeleteResponse = await deleteFromCloudinary(song.file, "video");
          if (!audioDeleteResponse) {
            return res.status(500).join({
              success: false,
              message: "Failed to delete audio for the song",
            });
          }
        }
      }
      await Song.deleteMany({ album: albumName });
    }
    if (image) {
      const imageDeleteResponse = await deleteFromCloudinary(image, "image");
      if (!imageDeleteResponse) {
        return res.status(500).json({
          success: false,
          message: "Image deletion from Cloudinary failed",
        });
      }
    }
    await Album.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Album deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the albums",
    });
  }
};

const getAllAlbumsNames = async (req, res) => {
  try {
    const albumData = await Album.find({}).select("name");
    if (!albumData || albumData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No albums available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All albums fetched successfully",
      data: albumData,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching albums",
      error: error.message,
    })
  }
};

export { addAlbum, listAlbum, deleteAlbum, getAllAlbumsNames };
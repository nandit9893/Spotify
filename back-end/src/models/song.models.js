import mongoose, { Schema } from "mongoose";

const songSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 500,
    },
    album: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    file: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      required: true,
      match: /^[0-5]?\d:[0-5]\d$/,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.models.Song || mongoose.model("Song", songSchema);

export default Song;

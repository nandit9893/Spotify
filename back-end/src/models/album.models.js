import mongoose, { Schema } from "mongoose";

const albumSchema = new Schema(
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
    bgColor: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.models.Album || mongoose.model("Album", albumSchema);

export default Album;

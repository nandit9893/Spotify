import { Router } from "express";
import { addSong, deleteSong, listSong } from "../controllers/song.controller.js";
import upload from "../middleware/upload.js";

const songRouter = Router();

songRouter.route("/add/song").post(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  addSong
);
songRouter.route("/list/song").get(listSong);
songRouter.route("/delete/song").post(deleteSong);

export default songRouter;

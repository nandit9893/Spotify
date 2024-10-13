import { Router } from "express";
import upload from "../middleware/upload.js";
import { addAlbum, deleteAlbum, getAllAlbumsNames, listAlbum } from "../controllers/album.controller.js";

const albumRouter = Router();

albumRouter.route("/add/album").post(upload.single("image"), addAlbum);
albumRouter.route("/list/album").get(listAlbum);
albumRouter.route("/delete/album").post(deleteAlbum);
albumRouter.route("/get/albums/names").get(getAllAlbumsNames);

export default albumRouter;
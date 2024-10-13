import express from "express";
import cors from "cors";
import songRouter from "./routes/song.routes.js";
import albumRouter from "./routes/album.router.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/spotify/nandit/songs", songRouter);
app.use("/spotify/nandit/albums", albumRouter);

export default app;
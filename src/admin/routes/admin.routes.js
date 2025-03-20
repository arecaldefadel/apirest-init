import express from "express";
import {
  addAlbum,
  addPhotos,
  login,
  getListAlbums,
  listPhotosByAlbum,
  changePwd,
  getUsers,
  deletePhoto,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get("/ping", (req, res) => {
  res.status(200).send("Conexión exitosa");
});
router.post("/login", login);
router.post("/users", getUsers);
router.post("/changePassword", changePwd);
router.post("/photo", addPhotos);
router.delete("/photo", deletePhoto);
router.post("/albums", addAlbum);
router.get("/albums", getListAlbums);
router.get("/albums/:id", listPhotosByAlbum);

export default router;

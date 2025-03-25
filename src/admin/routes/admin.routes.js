import express from "express";
import {
  addAlbum,
  addImages,
  login,
  getListAlbums,
  listImagesByAlbum,
  changePwd,
  getUsers,
  deleteImage,
  deleteAlbum,
  updateAlbum,
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
router.post("/image", addImages);
router.delete("/image", deleteImage);
router.post("/albums", addAlbum);
router.get("/albums", getListAlbums);
router.delete("/albums", deleteAlbum);
router.put("/albums", updateAlbum);
router.get("/albums/:id", listImagesByAlbum);

export default router;

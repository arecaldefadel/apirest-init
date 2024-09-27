import express from 'express';
import {
  addAlbum,
  addPhotos,
  login,
  getListAlbums,
} from '../controllers/admin.controller.js';
import { verifyToken } from '../middlewares/authJwt.js';

// requiero el ruteador
const router = express.Router();

// Endpoints
router.get('/ping', (req, res) => {
  res.status(200).send('Conexión exitosa');
});
router.post('/login', login);
router.post('/addAlbums', verifyToken, addAlbum);
router.post('/addPhoto', verifyToken, addPhotos);
router.get('/albums', getListAlbums);
export default router;

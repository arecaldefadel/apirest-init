import {
  listAlbums,
  addAlbumService,
  addPhotoService,
} from '../services/admin.service.js';

export const login = async (req, res) => {
  const { id } = req.body;

  const request = await getData(id);
  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, msg: request.data });
};

export const addAlbum = async (req, res) => {
  const { thumbnail, alt, title, description } = req.body;

  const request = await addAlbumService({ thumbnail, alt, title, description });
  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, msg: request.data });
};

export const addPhotos = async (req, res) => {
  const { id } = req.body;

  const request = await addPhotoService(id);
  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, msg: request.data });
};

export const getListAlbums = async (req, res) => {
  const request = await listAlbums();
  // if (request?.error) {
  //   return res.status(401).json({ error: true, msg: request.msg });
  // }
  return res.status(200).json({ error: false, data: request });
};

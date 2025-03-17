import {
  listAlbums,
  addAlbumService,
  addPhotoService,
  getUser,
  changePwdService,
} from "../services/admin.service.js";

export const login = async (req, res) => {
  const { id } = req.body;

  const request = await getData(id);
  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, msg: request.data });
};

export const addAlbum = async (req, res) => {
  const { thumbnail, title, description, images } = req.body;

  const requestAlbum = await addAlbumService({
    thumbnail,
    title,
    description,
  });
  if (requestAlbum?.error) {
    return res.status(400).json({ error: true, msg: request.msg });
  }

  console.log("images", images);

  const requestPhotos = await addPhotoService({
    porfolio_id: requestAlbum.data.lastInsertRowid,
    images,
  });
  if (requestPhotos?.error) {
    return res.status(400).json({ error: true, msg: request.msg });
  }

  return res.status(200).json({ error: false, msg: requestPhotos.data });
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

export const getUsers = async (req, res) => {
  const { user, passUser } = req.body;
  const request = await getUser({ user, passUser });
  if (request.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, data: request });
};

/** Cambiar contraseña de usuario */
export const changePwd = async (req, res) => {
  const { pwd } = req.body;
  const request = await changePwdService({ pwd });

  if (request.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, data: request });
};

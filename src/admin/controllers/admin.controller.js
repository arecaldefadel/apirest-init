import {
  listAlbums,
  addAlbumService,
  addImageService,
  getUser,
  changePwdService,
  listImagesByAlbumService,
  deleteImageService,
  deleteAlbumService,
  updateAlbumService,
} from "../services/admin.service.js";

export const login = async (req, res) => {
  const { id } = req.body;

  const request = await getData(id);
  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, msg: request.data });
};

export const addImages = async (req, res) => {
  const { porfolio_id, images } = req.body;

  const request = await addImageService({ porfolio_id, images });
  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, msg: request.data });
};

export const deleteImage = async (req, res) => {
  const { id, name } = req.body;
  const request = await deleteImageService({ id, name });
  console.log(request);
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
    return res.status(400).json({ error: true, msg: requestAlbum.msg });
  }

  console.log("images", images);

  const requestImages = await addImageService({
    porfolio_id: requestAlbum.data[0].id,
    images,
  });
  if (requestImages?.error) {
    return res.status(400).json({ error: true, msg: requestImages.msg });
  }

  return res.status(200).json({ error: false, msg: requestImages.data });
};

export const deleteAlbum = async (req, res) => {
  const { id } = req.body;
  const request = await deleteAlbumService({ id });

  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, data: request.data });
};

export const updateAlbum = async (req, res) => {
  const { id, thumbnail, title, description } = req.body;
  const request = await updateAlbumService({
    id,
    thumbnail,
    title,
    description,
  });

  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
  return res.status(200).json({ error: false, data: request.data });
};

export const getListAlbums = async (req, res) => {
  const { id } = req.query;
  const request = await listAlbums({ id });
  // if (request?.error) {
  //   return res.status(401).json({ error: true, msg: request.msg });
  // }
  return res.status(200).json({ error: false, data: request });
};

export const listImagesByAlbum = async (req, res) => {
  const { id } = req.params;
  const request = await listImagesByAlbumService({ id });
  if (request?.error) {
    return res.status(401).json({ error: true, msg: request.msg });
  }
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

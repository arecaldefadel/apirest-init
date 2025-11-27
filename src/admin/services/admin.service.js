import { clientSupabase } from "../../db/connection.js";
import bcrypt from "bcryptjs";
import { nvl } from "../../utils.js";
import cloudinary from "cloudinary";
import config from "../../config.js";

cloudinary.v2.config({
  cloud_name: config.CLOUD_NAME_CLOUDINARY,
  api_key: config.API_KEY_CLOUDINARY,
  api_secret: config.API_SECRET_CLOUDINARY,
  secure: true,
});

/** Función para el inicio de sesión del usuario al sistema.
 * @returns {Array} id y rol
 */
export const logger = async (user = "", pass) => {
  let compare = false;

  let { data: userData, error } = await clientSupabase
    .from("user")
    .select("*")
    .eq("user", user);

  if (error) return { msg: error.message, error: true };

  if (!userData || userData.length === 0)
    return { msg: "Usuario o contraseña incorrecta.", error: true };

  const { pass: userPass } = userData[0];
  compare = bcrypt.compareSync(pass, userPass);
  if (!compare) return { msg: "Usuario o contraseña incorrecta.", error: true };

  return { data: userData, error: false };
};

export const addImageService = async ({ porfolio_id, images = [] }) => {
  try {
    if (!porfolio_id || images.length === 0)
      return { msg: "Sin imágenes o porfolio_id inválido.", error: true };

    const rowsToInsert = images.map((img) => ({
      porfolio_id,
      width: img.width,
      height: img.height,
      name: img.id,
      url: img.url,
    }));

    const { data, error } = await clientSupabase
      .from("album_photos")
      .insert(rowsToInsert)
      .select();

    if (error) return { msg: error.message, error: true };

    return { data, error: false };
  } catch (error) {
    console.error(error);
    return { msg: error.message, error: true };
  }
};

export const deleteImageService = async ({ id, name }) => {
  try {
    let { data: deleteImageResult, error: deleteImageError } =
      await clientSupabase.from("album_photos").delete().eq("id", id);

    if (deleteImageError) {
      return { msg: deleteImageError.message, error: true };
    }

    // Eliminar el archivo de Cloudinary con cloudinary v2
    const resultCloudinary = await cloudinary.v2.api.delete_resources([name], {
      type: "upload",
      resource_type: "image",
    });

    if (resultCloudinary.error)
      return { msg: resultCloudinary.error.message, error: true };

    if (resultCloudinary.deleted[name] === "deleted") {
      return { data: "Imagen eliminada de Cloudinary", error: false };
    }
  } catch (error) {
    console.error(error);
    return { msg: error.message, error: true };
  }
};

export const addAlbumService = async ({
  thumbnail = "",
  alt = "Foto de porfolio",
  title = "",
  description = "",
}) => {
  try {
    let { data: addAlbumResult, error: addAlbumError } = await clientSupabase
      .from("portfolio")
      .insert({ thumbnail, alt, title, description });

    if (addAlbumError) {
      return { msg: addAlbumError.message, error: true };
    }

    return { data: addAlbumResult, error: false };
  } catch (error) {
    console.error(error);
    return { msg: error.message, error: true };
  }
};

export const updateAlbumService = async ({
  id = 0,
  thumbnail = "",
  title = "",
  description = "",
}) => {
  try {
    let { data: updateAlbumResult, error: updateAlbumError } =
      await clientSupabase
        .from("portfolio")
        .update({ thumbnail, title, description })
        .eq("id", id);

    console.log({
      id,
      thumbnail,
      title,
      description,
    });

    if (updateAlbumError) {
      return { msg: updateAlbumError.message, error: true };
    }

    return { data: updateAlbumResult, error: false };
  } catch (error) {
    console.error(error);
    return { msg: error.message, error: true };
  }
};

export const deleteAlbumService = async ({ id }) => {
  try {
    let { data: countImagesRel, error } = await clientSupabase
      .from("album_photos")
      .select("porfolio_id")
      .eq("porfolio_id", id);

    if (countImagesRel.length > 0) {
      return { msg: "El álbum tiene fotos asociadas.", error: true };
    }

    let { data: deleteAlbumResult, error: deleteAlbumError } =
      await clientSupabase.from("portfolio").delete().eq("id", id);

    if (deleteAlbumError) {
      return { msg: deleteAlbumError.message, error: true };
    }

    // cloudinary.v2.api
    //   .delete_folder("/Gatitos")
    //   .then(console.log)
    //   .catch((err) => {
    //     console.error(err);
    //     return { msg: err.message, error: true };
    //   });

    return { data: deleteAlbumResult, error: false };
  } catch (error) {
    console.error(error);
    return { msg: error.message, error: true };
  }
};

export const listAlbums = async ({ id }) => {
  try {
    let { data: albumPhotos, error } = await clientSupabase
      .from("albums_principal")
      .select("*");
    console.log({ albumPhotos, error });
    // .is("portfolio.id", id ? id : null);
    if (error) return { msg: error.message, error: true };
    return { data: albumPhotos, error: false };
  } catch (error) {
    console.error(error.message);
    return { msg: error.message, error: true };
  }
};

export const listImagesByAlbumService = async ({ id }) => {
  try {
    let { data: albumPhotos, error } = await clientSupabase
      .from("album_photos")
      .select("*")
      .eq("porfolio_id", id);
    return albumPhotos;
  } catch (error) {
    console.error(error.message);
  }
};

export const getUser = async ({ user, passUser }) => {
  let compare = false;
  try {
    let { data: userData, error } = await clientSupabase
      .from("user")
      .select("*")
      .eq("user", user);

    if (!userData || userData.length === 0)
      return { msg: "Usuario o contraseña incorrecta.", error: true };

    const { pass } = userData[0];
    compare = bcrypt.compareSync(passUser, pass);
    if (!compare)
      return { msg: "Usuario o contraseña incorrecta.", error: true };

    return { rows: userData, error: false };
  } catch (error) {
    console.error(error);
  }
};

export const changePwdService = async ({ pwd }) => {
  try {
    const hashPwd = await bcrypt.hash(pwd, 10);
    return { data: hashPwd, error: false };
  } catch (error) {
    console.error(error);
    return { msg: error.message, error: true };
  }
};

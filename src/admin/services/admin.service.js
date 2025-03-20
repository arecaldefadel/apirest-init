import client from "../../db/connection.js";
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
  let result = [];
  const verifyCUITQr = "SELECT * FROM user where user = @USER";
  const verifyCUITRst = await client.execute(verifyCUITQr);
  const { rows: usuario } = verifyCUITQr;

  // if (!usuario) {
  //   const dataUserQuery =
  //     'SELECT * FROM USUARIOS_FP where UFP_USUARIO = @UFP_USUARIO AND ELIMINADO = 0';
  //   const resultDataUser = await pool
  //     .request()
  //     .input('USER', sql.NVarChar, nvl(user, '').trim().toLowerCase())
  //     .query(dataUserQuery);
  //   result = resultDataUser.recordset[0];
  // }

  if (result) compare = bcrypt.compareSync(pass, result.UFP_PWD);

  return new Promise((resolve, reject) => {
    compare
      ? resolve({
          id: result.UFP_CODIGO,
          rol: 1,
        })
      : resolve({ error: true });
  });
};

export const addPhotoService = async ({ porfolio_id, images = [] }) => {
  try {
    let queryInsert = `INSERT INTO albumPhotos (porfolio_id, width,height, name, url) VALUES `;
    let queryValues = "";
    let queryArgs = {};
    let i = 0;
    for (const img of images) {
      queryValues += `(:porfolio_id, :width${i}, :height${i}, :name${i}, :url${i}),`;
      queryArgs[`width${i}`] = img.width;
      queryArgs[`height${i}`] = img.height;
      queryArgs[`name${i}`] = img.id;
      queryArgs[`url${i}`] = img.url;
      i++;
    }
    queryValues = queryValues.slice(0, -1);
    queryInsert += queryValues;

    const result = await client.execute({
      sql: queryInsert,
      args: { porfolio_id, ...queryArgs },
    });

    return { data: result, error: false };
  } catch (error) {
    console.error(error);
    return { msg: error.message, error: true };
  }
};

export const deletePhotoService = async ({ id, name }) => {
  try {
    const result = await client.execute({
      sql: "DELETE FROM albumPhotos WHERE id = :id",
      args: { id },
    });

    if (result.error) return { msg: result.msg, error: true };
    // Eliminar el archivo de Cloudinary con cloudinary v2
    const resultCloudinary = await cloudinary.v2.api.delete_resources([name], {
      type: "upload",
      resource_type: "image",
    });

    if (resultCloudinary.error)
      return { msg: resultCloudinary.error.message, error: true };

    if (resultCloudinary.deleted[name] === "deleted") {
      console.log("Imagen eliminada de Cloudinary");
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
    const result = await client.execute({
      sql: "INSERT INTO portfolio (thumbnail, alt, title, description) VALUES (:thumbnail, :alt, :title, :description)",
      args: { thumbnail, alt, title, description },
    });

    return { data: result, error: false };
  } catch (error) {
    console.error(error);
    return { msg: error.message, error: true };
  }
};

export const listAlbums = async ({ id }) => {
  let result = {};
  try {
    if (id > 0) {
      result = await client.execute({
        sql: "SELECT portfolio.*, albumPhotos.url FROM portfolio INNER JOIN albumPhotos ON porfolio_id = portfolio.id AND albumPhotos.name = portfolio.thumbnail WHERE url is not null and portfolio.id = :id",
        args: { id },
      });
    } else {
      result = await client.execute(
        "SELECT portfolio.*, albumPhotos.url FROM portfolio INNER JOIN albumPhotos ON porfolio_id = portfolio.id AND albumPhotos.name = portfolio.thumbnail WHERE url is not null"
      );
    }

    return { rows: result.rows, error: false };
  } catch (error) {
    console.error(error);
  }
};

export const listPhotosByAlbumService = async ({ id }) => {
  try {
    const result = await client.execute({
      sql: "SELECT id, width, height, url, name FROM albumPhotos where porfolio_id  = :id",
      args: { id },
    });

    return { rows: result.rows, error: false };
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async ({ user, passUser }) => {
  let compare = false;
  try {
    const result = await client.execute({
      sql: "SELECT * FROM  user where user = :user",
      args: { user },
    });

    if (!result.rows.length > 0)
      return { msg: "Usuario o contraseña incorrecta.", error: true };

    const { pass } = result.rows[0];
    compare = bcrypt.compareSync(passUser, pass);
    if (!compare)
      return { msg: "Usuario o contraseña incorrecta.", error: true };

    console.log({ passUser, pass, compare });
    return { rows: result.rows, error: false };
  } catch (error) {
    console.error(error);
  }
};

export const changePwdService = async ({ pwd }) => {
  pwd = nvl(pwd, "").trim();
  const hashPwd = await bcrypt.hash(pwd, 10);
  return hashPwd;
};

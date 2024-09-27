import client from '../../db/connection.js';
import bcrypt from 'bcryptjs';

/** Función para el inicio de sesión del usuario al sistema.
 * @returns {Array} id y rol
 */
export const logger = async (user = '', pass) => {
  let compare = false;
  let result = [];
  const verifyCUITQr =
    'SELECT * FROM USUARIOS_FP where UFP_CUIT = @UFP_CUIT AND ELIMINADO = 0';
  const verifyCUITRst = await client.execute('SELECT * FROM  portfolio');
  const { rows: usuario } = verifyCUITQr;

  if (!usuario) {
    const dataUserQuery =
      'SELECT * FROM USUARIOS_FP where UFP_USUARIO = @UFP_USUARIO AND ELIMINADO = 0';
    const resultDataUser = await pool
      .request()
      .input('UFP_USUARIO', sql.NVarChar, nvl(user, '').trim().toLowerCase())
      .query(dataUserQuery);
    result = resultDataUser.recordset[0];
  }

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
export const addPhotoService = async ({ porfolio_id, width, height, name }) => {
  try {
    const result = await client.execute({
      sql: 'INSERT INTO portfolio VALUES (:thumbnail, :alt, :title, :description)',
      args: { porfolio_id, width, height, name },
    });

    return { data: result, error: false };
  } catch (error) {
    console.error(error);
  }
};

export const addAlbumService = async ({
  thumbnail = '',
  alt = '',
  title = '',
  description = '',
}) => {
  try {
    const result = await client.execute({
      sql: 'INSERT INTO portfolio VALUES (:thumbnail, :alt, :title, :description)',
      args: { thumbnail, alt, title, description },
    });

    return { data: result, error: false };
  } catch (error) {
    console.error(error);
  }
};

export const listAlbums = async () => {
  try {
    const result = await client.execute('SELECT * FROM  portfolio');
    return { data: result, error: false };
  } catch (error) {
    console.error(error);
  }
};

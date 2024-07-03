// Importamos la libreria para manejar las variables de entorno
import { config } from 'dotenv';

import mssql from 'mssql';

// Toma el contenido del .env en una función process.env
config();
// Definiendo en una constante los atributos para la conexion a la base de datos
const dbSettings = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  options: {
    // encrypt: true,
    trustServerCertificate: true,
  },
};

/** Función para la conexión de la base de datos */
export async function getConnection() {
  try {
    /** Constante de conexión de la base de datos */
    const pool = sql.connect(dbSettings);

    return pool;
  } catch (e) {
    console.warn('Error => ' + e);
  }
}

export const sql = mssql;

getConnection();

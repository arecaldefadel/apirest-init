import process from 'process'
import fs from 'fs'

let name = process.argv[2]
name = name.toLowerCase()

let errorFile = true

const routeFile = `import express from 'express'
import { getController } from '../controllers/${name}.controller.js'

// requiero el ruteador
const router = express.Router()

// Endpoints
router.get('/ping', (req, res) => {
  res.status(200).send('Conexión exitosa')
})
router.get('/', getController)

export default router
`

const controllerFile = `import { getData } from '../services/${name}.service.js'

export const getController = async (req, res) => {
  const { id } = req.body

  const request = await getData(id)
  if (request?.error) { return res.status(401).json({ error: true, msg: request.msg }) }
  return res.status(200).json({ error: false, msg: request.msg })
}
`

const serviceFile = `import { getConnection, sql } from '../../db/connection.js'
const pool = await getConnection()

export const getData = async (id) => {
  const query = 'SELECT * FROM TABLE_NAME WHERE TABLA_CODIGO = @TABLA_CODIGO'

  try {
    const recordset = await pool
      .request()
      .input('TABLA_CODIGO', sql.NVarChar, id)
      .query(query)
    const result = recordset.recordset
    return result
  } catch (e) {
    return { status: '500', datos: {}, message: e.message }
  }
}
`
const middlewareFile = `export const validation = async (req, res, next) => {
  const error = true
  try {
    if (error) return res.status(401).send('Error: ')
    next()
  } catch (error) {
    return res.status(401).send('Error: ' + error.message)
  }
}
`

/**
 *  Función para crear archivos con su respectivo contenido
 * @param {String} file Archivo con su ruta relativa
 * @param {String} content Contenido que contendra el archivo
 */
const createFile = (file, content) => {
  fs.appendFile(
    file,
    content,
    function (err) {
      if (err) throw err
      errorFile = false
    }
  )
}

try {
  if (!name) throw new Error('Debe especificar un nombre para el módulo nuevo.')

  if (!fs.existsSync(`./src/${name}`)) {
    fs.mkdirSync(`./src/${name}`)

    // Carpetas para el módulo.
    fs.mkdirSync(`./src/${name}/controllers`)
    fs.mkdirSync(`./src/${name}/routes`)
    fs.mkdirSync(`./src/${name}/services`)
    fs.mkdirSync(`./src/${name}/middlewares`)

    // Archivos iniciales para el módulo.
    createFile(`./src/${name}/services/${name}.service.js`, serviceFile)
    createFile(`./src/${name}/controllers/${name}.controller.js`, controllerFile)
    createFile(`./src/${name}/routes/${name}.routes.js`, routeFile)
    createFile(`./src/${name}/middlewares/${name}.middleware.js`, middlewareFile)

    const mensajeExito = `
    ===============================
    ¡Servicio creado correctamente!
    ===============================
    `

    if (errorFile) console.log(mensajeExito)
  } else {
    throw new Error('Ya existe módulo con ese nombre.')
  }
} catch (err) {
  console.error(err)
}

import express from 'express';
import admin from './admin/routes/admin.routes.js';
/*
  funcion router madre para el manejo
  de las rutas internas de cada servicio
*/

const routerGetway = (app) => {
  const router = express.Router();
  // version de la api
  app.use('/api/v1', router);
  // Rutas de cada servicio
  router.use('/admin', admin);
};

export default routerGetway;

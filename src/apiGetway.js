import express from 'express';
/*
  funcion router madre para el manejo
  de las rutas internas de cada servicio
*/

const routerGetway = (app) => {
  const router = express.Router();
  // version de la api
  app.use('/api/v1', router);
  // Rutas de cada servicio
  // router.use('/', route);
};

export default routerGetway;

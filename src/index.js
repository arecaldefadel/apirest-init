//  const express = require("express");
import https from 'https';
import fs from 'fs';
import routerGetway from './apiGetway.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (config.NODE_ENV === 'production') {
  const sslServer = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
    },
    app
  );

  // escucho el puerto
  sslServer.listen(
    app.get('port'),
    console.log('Inicio el servidor de production', app.get('port'))
  );
} else if (config.NODE_ENV === 'development') {
  app.listen(
    app.get('port'),
    console.log('Inicio el servidor de development', app.get('port'))
  );
}

routerGetway(app);

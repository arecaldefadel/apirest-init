import express from 'express';
import config from './config.js';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

// creo el objeto
const app = express();
// settings
app.set('port', config.port);
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(helmet());

app.use(cors());

// exporto el objeto
export default app;

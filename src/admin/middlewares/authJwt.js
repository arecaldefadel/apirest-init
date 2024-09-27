import jwt from 'jsonwebtoken';
import config from '../../config.js';

const TOKEN_EXCEPTION = {
  EXPIRED: 'TokenExpiredError',
  WEB_TOKEN: {
    NAME: 'JsonWebTokenError',
    MESSAGE: {
      'invalid token': 'Token inválido',
      'jwt malformed': 'Token mal formado',
      'jwt signature is required': 'Firma del token requerido',
      'invalid signature': 'Firma del token inválida',
    },
  },
};

/** handler para devolver el token de login */
export const handleLogin = async (req, res) => {};
/** Verifica si el usuario loggeado tiene un token válido */
export const verifyToken = (req, res, next) => {
  try {
    const auth = req.get('authorization');

    if (!auth && auth.toLowerCase().startsWith('bearer')) {
      return res.status(401).send('No posee token o es invalido');
    }

    const token = auth.split(' ')[1];
    if (!token) return res.status(401).send('No posee token o es invalido');

    const decoder = jwt.verify(token, config.TOKEN_KEY);

    next();
  } catch (error) {
    if (error.name === TOKEN_EXCEPTION.EXPIRED) {
      return res.status(401).send({
        error: true,
        msg: 'Su sesión a expirado. Vuelva a iniciar sesión',
      });
    }

    if (error.name === TOKEN_EXCEPTION.WEB_TOKEN.NAME) {
      return res.status(401).send({
        error: true,
        msg: TOKEN_EXCEPTION.WEB_TOKEN.MESSAGE[error.message],
      });
    }
    return res.status(401).send({ error: true, msg: error.message });
  }
};
/** Verifica si el usuario es Administrador */
export const isAdmin = async (req, res, next) => {
  // Tipos de usuarios.
  const ADMIN_USER = 1;
  try {
    const auth = req.get('authorization');
    const token = auth.split(' ')[1];
    const decoderToken = jwt.verify(token, config.TOKEN_KEY);
    const { id } = decoderToken;
    const resultUserData = await getUserData(id);

    if (parseInt(resultUserData.rol) === ADMIN_USER) {
      next();
    } else {
      return res.status(401).send('No posee permisos para esta acción');
    }
  } catch (error) {
    res.status(401).send(error.messagge);
  }
};

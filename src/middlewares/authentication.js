'use strict';

import jwt from 'jsonwebtoken';
import { generateError } from '../helpers.js';

export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  xº;

  if (!authorization) {
    return next(generateError('No hay cabecera de autorización', 401));
  }

  if (!process.env.JWT_SECRET_KEY) {
    return next(generateError('La clave secreta de JWT no está definida', 500));
  }
  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET_KEY);
    req.auth = decoded;
    next();
  } catch (error) {
    next(generateError('El token no es válido', 401));
  }
};

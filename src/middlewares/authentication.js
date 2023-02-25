'use strict';

import jwt from 'jsonwebtoken';
import { generateError } from '../helpers.js';

export const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      generateError('No hay cabecera de autorización', 401);
    }

    if (!process.env.JWT_SECRET_KEY) {
      generateError('La clave secreta de JWT no está definida', 500);
    }
    try {
      const decoded = jwt.verify(authorization, process.env.JWT_SECRET_KEY);
      req.auth = decoded;
      next();
    } catch {
      generateError('El token no es válido', 401);
    }
  } catch (error) {
    next(error);
  }
};

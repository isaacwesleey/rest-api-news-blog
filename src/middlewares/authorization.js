import { generateError } from '../helpers.js';
import { pool } from '../db.js';

// Middleware para comprobar si el usuario es el propietario de la noticia

export const checkNewsOwnership = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.auth.id;

  try {
    const [result] = await pool.query(
      'SELECT id FROM news WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!result.length) {
      generateError('You are not authorized to do this', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

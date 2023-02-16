import { generateError } from '../helpers.js';
import { pool } from '../db.js';

// export const checkNewsOwnership = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const [result] = await pool.query(
//       'SELECT id FROM news WHERE id = ? AND user_id = ?',
//       [id, userId]
//     );

//     console.log(result);

//     if (!result) {
//       throw generateError(
//         `No se encontró la noticia con id ${id} en la base de datos`,
//         404
//       );
//     }

//     if (result.user_id !== req.auth.id) {
//       throw generateError('No tienes permiso para editar esta noticia', 401);
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// export const checkNewsOwnership = async (req, res, next) => {
//   const { id } = req.params;
//   const userId = req.auth.id;

//   console.log(`Noticia: ${id} - Usuario: ${userId}`);
//   try {
//     const [result] = await pool.query(
//       'SELECT id FROM news WHERE id = ? AND user_id = ?',
//       [id, userId]
//     );
//     console.log(result.user_id);

//     if (result.user_id !== req.auth.id) {
//       return next(generateError('You are not authorized to do this', 403));
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

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
      return next(generateError('You are not authorized to do this', 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};

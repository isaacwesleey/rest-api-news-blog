import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { generateError } from '../helpers.js';

// getUsers is a function that returns all users

export const getUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');

    res.status(200).send({
      status: 'ok',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// createUser is a function that creates a new user

export const createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return next(generateError('Faltan campos', 400));
    }

    const [existingUser] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (existingUser.length > 0) {
      return next(
        generateError(`Ya existe un usuario con email ${email}`, 409)
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`,
      [email, passwordHash, name]
    );

    const newUserId = result.insertId;
    res.send({
      status: 'ok',
      data: {
        id: newUserId,
        email: email,
        name: name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// deleteUser is a function that deletes a single user

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Buscar el usuario que se quiere eliminar
    const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);

    if (user.length === 0) {
      return res.status(404).json({
        message: `User with id ${id} not found`,
      });
    }

    // Verificar si el usuario autenticado es el propietario del usuario que se quiere eliminar
    if (req.auth.id !== Number(id)) {
      generateError('No tienes permisos para eliminar este usuario', 403);
    }

    // Eliminar el usuario
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (!result.affectedRows) {
      return res.status(404).json({
        message: `User with id ${id} not found`,
      });
    }

    res.send({
      status: 'ok',
      data: {
        id: id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// updateUser is a function that updates a single user

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      generateError('Faltan campos', 400);
    }

    // Verificar si el usuario autenticado es el propietario de la información
    if (req.auth.id !== Number(id)) {
      generateError('No tienes permisos para editar esta información', 403);
    }

    const [result] = await pool.query(
      `UPDATE users SET email = ?, password = ?, name = ? WHERE id = ?`,
      [email, password, name, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        message: `User with id ${id} not found`,
      });
    }

    res.send({
      status: 'ok',
      data: {
        id: id,
        email: email,
        name: name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// getUserById is a function that returns a single user

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [user] = await pool.query(
      `SELECT id, email, name FROM users WHERE id = ?`,
      [Number(id)]
    );
    // El usuario solo puede ver su propia información (no la de otros usuarios)
    if (req.auth.id !== Number(id)) {
      generateError('No tienes permisos para ver esta información', 403);
    }

    if (user.length === 0) {
      generateError(`Usuario con id ${id} no encontrado`, 404);
    }

    res.send({
      status: 'ok',
      data: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// loginUser is a function that logs in a user

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw generateError('Faltan campos', 400);
    }

    const [user] = await pool.query(
      `SELECT id, email, password FROM users WHERE email = ?`,
      [email]
    );

    if (user.length === 0) {
      throw generateError(`Usuario con email ${email} no encontrado`, 404);
    }
    // Comparamos la contraseña que nos llega con la que tenemos en la base de datos
    const passwordHash = user[0].password;

    const passwordsMatch = await bcrypt.compare(password, passwordHash);

    if (!passwordsMatch) {
      throw generateError('Email o contraseña incorrectos', 401);
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        email: user[0].email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '24h',
      }
    );

    res.send({
      status: 'ok',
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

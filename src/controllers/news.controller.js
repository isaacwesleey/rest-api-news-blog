import { pool } from '../db.js';
import { generateError } from '../helpers.js';
import { savePhoto } from '../helpers.js';

// getNews is a function that returns all news items

export const getNews = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'SELECT * FROM news ORDER BY created_at DESC LIMIT 10'
    );

    if (!result.length) {
      generateError('No news found', 404);
    }

    res.send({
      status: 'ok',
      data: {
        news: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

// createNews is a function that creates a single news item

export const createNews = async (req, res, next) => {
  try {
    const { title, content, lede, theme } = req.body;

    if (!title || !content || !lede || !theme) {
      generateError('All fields are required', 400);
    }

    let image;

    // If there is an image, save it and get the filename
    if (req.files?.image) {
      image = await savePhoto(req.files.image);
    }

    const { id } = req.auth;

    const [result] = await pool.query(
      'INSERT INTO news (user_id, title, content, lede, theme, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, title, content, lede, theme, image, new Date()]
    );

    const newsId = result.insertId;

    res.send({
      status: 'ok',
      data: {
        news: {
          id: newsId,
          user_id: id,
          title,
          content,
          lede,
          theme,
          image,
          created_at: new Date(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// deleteNews is a function that deletes a single news item

export const deleteNews = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM news WHERE id = ?', [id]);

    if (!result.affectedRows) {
      generateError(`News with id ${id} not found`, 404);
    }

    res.send({
      status: 'ok',
      data: {
        message: `News with id ${id} deleted`,
      },
    });
  } catch (error) {
    next(error);
  }
};

// updateNews is a function that updates a single news item

export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, lede, theme } = req.body;

    const [result] = await pool.query(
      'UPDATE news SET title = ?, content = ?, lede = ?, theme = ? WHERE id = ?',
      [title, content, lede, theme, id]
    );

    if (!result.affectedRows) {
      generateError(`News with id ${id} not found`, 404);
    }

    res.send({
      status: 'ok',
      data: {
        id: id,
        title: title,
        content: content,
        lede: lede,
        theme: theme,
        created_at: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// getNewsById is a function that returns a single news item

export const getNewsById = async (req, res, next) => {
  const { id } = req.params;

  try {
    let result = await pool.query('SELECT * FROM news WHERE id = ?', [id]);

    result = result[0];

    if (!result.length) {
      generateError(`News with id ${id} not found`, 404);
    }

    res.send({
      status: 'ok',
      data: {
        news: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

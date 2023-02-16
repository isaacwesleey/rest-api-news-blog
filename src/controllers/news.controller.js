import { pool } from '../db.js';

// getNews is a function that returns all news items

export const getNews = async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'SELECT id, title, content, lede, theme, created_at FROM news ORDER BY created_at DESC LIMIT 10'
    );

    if (!result.length) {
      return res.status(404).json({
        message: 'No news found',
      });
    }

    res.json({ result });
  } catch (error) {
    next(error);
  }
};

// createNews is a function that creates a single news item

export const createNews = async (req, res, next) => {
  const { title, content, lede, theme } = req.body;
  try {
    if (!title || !content || !lede || !theme) {
      return res.status(400).json({
        message: 'Missing required fields (title, content, lede, and theme)',
      });
    }

    const { id } = req.auth;

    const [result] = await pool.query(
      'INSERT INTO news (title, content, lede, theme, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, content, lede, theme, id]
    );

    const newsId = result.insertId;

    res.status(201).json({
      message: 'News created successfully',
      news: {
        id: newsId,
        title: title,
        content: content,
        lede: lede,
        theme: theme,
        user_id: id,
        created_at: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// deleteNews is a function that deletes a single news item

export const deleteNews = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM news WHERE id = ?', [id]);

    if (!result.affectedRows) {
      return res.status(404).json({
        message: `News with id ${id} not found`,
      });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// updateNews is a function that updates a single news item

export const updateNews = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, lede, theme } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE news SET title = ?, content = ?, lede = ?, theme = ? WHERE id = ?',
      [title, content, lede, theme, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        message: `News with id ${id} not found`,
      });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// getNewsById is a function that returns a single news item

export const getNewsById = async (req, res, next) => {
  const { id } = req.params;

  try {
    let result = await pool.query(
      'SELECT id, title, content, lede, theme, created_at FROM news WHERE id = ?',
      [id]
    );
    result = result[0];

    if (!result) {
      return res.status(404).json({
        message: `News with id ${id} not found`,
      });
    }

    res.json({ result });
  } catch (error) {
    next(error);
  }
};

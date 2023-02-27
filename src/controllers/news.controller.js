import { pool } from '../db.js';
import { generateError } from '../helpers.js';
import { savePhoto } from '../helpers.js';
import { deletePhoto } from '../helpers.js';
// getNews is a function that returns all news items

export const getNews = async (req, res, next) => {
  try {
    let keyword = '';
    if (req.query.keyword) {
      keyword = req.query.keyword;
    }
    const [result] = await pool.query(
      `SELECT * FROM news 
      WHERE content LIKE ? 
      ORDER BY created_at 
      DESC LIMIT 10`,
      [`${keyword}%`]
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
  try {
    const { id } = req.params;

    const [result] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);

    if (!result.length) {
      generateError(`News with id ${id} not found`, 404);
    }

    // Si la noticia tiene una imagen vinculada la borramos de la carpeta "uploads".
    if (result[0].image) {
      await deletePhoto(result[0].image);
    }

    const [deleteResult] = await pool.query('DELETE FROM news WHERE id = ?', [
      id,
    ]);

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

    const { title, content, lede, theme, image } = req.body;

    const [news] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (!news.length) {
      generateError(`News with id ${id} not found`, 404);
    }

    const oldTitle = news[0].title;
    const oldContent = news[0].content;
    const oldLede = news[0].lede;
    const oldTheme = news[0].theme;
    const oldImage = news[0].image;

    const newTitle = title === undefined || title === '' ? oldTitle : title;
    const newContent =
      content === undefined || content === '' ? oldContent : content;
    const newLede = lede === undefined || lede === '' ? oldLede : lede;
    const newTheme = theme === undefined || theme === '' ? oldTheme : theme;
    const newImage = image === undefined || image === '' ? oldImage : image;

    const [result] = await pool.query(
      'UPDATE news SET title = ?, content = ?, lede = ?, theme = ?, image = ? WHERE id = ?',
      [newTitle, newContent, newLede, newTheme, newImage, id]
    );

    if (!result.affectedRows) {
      generateError(`News with id ${id} not found`, 404);
    }

    res.send({
      status: 'ok',
      data: {
        id: id,
        title: newTitle,
        content: newContent,
        lede: newLede,
        theme: newTheme,
        image: newImage,
        created_at: news[0].created_at,
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

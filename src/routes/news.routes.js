import { Router } from 'express';
import {
  getNews,
  createNews,
  deleteNews,
  updateNews,
  getNewsById,
} from '../controllers/news.controller.js';

import { authentication } from '../middlewares/authentication.js';
import { checkNewsOwnership } from '../middlewares/authorization.js';

const router = Router();

router.get('/news', getNews); // ✅

router.get('/news/:id', getNewsById); // ✅

router.post('/news', authentication, createNews); // ✅

router.patch('/news/:id', authentication, checkNewsOwnership, updateNews); // ✅

router.delete('/news/:id', authentication, checkNewsOwnership, deleteNews); // ✅

export default router;

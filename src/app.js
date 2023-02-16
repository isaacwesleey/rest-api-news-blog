import express from 'express';
import cors from 'cors';
import newsRoutes from './routes/news.routes.js';
import userRoutes from './routes/user.routes.js';
import indexRoutes from './routes/index.routes.js';

const app = express();
app.use(cors());

app.use(express.json());

app.use(indexRoutes);
app.use('/api', newsRoutes);
app.use('/api', userRoutes);

app.use('*', (req, res, next) => {
  return res.status(404).json({
    message: 'The requested resource could not be found',
  });
});

// Manage specific errors with their own middlewares
app.use((error, req, res, next) => {
  return res.status(500).json({
    message: 'Something went wrong on the server',
    error: error.message,
  });
});

export default app;

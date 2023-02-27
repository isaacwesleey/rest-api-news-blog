import express from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import cors from 'cors';
import newsRoutes from './routes/news.routes.js';
import userRoutes from './routes/user.routes.js';
import indexRoutes from './routes/index.routes.js';

const app = express();

app.use(express.static('src/' + process.env.UPLOADS_DIR));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());

app.use(indexRoutes);
app.use('/api', newsRoutes);
app.use('/api', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.StatusCode || 500).send({
    status: 'error',
    message: err.message,
  });
});

app.use('*', (req, res) => {
  console.log(process.env.UPLOADS_DIR);
  res.status(404).send({
    status: 'error',
    message:
      'The requested resource could not be found: ' + process.env.UPLOADS_DIR,
  });
});

export default app;

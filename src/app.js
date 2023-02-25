import express from 'express';
import fileUpload from 'express-fileupload';
import Morgan from 'morgan';
import cors from 'cors';
import newsRoutes from './routes/news.routes.js';
import userRoutes from './routes/user.routes.js';
import indexRoutes from './routes/index.routes.js';

// Creamos la aplicación
const app = express();

// Middleware que permite hacer peticiones desde cualquier origen
app.use(cors());

// Middleware que muestra por consola las peticiones que se hacen al servidor
app.use(Morgan('dev'));

// Middleware que parsea el body de las peticiones a JSON
app.use(express.json());

// Middleware que parsea el body de las peticiones a URL encoded
app.use(fileUpload());

app.use(indexRoutes);
app.use('/api', newsRoutes);
app.use('/api', userRoutes);

// Manage 404 errors
app.use('*', (req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'The requested resource could not be found',
  });
});

// Manage specific errors with their own middlewares
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.StatusCode || 500).send({
    status: 'error',
    message: err.message,
  });
});

export default app;

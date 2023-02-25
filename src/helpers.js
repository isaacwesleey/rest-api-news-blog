import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const savePhoto = async (img) => {
  // Creamos un nombre único para el fichero
  // const uploadsPath = path.join(__dirname, process.env.UPLOADS_DIR);
  const uploadsPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    process.env.UPLOADS_DIR
  );

  try {
    // Comprobamos si existe el directorio de subidas
    await fs.access(uploadsPath);
  } catch (error) {
    // Si no existe, lo creamos
    await fs.mkdir(uploadsPath);
  }

  // Procesamos la imagen con sharp
  const sharpImg = sharp(img.data);

  // Redimensionamos la imagen
  sharpImg.resize(500);

  // Generamos un nombre único para la imagen
  const imgName = `${uuidv4()}.jpg`;

  // Generamos la ruta absoluta a la imagen
  const imgPath = path.join(uploadsPath, imgName);

  // Guardamos la imagen en el directorio de subidas
  await sharpImg.toFile(imgPath);

  // Devolvemos el nombre de la imagen
  return imgName;
};

// This file contains helper functions that are used in the application
// to generate errors and to validate the request body

export const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  throw error;
};

// GenerateError es una función que genera un error con un mensaje y un estado

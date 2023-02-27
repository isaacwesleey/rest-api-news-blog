import { promises as fs } from 'fs';
import path, { dirname } from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export const savePhoto = async (img) => {
  const uploadsPath = path.join(
    dirname(new URL(import.meta.url).pathname),
    process.env.UPLOADS_DIR
  );

  try {
    await fs.access(uploadsPath);
  } catch (error) {
    await fs.mkdir(uploadsPath);
  }

  const sharpImg = sharp(img.data);

  sharpImg.resize(500);

  const imgName = `${uuidv4()}.jpg`;

  const imgPath = path.join(uploadsPath, imgName);

  await sharpImg.toFile(imgPath);

  return imgName;
};

export const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  throw error;
};

export const deletePhoto = async (photoName) => {
  const uploadsPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    process.env.UPLOADS_DIR
  );

  const photoPath = path.join(uploadsPath, photoName);

  try {
    await fs.access(photoPath);
  } catch (error) {
    return;
  }

  await fs.unlink(photoPath);
};

import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 3004;
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'demo';
export const DB_PASSWORD = process.env.DB_PASSWORD || '123456';
export const DB_DATABASE = process.env.DB_DATABASE || 'news';
export const DB_PORT = process.env.DB_PORT || 3306;
export const UPLOADS_DIR = process.env.UPLOADS_DIR || 'src/uploads';

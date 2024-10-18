// src/types/express/index.d.ts

import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File; // Definimos la propiedad 'file'
    }
  }
}

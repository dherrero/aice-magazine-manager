import cors from 'cors';
import express from 'express';
import multer from 'multer';
import PdfController from './controllers/pdfController';
import { UPLOAD_DIR } from './globals';

class Main {
  #app: express.Application;
  #upload: multer.Multer;

  constructor() {
    this.#app = express();
    this.#upload = multer();
  }

  start() {
    this.#app.use(cors());
    this.#app.use(express.json());

    this.#app.use(
      process.env.NODE_UPLOAD_FILES
        ? `/${process.env.NODE_UPLOAD_FILES}`
        : '/uploads',
      express.static(UPLOAD_DIR)
    );
    try {
      this.#app.post(
        '/api/upload',
        this.#upload.single('file'),
        PdfController.uploadPdf
      );
      this.#app.get('/api/search', PdfController.searchPdf);
      this.#app.get('/health', (_, res) => {
        res.status(200).send('OK');
      });
    } catch (error) {
      console.error(error);
    }
    const PORT = process.env.NODE_PORT
      ? Number(process.env.NODE_PORT)
      : Number('3333');
    this.#app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}
try {
  const app = express();
  const upload = multer();

  app.use(cors());
  app.use(express.json());

  app.use(
    process.env.NODE_UPLOAD_FILES
      ? `/${process.env.NODE_UPLOAD_FILES}`
      : '/uploads',
    express.static(UPLOAD_DIR)
  );

  app.post('/api/upload', upload.single('file'), PdfController.uploadPdf);
  app.get('/api/search', PdfController.searchPdf);
  app.get('/health', (_, res) => {
    res.status(200).send('OK');
  });

  const PORT = process.env.NODE_PORT
    ? Number(process.env.NODE_PORT)
    : Number('3333');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error(error);
}

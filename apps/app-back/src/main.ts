import cors from 'cors';
import express from 'express';
import multer from 'multer';
import PdfController from './controllers/pdfController';
import { UPLOAD_DIR } from './globals';

class Main {
  #app: express.Application;
  #upload: multer.Multer;
  #port: number;

  constructor(port: number) {
    this.#app = express();
    this.#upload = multer();
    this.#port = port;
  }

  start() {
    this.#config();
    this.#setRoutes();

    this.#app.listen(this.#port, () => {
      console.log(`Server is running on port ${this.#port}`);
    });
  }

  #config() {
    this.#app.use(cors());
    this.#app.use(express.json());

    this.#app.use(
      process.env.NODE_UPLOAD_FILES
        ? `/${process.env.NODE_UPLOAD_FILES}`
        : '/uploads',
      express.static(UPLOAD_DIR)
    );
  }
  #setRoutes() {
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
  }
}
const PORT = process.env.NODE_PORT
  ? Number(process.env.NODE_PORT)
  : Number('3333');
const main = new Main(PORT);
main.start();

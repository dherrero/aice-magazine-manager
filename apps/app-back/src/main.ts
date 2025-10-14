import cors from 'cors';
import express from 'express';
import multer from 'multer';

import { testConnection } from './adapters/db/pg.connector';
import { UPLOAD_DIR } from './globals';
import api from './routes';

class Main {
  #app: express.Application;
  #upload: multer.Multer;
  #port: number;

  constructor(port: number) {
    this.#app = express();
    this.#upload = multer();
    this.#port = port;
  }

  async start() {
    // Probar conexión a la base de datos antes de iniciar el servidor
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    this.#config();
    this.#setRoutes();

    this.#app.listen(this.#port, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${this.#port}`);
    });
  }

  #config() {
    // Detrás de Traefik
    this.#app.set('trust proxy', 1);

    // Configure CORS for subdomain deployment
    const corsOptions = {
      origin: ['https://aice.dani-herrero.es', 'http://localhost:4200'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Refresh-Token'],
    };

    this.#app.use(cors(corsOptions));
    this.#app.use(express.json());

    // static files, pdf and front page images
    this.#app.use(
      process.env.NODE_UPLOAD_FILES
        ? `/${process.env.NODE_UPLOAD_FILES}`
        : '/uploads',
      express.static(UPLOAD_DIR)
    );

    // expose authorization headers
    this.#app.use((_, res, next) => {
      res.setHeader(
        'Access-Control-Expose-Headers',
        'Authorization, Refresh-Token'
      );
      next();
    });
  }
  #setRoutes() {
    try {
      this.#app.use('/api', api);
    } catch (error) {
      console.error(error);
    }
  }
}
const PORT = process.env.NODE_PORT
  ? Number(process.env.NODE_PORT)
  : Number('3200');
const main = new Main(PORT);
main.start().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

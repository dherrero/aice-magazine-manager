import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { searchPdf, uploadPdf } from './controllers/pdfController';

try {
  const app = express();
  const upload = multer();

  app.use(cors());
  app.use(express.json());

  app.post('/api/upload', upload.single('file'), uploadPdf);
  app.get('/api/search', searchPdf);
  app.get('/health', (_, res) => {
    res.status(200).send('OK');
  });

  const PORT = process.env.NODE_PORT || 3300;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error(error);
}

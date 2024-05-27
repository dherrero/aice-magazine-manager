import express from 'express';
import multer from 'multer';
import { searchPdf, uploadPdf } from './controllers/pdfController';

const app = express();
const upload = multer();

app.use(express.json());

app.post('/api/upload', upload.single('file'), uploadPdf);
app.get('/api/search', searchPdf);

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

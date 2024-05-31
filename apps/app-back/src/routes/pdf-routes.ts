import { Router } from 'express';
import multer from 'multer';
import { PdfController } from '../controllers';

const pdfRouter = Router();

pdfRouter.post('/upload', multer().single('file'), PdfController.uploadPdf);
pdfRouter.get('/search', PdfController.searchPdf);

export default pdfRouter;

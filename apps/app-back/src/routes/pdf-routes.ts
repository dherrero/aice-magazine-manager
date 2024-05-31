import { Router } from 'express';
import multer from 'multer';
import { PdfController, authController } from '../controllers';

const pdfRouter = Router();

pdfRouter.post(
  '/upload',
  authController.hasPermission('ADMIN'),
  multer().single('file'),
  PdfController.uploadPdf
);
pdfRouter.get(
  '/search',
  authController.hasPermission(),
  PdfController.searchPdf
);

export default pdfRouter;

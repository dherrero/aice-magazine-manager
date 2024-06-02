import { PdfController, authController } from '@back/controllers';
import { Router } from 'express';
import multer from 'multer';

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

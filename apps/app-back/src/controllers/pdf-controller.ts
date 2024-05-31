import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '../globals';
import { PdfService } from '../services';

// Controller for PDF upload and search
export default class PdfController {
  static async uploadPdf(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { publicationNumber, publhishedAt } = req.body;
      if (!publicationNumber || !publhishedAt) {
        return res
          .status(400)
          .json({ message: 'Miss data for Magazine model' });
      }

      const fileBuffer = req.file.buffer;
      const pdfData = await PdfService.parsePdf(fileBuffer);

      const fileName = req.file.originalname.replace(/ /g, '_');
      const filePath = path.join(UPLOAD_DIR, fileName);
      const relativePath = process.env.NODE_UPLOAD_FILES
        ? `/${process.env.NODE_UPLOAD_FILES}/${fileName}`
        : `/uploads/${fileName}`;

      let fileFrontPage;
      try {
        fileFrontPage =
          process.env.NODE_PRODUCTION === 'true'
            ? await PdfService.extractFrontPage(
                fileBuffer,
                path.join(UPLOAD_DIR),
                `portada${fileName.replace('.pdf', '')}`
              )
            : { path: undefined };
      } catch (error) {
        console.error(error);
        fileFrontPage = { path: undefined };
      }

      await PdfService.savePdfContent(
        pdfData,
        publicationNumber,
        publhishedAt,
        relativePath,
        fileFrontPage.path
          ? PdfService.urlImageUploaded(fileFrontPage.path)
          : undefined
      );

      fs.writeFileSync(filePath, fileBuffer);

      res.status(200).json({ message: 'PDF uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading PDF', error });
    }
  }

  static async searchPdf(req: Request, res: Response) {
    try {
      const { query, type, number } = req.query;
      const results = await PdfService.searchInIndexedContent(
        query as string,
        type as string,
        number as string
      );
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: 'Error searching PDFs', error });
    }
  }
}

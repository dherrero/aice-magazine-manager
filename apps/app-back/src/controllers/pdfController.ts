import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '../globals';
import {
  extractFrontPage,
  parsePdf,
  savePdfContent,
  searchInIndexedContent,
} from '../services/pdfService';

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { publicationNumber, publhishedAt } = req.body;
    if (!publicationNumber || !publhishedAt) {
      return res.status(400).json({ message: 'Miss data for Magazine model' });
    }

    const fileBuffer = req.file.buffer;
    const pdfData = await parsePdf(fileBuffer);

    const fileName = req.file.originalname.replace(/ /g, '_');
    const filePath = path.join(UPLOAD_DIR, fileName);
    const relativePath = process.env.NODE_UPLOAD_FILES
      ? `/${process.env.NODE_UPLOAD_FILES}/${fileName}`
      : `/uploads/${fileName}`;
    const fileFrontPage =
      process.env.NODE_PRODUCTION === 'true'
        ? await extractFrontPage(fileBuffer)
        : { buffer: Buffer.from('') };

    await savePdfContent(
      pdfData,
      publicationNumber,
      publhishedAt,
      fileFrontPage.buffer,
      relativePath
    );

    fs.writeFileSync(filePath, fileBuffer);

    res.status(200).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading PDF', error });
  }
};

export const searchPdf = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const results = await searchInIndexedContent(query as string);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching PDFs', error });
  }
};

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import {
  parsePdf,
  savePdfContent,
  searchInIndexedContent,
} from '../services/pdfService';

const UPLOAD_DIR = process.env.NODE_UPLOAD_FILES
  ? path.join(process.env.NODE_UPLOAD_FILES)
  : path.join(process.cwd(), '/tmp');

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { publicationNumber } = req.body;
    if (!publicationNumber) {
      return res
        .status(400)
        .json({ message: 'Publication number is required' });
    }

    const fileBuffer = req.file.buffer;
    const pdfData = await parsePdf(fileBuffer);

    const fileName = req.file.originalname;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await savePdfContent(pdfData, publicationNumber, filePath);

    fs.writeFileSync(filePath, fileBuffer);

    res.status(200).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
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

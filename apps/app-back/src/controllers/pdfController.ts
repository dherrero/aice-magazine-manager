import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  indexPdfContent,
  parsePdf,
  searchInIndexedContent,
} from '../services/pdfService';

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const pdfId = uuidv4();
    const fileBuffer = req.file.buffer;
    const pdfData = await parsePdf(fileBuffer);
    await indexPdfContent(pdfData, pdfId);
    res
      .status(200)
      .json({ message: 'PDF uploaded and indexed successfully', pdfId });
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

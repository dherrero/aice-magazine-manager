import { Blob } from 'buffer';
import pdf from 'pdf-parse';
import { fromBuffer } from 'pdf2pic';
import { BufferResponse } from 'pdf2pic/dist/types/convertResponse';
import { Op } from 'sequelize';
import { Magazine, Page } from '../models';
interface PdfContent {
  textByPage: { pageNumber: number; text: string }[];
  metadata: string;
}

export const parsePdf = async (fileBuffer: Buffer): Promise<PdfContent> => {
  const data = await pdf(fileBuffer);
  const pages = data.text.split('\n\n');

  const textByPage = pages.map((text, index) => ({
    pageNumber: index + 1,
    text,
  }));

  return {
    textByPage,
    metadata: data.info.Title || 'Unknown Title',
  };
};

export const extractFrontPage = async (
  fileBuffer: Buffer
): Promise<BufferResponse> => {
  const options = {
    density: 100,
    quality: 100,
    format: 'png',
    width: 800,
    height: 600,
    responseType: 'buffer',
  };

  const storeAsImage = fromBuffer(fileBuffer, options);
  return await storeAsImage(1);
};

export const savePdfContent = async (
  pdfData: PdfContent,
  publicationNumber: string,
  publhishedAt: Date,
  fileFrontPage: Buffer | undefined,
  fileName: string
) => {
  const newMagazine = await Magazine.create({
    number: Number(publicationNumber),
    publhishedAt: publhishedAt,
    image: fileFrontPage
      ? new Blob([fileFrontPage], { type: 'image/png' })
      : null,
    path: fileName,
  });
  const pages = pdfData.textByPage.flatMap((page) => [
    {
      number: page.pageNumber,
      publicationNumber: publicationNumber,
      title: pdfData.metadata,
      content: page.text,
      magazineId: newMagazine.id,
    },
  ]);
  try {
    await Page.bulkCreate(pages);
  } catch (e) {
    await Magazine.destroy({ where: { id: newMagazine.id } });
    throw e;
  }
  return newMagazine;
};

export const searchInIndexedContent = async (query: string) => {
  const results = await Page.findAll({
    include: Magazine,
    where: {
      [Op.and]: {
        content: {
          [Op.iLike]: `%${query}%`,
        },
        deleted: false,
        /*     title: {
          [Op.iLike]: `%${query}%`,
        },
       */
      },
    },
  });

  return results;
};

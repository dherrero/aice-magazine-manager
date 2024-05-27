import pdf from 'pdf-parse';
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

export const savePdfContent = async (
  pdfData: PdfContent,
  publicationNumber: string,
  fileName: string
) => {
  const newMagazine = await Magazine.create({
    number: Number(publicationNumber),
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

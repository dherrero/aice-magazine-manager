import { APP_DIR } from '@back/globals';
import { Magazine, Page } from '@back/models';
import { FilterhMagazineType } from '@dto';
import pdf from 'pdf-parse';
import { fromBuffer } from 'pdf2pic';
import { WriteImageResponse } from 'pdf2pic/dist/types/convertResponse';
import { Includeable, Op } from 'sequelize';
interface PdfContent {
  textByPage: { pageNumber: number; text: string }[];
  metadata: string;
}

export default class PdfService {
  static async parsePdf(fileBuffer: Buffer): Promise<PdfContent> {
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
  }

  static urlImageUploaded(path: string) {
    return path.replace(APP_DIR, '');
  }

  static async extractFrontPage(
    fileBuffer: Buffer,
    savePath: string,
    saveFilename: string
  ): Promise<WriteImageResponse> {
    const options = {
      density: 100,
      quality: 100,
      format: 'png',
      width: 800,
      height: 600,
      savePath,
      saveFilename,
      responseType: 'image',
    };

    const storeAsImage = fromBuffer(fileBuffer, options);
    return await storeAsImage(1);
  }

  static async savePdfContent(
    pdfData: PdfContent,
    publicationNumber: string,
    publhishedAt: Date,
    fileName: string,
    fileFrontPage?: string
  ) {
    const newMagazine = await Magazine.create({
      number: Number(publicationNumber),
      publhishedAt: publhishedAt,
      image: fileFrontPage ?? null,
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
  }

  static async searchInIndexedContent(
    query: string,
    type?: string,
    number?: string
  ) {
    const include = this.#getIncludeValue(type, number);
    const results = await Page.findAll({
      include,
      where: {
        [Op.and]: {
          content: {
            [Op.iLike]: `%${query}%`,
          },
          deleted: false,
        },
      },
    });

    return results;
  }

  static #getIncludeValue(type?: string, number?: string): Includeable {
    if (!type || !number) {
      return Magazine;
    }
    const filterByNumber = {};
    let opType;
    switch (+type) {
      case FilterhMagazineType.EQUAL:
        opType = Op.eq;
        break;
      case FilterhMagazineType.GREATERTHAN:
        opType = Op.gt;
        break;
      case FilterhMagazineType.GREATERTHANEQUAL:
        opType = Op.gte;
        break;
      case FilterhMagazineType.LESSTHAN:
        opType = Op.lt;
        break;
      case FilterhMagazineType.LESSTHANEQUAL:
        opType = Op.lte;
        break;
    }
    filterByNumber['number'] = {};
    filterByNumber['number'][opType] = number;
    return { model: Magazine, where: filterByNumber };
  }
}

import { Client } from '@elastic/elasticsearch';
import pdf from 'pdf-parse';

const client = new Client({ node: 'http://elasticsearch:9200' });

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

export const indexPdfContent = async (pdfData: PdfContent, pdfId: string) => {
  const body = pdfData.textByPage.flatMap((page) => [
    {
      index: {
        _index: 'magazines',
        _id: `${pdfId}-page-${page.pageNumber}`,
      },
    },
    {
      pdfId: pdfId,
      title: pdfData.metadata,
      content: page.text,
      pageNumber: page.pageNumber,
    },
  ]);

  await client.bulk({ refresh: true, body });
};

export const searchInIndexedContent = async (query: string) => {
  const result = await client.search({
    index: 'magazines',
    body: {
      query: {
        multi_match: {
          query,
          fields: ['title', 'content'],
        },
      },
    },
  });

  return result.hits.hits.map((hit: any) => ({
    ref: hit._id,
    ...hit._source,
  }));
};

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var pdf_service_exports = {};
__export(pdf_service_exports, {
  default: () => PdfService
});
module.exports = __toCommonJS(pdf_service_exports);
var import_globals = require("@back/globals");
var import_models = require("@back/models");
var import_dto = require("@dto");
var import_pdf_parse = __toESM(require("pdf-parse"));
var import_pdf2pic = require("pdf2pic");
var import_sequelize = require("sequelize");
class PdfService {
  static async parsePdf(fileBuffer) {
    const data = await (0, import_pdf_parse.default)(fileBuffer);
    const pages = data.text.split("\n\n");
    const textByPage = pages.map((text, index) => ({
      pageNumber: index + 1,
      text
    }));
    return {
      textByPage,
      metadata: data.info.Title || "Unknown Title"
    };
  }
  static urlImageUploaded(path) {
    return path.replace(import_globals.APP_DIR, "");
  }
  static async extractFrontPage(fileBuffer, savePath, saveFilename) {
    const options = {
      density: 100,
      quality: 100,
      format: "png",
      width: 800,
      height: 600,
      savePath,
      saveFilename,
      responseType: "image"
    };
    const storeAsImage = (0, import_pdf2pic.fromBuffer)(fileBuffer, options);
    return await storeAsImage(1);
  }
  static async savePdfContent(pdfData, publicationNumber, publhishedAt, fileName, fileFrontPage) {
    const newMagazine = await import_models.Magazine.create({
      number: Number(publicationNumber),
      publhishedAt,
      image: fileFrontPage ?? null,
      path: fileName
    });
    const pages = pdfData.textByPage.flatMap((page) => [
      {
        number: page.pageNumber,
        publicationNumber,
        title: pdfData.metadata,
        content: page.text,
        magazineId: newMagazine.id
      }
    ]);
    try {
      await import_models.Page.bulkCreate(pages);
    } catch (e) {
      await import_models.Magazine.destroy({ where: { id: newMagazine.id } });
      throw e;
    }
    return newMagazine;
  }
  static async searchInIndexedContent(query, type, number) {
    const include = this.#getIncludeValue(type, number);
    const results = await import_models.Page.findAll({
      include,
      where: {
        [import_sequelize.Op.and]: {
          content: {
            [import_sequelize.Op.iLike]: `%${query}%`
          },
          deleted: false
        }
      }
    });
    return results;
  }
  static #getIncludeValue(type, number) {
    if (!type || !number) {
      return import_models.Magazine;
    }
    const filterByNumber = {};
    let opType;
    switch (+type) {
      case import_dto.FilterhMagazineType.EQUAL:
        opType = import_sequelize.Op.eq;
        break;
      case import_dto.FilterhMagazineType.GREATERTHAN:
        opType = import_sequelize.Op.gt;
        break;
      case import_dto.FilterhMagazineType.GREATERTHANEQUAL:
        opType = import_sequelize.Op.gte;
        break;
      case import_dto.FilterhMagazineType.LESSTHAN:
        opType = import_sequelize.Op.lt;
        break;
      case import_dto.FilterhMagazineType.LESSTHANEQUAL:
        opType = import_sequelize.Op.lte;
        break;
    }
    filterByNumber["number"] = {};
    filterByNumber["number"][opType] = number;
    return { model: import_models.Magazine, where: filterByNumber };
  }
}
//# sourceMappingURL=pdf.service.js.map

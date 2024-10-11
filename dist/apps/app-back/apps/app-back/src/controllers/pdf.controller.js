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
var pdf_controller_exports = {};
__export(pdf_controller_exports, {
  default: () => PdfController
});
module.exports = __toCommonJS(pdf_controller_exports);
var import_globals = require("@back/globals");
var import_services = require("@back/services");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
class PdfController {
  static async uploadPdf(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const { publicationNumber, publhishedAt } = req.body;
      if (!publicationNumber || !publhishedAt) {
        return res.status(400).json({ message: "Miss data for Magazine model" });
      }
      const fileBuffer = req.file.buffer;
      const pdfData = await import_services.PdfService.parsePdf(fileBuffer);
      const fileName = req.file.originalname.replace(/ /g, "_");
      const filePath = import_path.default.join(import_globals.UPLOAD_DIR, fileName);
      const relativePath = process.env.NODE_UPLOAD_FILES ? `/${process.env.NODE_UPLOAD_FILES}/${fileName}` : `/uploads/${fileName}`;
      let fileFrontPage;
      try {
        fileFrontPage = process.env.NODE_PRODUCTION === "true" ? await import_services.PdfService.extractFrontPage(
          fileBuffer,
          import_path.default.join(import_globals.UPLOAD_DIR),
          `portada${fileName.replace(".pdf", "")}`
        ) : { path: void 0 };
      } catch (error) {
        console.error(error);
        fileFrontPage = { path: void 0 };
      }
      await import_services.PdfService.savePdfContent(
        pdfData,
        publicationNumber,
        publhishedAt,
        relativePath,
        fileFrontPage.path ? import_services.PdfService.urlImageUploaded(fileFrontPage.path) : void 0
      );
      import_fs.default.writeFileSync(filePath, fileBuffer);
      res.status(200).json({ message: "PDF uploaded successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error uploading PDF", error });
    }
  }
  static async searchPdf(req, res) {
    try {
      const { query, type, number } = req.query;
      const results = await import_services.PdfService.searchInIndexedContent(
        query,
        type,
        number
      );
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: "Error searching PDFs", error });
    }
  }
}
//# sourceMappingURL=pdf.controller.js.map

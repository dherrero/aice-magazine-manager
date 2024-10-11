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
var pdf_routes_exports = {};
__export(pdf_routes_exports, {
  default: () => pdf_routes_default
});
module.exports = __toCommonJS(pdf_routes_exports);
var import_controllers = require("@back/controllers");
var import_express = require("express");
var import_multer = __toESM(require("multer"));
const pdfRouter = (0, import_express.Router)();
pdfRouter.post(
  "/upload",
  import_controllers.authController.hasPermission("ADMIN"),
  (0, import_multer.default)().single("file"),
  import_controllers.PdfController.uploadPdf
);
pdfRouter.get(
  "/search",
  import_controllers.authController.hasPermission(),
  import_controllers.PdfController.searchPdf
);
var pdf_routes_default = pdfRouter;
//# sourceMappingURL=pdf.routes.js.map

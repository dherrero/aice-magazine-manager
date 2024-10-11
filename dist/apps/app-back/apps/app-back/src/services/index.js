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
var services_exports = {};
__export(services_exports, {
  PdfService: () => import_pdf.default,
  authService: () => import_auth.default,
  magazineCrudService: () => import_magazine_crud.default,
  pageCrudService: () => import_page_crud.default,
  userCrudService: () => import_user_crud.default
});
module.exports = __toCommonJS(services_exports);
var import_auth = __toESM(require("./auth.service"));
var import_magazine_crud = __toESM(require("./magazine-crud.service"));
var import_page_crud = __toESM(require("./page-crud.service"));
var import_pdf = __toESM(require("./pdf.service"));
var import_user_crud = __toESM(require("./user-crud.service"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PdfService,
  authService,
  magazineCrudService,
  pageCrudService,
  userCrudService
});
//# sourceMappingURL=index.js.map

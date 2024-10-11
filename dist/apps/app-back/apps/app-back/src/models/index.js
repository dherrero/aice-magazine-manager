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
var models_exports = {};
__export(models_exports, {
  Magazine: () => import_magazine.default,
  MagazineModel: () => import_magazine.MagazineModel,
  Page: () => import_page.default,
  PageModel: () => import_page.PageModel,
  User: () => import_user.default,
  UserModel: () => import_user.UserModel
});
module.exports = __toCommonJS(models_exports);
var import_magazine = __toESM(require("./magazine.model"));
var import_page = __toESM(require("./page.model"));
var import_user = __toESM(require("./user.model"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Magazine,
  MagazineModel,
  Page,
  PageModel,
  User,
  UserModel
});
//# sourceMappingURL=index.js.map

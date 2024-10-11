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
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");
var import_auth = __toESM(require("./auth.routes"));
var import_health = __toESM(require("./health.routes"));
var import_magazine_crud = __toESM(require("./magazine-crud.routes"));
var import_page_crud = __toESM(require("./page-crud.routes"));
var import_pdf = __toESM(require("./pdf.routes"));
var import_user_crud = __toESM(require("./user-crud.routes"));
const api = (0, import_express.Router)();
api.use("/v1/auth", import_auth.default);
api.use("/v1/user", import_user_crud.default);
api.use("/v1/magazine", import_magazine_crud.default);
api.use("/v1/page", import_page_crud.default);
api.use("/v1/pdf", import_pdf.default);
api.use("/v1/health", import_health.default);
var routes_default = api;
//# sourceMappingURL=index.js.map

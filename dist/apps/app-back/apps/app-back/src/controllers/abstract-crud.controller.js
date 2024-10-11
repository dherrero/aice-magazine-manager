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
var abstract_crud_controller_exports = {};
__export(abstract_crud_controller_exports, {
  AbstractCrudController: () => AbstractCrudController
});
module.exports = __toCommonJS(abstract_crud_controller_exports);
var import_http = __toESM(require("@back/adapters/http/http.responser"));
class AbstractCrudController {
  constructor(service) {
    this.getAllPaged = async (req, res) => {
      try {
        const { page, limit } = req.query;
        const data = await this.service.getAllPaged(page, limit);
        return import_http.default.successJson(res, data);
      } catch (error) {
        return import_http.default.errorJson(res, error);
      }
    };
    this.getAll = async (_, res) => {
      try {
        const data = await this.service.getAll();
        return import_http.default.successJson(res, data);
      } catch (error) {
        return import_http.default.errorJson(res, error);
      }
    };
    this.getById = async (req, res) => {
      try {
        const data = await this.service.getById({
          id: req.params.id,
          deleted: false
        });
        return import_http.default.successJson(res, data);
      } catch (error) {
        return import_http.default.errorJson(res, error);
      }
    };
    this.post = async (req, res) => {
      try {
        const data = await this.service.post(req.body);
        return import_http.default.successJson(res, data, 201);
      } catch (error) {
        return import_http.default.errorJson(res, error);
      }
    };
    this.put = async (req, res) => {
      try {
        await this.service.put(req.params.id, req.body);
        const updated = await this.service.getById({ id: req.params.id });
        return import_http.default.successJson(res, updated);
      } catch (error) {
        console.log(error);
        return import_http.default.errorJson(res, error);
      }
    };
    this.delete = async (req, res) => {
      try {
        await this.service.delete(req.params.id);
        return import_http.default.successEmpty(res);
      } catch (error) {
        return import_http.default.errorJson(res, error);
      }
    };
    this.service = service;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AbstractCrudController
});
//# sourceMappingURL=abstract-crud.controller.js.map

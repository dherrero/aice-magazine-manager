var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var magazine_crud_service_exports = {};
__export(magazine_crud_service_exports, {
  default: () => magazine_crud_service_default
});
module.exports = __toCommonJS(magazine_crud_service_exports);
var import_models = require("@back/models");
var import_abstract_crud = require("./abstract-crud.service");
class MagazineCrudService extends import_abstract_crud.AbstractCrudService {
  constructor() {
    super(import_models.Magazine);
  }
}
const magazineCrudService = new MagazineCrudService();
var magazine_crud_service_default = magazineCrudService;
//# sourceMappingURL=magazine-crud.service.js.map

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
var abstract_crud_service_exports = {};
__export(abstract_crud_service_exports, {
  AbstractCrudService: () => AbstractCrudService
});
module.exports = __toCommonJS(abstract_crud_service_exports);
var import_sequelize = __toESM(require("sequelize"));
class AbstractCrudService {
  constructor(model) {
    this.getAllPaged = async (page, limit, where = { deleted: false }, excludeColumns) => {
      const offset = (page - 1) * limit;
      return await this.model.findAndCountAll({
        attributes: {
          exclude: excludeColumns ?? this.excludeColumns(where.deleted)
        },
        where,
        limit,
        offset
      });
    };
    this.getAll = async (where = { deleted: false }, excludeColumns) => await this.model.findAll({
      attributes: {
        exclude: excludeColumns ?? this.excludeColumns(where.deleted)
      },
      where
    });
    this.getById = async (where = { deleted: false }, excludeColumns) => await this.model.findOne({
      attributes: {
        exclude: excludeColumns ?? this.excludeColumns(where.deleted)
      },
      where
    });
    this.post = async (model) => await this.model.create(model);
    this.put = async (id, data) => await this.model.update({ ...data }, { where: { id } });
    this.delete = async (id) => await this.model.update(
      { deleted: true, deletedAt: import_sequelize.default.literal("CURRENT_TIMESTAMP") },
      { where: { id } }
    );
    this.model = model;
  }
  excludeColumns(showDeleted = false) {
    const excluded = ["password"];
    if (!showDeleted) {
      excluded.push("deleted", "deletedAt");
    }
    return excluded;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AbstractCrudService
});
//# sourceMappingURL=abstract-crud.service.js.map

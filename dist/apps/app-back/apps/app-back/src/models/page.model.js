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
var page_model_exports = {};
__export(page_model_exports, {
  default: () => page_model_default
});
module.exports = __toCommonJS(page_model_exports);
var import_pg = require("@back/adapters/db/pg.connector");
var import_sequelize = require("sequelize");
var import__ = require(".");
const Page = import_pg.db.define(
  "Page",
  {
    id: {
      type: import_sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    number: {
      type: import_sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: import_sequelize.DataTypes.TEXT,
      allowNull: false
    },
    magazineId: {
      type: import_sequelize.DataTypes.INTEGER,
      allowNull: false,
      field: "magazine_id"
    },
    deleted: {
      type: import_sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: import_sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: import_sequelize.DataTypes.NOW,
      field: "createdat"
    },
    updatedAt: {
      type: import_sequelize.DataTypes.DATE,
      allowNull: true,
      field: "updatedat"
    },
    deletedAt: {
      type: import_sequelize.DataTypes.DATE,
      allowNull: true,
      field: "deletedat"
    }
  },
  { tableName: "page" }
);
Page.belongsTo(import__.Magazine, { foreignKey: "magazineId" });
var page_model_default = Page;
//# sourceMappingURL=page.model.js.map

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
var magazine_model_exports = {};
__export(magazine_model_exports, {
  default: () => magazine_model_default
});
module.exports = __toCommonJS(magazine_model_exports);
var import_pg = require("@back/adapters/db/pg.connector");
var import_sequelize = require("sequelize");
const Magazine = import_pg.db.define(
  "Magazine",
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
    path: {
      type: import_sequelize.DataTypes.STRING(250),
      allowNull: false
    },
    publhishedAt: {
      type: import_sequelize.DataTypes.DATE,
      allowNull: false,
      field: "publhishedat"
    },
    image: {
      type: import_sequelize.DataTypes.STRING(250),
      allowNull: true,
      defaultValue: null
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
  { tableName: "magazine" }
);
var magazine_model_default = Magazine;
//# sourceMappingURL=magazine.model.js.map

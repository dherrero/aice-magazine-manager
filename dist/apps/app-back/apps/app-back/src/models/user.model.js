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
var user_model_exports = {};
__export(user_model_exports, {
  default: () => user_model_default
});
module.exports = __toCommonJS(user_model_exports);
var import_pg = require("@back/adapters/db/pg.connector");
var import_sequelize = require("sequelize");
const User = import_pg.db.define(
  "User",
  {
    id: {
      type: import_sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: import_sequelize.DataTypes.STRING(150),
      allowNull: false
    },
    name: {
      type: import_sequelize.DataTypes.STRING(150),
      allowNull: true
    },
    lastName: {
      type: import_sequelize.DataTypes.STRING(150),
      allowNull: true,
      field: "lastname"
    },
    permission: {
      type: import_sequelize.DataTypes.STRING(250),
      allowNull: true
    },
    password: {
      type: import_sequelize.DataTypes.STRING(250),
      allowNull: false
    },
    deleted: {
      type: import_sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: import_sequelize.DataTypes.DATE,
      allowNull: false,
      field: "createdat"
    },
    updatedAt: {
      type: import_sequelize.DataTypes.DATE,
      allowNull: false,
      field: "updatedat"
    },
    deletedAt: {
      type: import_sequelize.DataTypes.DATE,
      allowNull: true,
      field: "deletedat"
    }
  },
  { tableName: "user" }
);
var user_model_default = User;
//# sourceMappingURL=user.model.js.map

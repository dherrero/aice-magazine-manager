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
var pg_connector_exports = {};
__export(pg_connector_exports, {
  db: () => db
});
module.exports = __toCommonJS(pg_connector_exports);
var import_sequelize = require("sequelize");
const db = new import_sequelize.Sequelize({
  dialect: "postgres",
  host: process.env.NODE_POSTGRESDB_HOST ?? "localhost",
  port: process.env.NODE_POSTGRESDB_LOCAL_PORT ? Number(process.env.NODE_POSTGRESDB_LOCAL_PORT) : 5432,
  database: process.env.NODE_POSTGRESDB_DATABASE ?? "postgres",
  username: process.env.NODE_POSTGRESDB_USER ?? "postgres",
  password: process.env.NODE_POSTGRESDB_PASSWORD ?? "postgres",
  logging: process.env.NODE_PRODUCTION === "true" ? false : console.log
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  db
});
//# sourceMappingURL=pg.connector.js.map

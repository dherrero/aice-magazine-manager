var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_cors = __toESM(require("cors"));
var import_express = __toESM(require("express"));
var import_multer = __toESM(require("multer"));
var import_globals = require("./globals");
var import_routes = __toESM(require("./routes"));
class Main {
  #app;
  #upload;
  #port;
  constructor(port) {
    this.#app = (0, import_express.default)();
    this.#upload = (0, import_multer.default)();
    this.#port = port;
  }
  start() {
    this.#config();
    this.#setRoutes();
    this.#app.listen(this.#port, () => {
      console.log(`Server is running on port ${this.#port}`);
    });
  }
  #config() {
    this.#app.use((0, import_cors.default)());
    this.#app.use(import_express.default.json());
    this.#app.use(
      process.env.NODE_UPLOAD_FILES ? `/${process.env.NODE_UPLOAD_FILES}` : "/uploads",
      import_express.default.static(import_globals.UPLOAD_DIR)
    );
    this.#app.use((_, res, next) => {
      res.setHeader(
        "Access-Control-Expose-Headers",
        "Authorization, Refresh-Token"
      );
      next();
    });
  }
  #setRoutes() {
    try {
      this.#app.use("/api", import_routes.default);
    } catch (error) {
      console.error(error);
    }
  }
}
const PORT = process.env.NODE_PORT ? Number(process.env.NODE_PORT) : Number("3333");
const main = new Main(PORT);
main.start();
//# sourceMappingURL=main.js.map

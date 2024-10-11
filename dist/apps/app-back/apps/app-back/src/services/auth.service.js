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
var auth_service_exports = {};
__export(auth_service_exports, {
  default: () => auth_service_default
});
module.exports = __toCommonJS(auth_service_exports);
var import_models = require("@back/models");
var import_bcrypt = require("bcrypt");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
class AuthService {
  constructor() {
    this.#secret = process.env.NODE_JWT_SECRET;
    this.login = async (email, password) => {
      const user = await import_models.User.findOne({ where: { email } });
      if (!user)
        throw new Error("Email or password incorrect.");
      const validPassword = await this.#comparePassword(password, user.password);
      if (!validPassword)
        throw new Error("Email or password incorrect.");
      return user;
    };
    this.getUser = async (id) => await import_models.User.findByPk(id);
    this.generateToken = async (payload, expiresIn) => {
      return import_jsonwebtoken.default.sign(payload, this.#secret, { expiresIn });
    };
    this.verifyToken = (token) => {
      return import_jsonwebtoken.default.verify(token, this.#secret);
    };
    this.hashPassword = async (password) => {
      return await (0, import_bcrypt.hash)(password, process.env.NODE_HASH_SALT_ROUNDS ?? 10);
    };
    this.#comparePassword = async (password, hash2) => {
      return await (0, import_bcrypt.compare)(password, hash2);
    };
  }
  #secret;
  #comparePassword;
}
const authService = new AuthService();
var auth_service_default = authService;
//# sourceMappingURL=auth.service.js.map

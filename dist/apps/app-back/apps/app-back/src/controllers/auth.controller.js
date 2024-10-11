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
var auth_controller_exports = {};
__export(auth_controller_exports, {
  default: () => auth_controller_default
});
module.exports = __toCommonJS(auth_controller_exports);
var import_http = __toESM(require("@back/adapters/http/http.responser"));
var import_services = require("@back/services");
var import_jsonwebtoken = require("jsonwebtoken");
class AuthController {
  constructor() {
    this.login = async (req, res) => {
      try {
        const { email, password, remember } = req.body;
        const user = await import_services.authService.login(email, password);
        const userData = {
          id: user.id,
          email: user.email,
          permision: user.permission ? user.permission.split(/[\s,;]+/).filter(Boolean) : [],
          remember
        };
        return this.#responseWithTokens(res, userData);
      } catch (err) {
        console.log(err);
        return import_http.default.errorJson(res, err);
      }
    };
    this.hasPermission = (permision) => (req, res, next) => {
      if (req.method === "OPTIONS") {
        next();
      } else {
        const token = req.header("Authorization");
        const refreshToken = req.headers["refresh-token"];
        const randomCode = Math.floor(Math.random() * 1e3);
        if (!token || !refreshToken)
          return import_http.default.errorJson(
            res,
            { message: `Access denied code: ${randomCode}0` },
            401
          );
        try {
          const decode = import_services.authService.verifyToken(token);
          res.locals.user = { ...decode };
          if (permision && Array.isArray(permision)) {
            if (!decode.permision)
              return import_http.default.errorJson(
                res,
                { message: `Access denied code: ${randomCode}1` },
                401
              );
            const intersection = permision.filter(
              (x) => decode.permision.includes(x)
            );
            if (!intersection.length)
              return import_http.default.errorJson(
                res,
                { message: `Access denied code: ${randomCode}2` },
                401
              );
          } else if (permision) {
            if (!decode.permision)
              return import_http.default.errorJson(
                res,
                { message: `Access denied code: ${randomCode}3` },
                401
              );
            if (!decode.permision.includes(permision))
              return import_http.default.errorJson(
                res,
                { message: `Access denied code: ${randomCode}4` },
                401
              );
          }
          next();
        } catch (error) {
          if (error instanceof import_jsonwebtoken.TokenExpiredError) {
            return this.#refreshToken(req, res, next);
          } else {
            return import_http.default.errorJson(
              res,
              { message: "Invalid token" },
              401
            );
          }
        }
      }
    };
    this.#refreshToken = async (req, res, next) => {
      const refreshToken = req.headers["refresh-token"];
      if (!refreshToken) {
        return import_http.default.errorJson(
          res,
          { message: "Access Denied. No refresh token provided." },
          401
        );
      }
      try {
        const decode = import_services.authService.verifyToken(refreshToken);
        const user = await import_services.authService.getUser(decode.id);
        const userData = {
          id: user.id,
          email: user.email,
          remember: decode.remember,
          permision: user.permission ? user.permission.split(/[\s,;]+/).filter(Boolean) : []
        };
        res.locals.user = { ...userData };
        return this.#responseWithTokens(res, userData, next);
      } catch (error) {
        return import_http.default.errorJson(res, { message: "Invalid token" }, 401);
      }
    };
    this.#responseWithTokens = async (res, userData, next) => {
      const accessToken = await import_services.authService.generateToken(
        userData,
        process.env.NODE_JWT_ACCESS_EXPIRES_IN || "4h"
      );
      res.setHeader("Authorization", accessToken);
      if (!next) {
        const refreshToken = await import_services.authService.generateToken(
          { id: userData.id, remember: userData.remember },
          userData.remember ? "365d" : process.env.NODE_JWT_REFRESH_EXPIRES_IN || "8h"
        );
        res.setHeader("Refresh-Token", refreshToken);
        return import_http.default.successEmpty(res);
      }
      next();
    };
  }
  #refreshToken;
  #responseWithTokens;
}
const authController = new AuthController();
var auth_controller_default = authController;
//# sourceMappingURL=auth.controller.js.map

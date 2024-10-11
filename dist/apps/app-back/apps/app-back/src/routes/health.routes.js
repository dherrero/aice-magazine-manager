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
var health_routes_exports = {};
__export(health_routes_exports, {
  default: () => health_routes_default
});
module.exports = __toCommonJS(health_routes_exports);
var import_controllers = require("@back/controllers");
var import_express = require("express");
const healthRouter = (0, import_express.Router)();
healthRouter.get("", (_, res) => {
  res.status(200).json({ health: "\u{1F44C}" });
});
healthRouter.get("/secure", import_controllers.authController.hasPermission(), (_, res) => {
  res.status(200).json({ health: "\u{1F44C}", secure: "\u{1F510}" });
});
var health_routes_default = healthRouter;
//# sourceMappingURL=health.routes.js.map

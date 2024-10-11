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
var magazine_crud_routes_exports = {};
__export(magazine_crud_routes_exports, {
  default: () => magazine_crud_routes_default
});
module.exports = __toCommonJS(magazine_crud_routes_exports);
var import_controllers = require("@back/controllers");
var import_express = require("express");
const magazineCrudRouter = (0, import_express.Router)();
magazineCrudRouter.get(
  "/",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.magazineCrudController.getAll
);
magazineCrudRouter.get(
  "/paged",
  import_controllers.authController.hasPermission(""),
  import_controllers.magazineCrudController.getAllPaged
);
magazineCrudRouter.get(
  "/:id",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.magazineCrudController.getById
);
magazineCrudRouter.post(
  "/",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.magazineCrudController.post
);
magazineCrudRouter.put(
  "/:id",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.magazineCrudController.put
);
magazineCrudRouter.delete(
  "/:id",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.magazineCrudController.delete
);
var magazine_crud_routes_default = magazineCrudRouter;
//# sourceMappingURL=magazine-crud.routes.js.map

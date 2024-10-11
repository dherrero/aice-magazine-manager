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
var user_crud_routes_exports = {};
__export(user_crud_routes_exports, {
  default: () => user_crud_routes_default
});
module.exports = __toCommonJS(user_crud_routes_exports);
var import_controllers = require("@back/controllers");
var import_express = require("express");
const userCrudRouter = (0, import_express.Router)();
userCrudRouter.get(
  "/",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.userCrudController.getAll
);
userCrudRouter.get(
  "/:id",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.userCrudController.getById
);
userCrudRouter.post(
  "/",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.userCrudController.post
);
userCrudRouter.put(
  "/:id",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.userCrudController.put
);
userCrudRouter.delete(
  "/:id",
  import_controllers.authController.hasPermission("ADMIN"),
  import_controllers.userCrudController.delete
);
var user_crud_routes_default = userCrudRouter;
//# sourceMappingURL=user-crud.routes.js.map

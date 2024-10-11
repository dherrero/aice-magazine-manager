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
var http_responser_exports = {};
__export(http_responser_exports, {
  default: () => http_responser_default
});
module.exports = __toCommonJS(http_responser_exports);
class HttpResponser {
  static {
    /**
     * @description Send success response with json data
     *
     * @param res
     * @param data
     * @param statusCode
     * @returns
     */
    this.successJson = (res, data, statusCode = 200) => HttpResponser.#sendJson(res, data, statusCode);
  }
  static {
    /**
     * @description Send success response with empty data
     *
     * @param res
     * @param statusCode
     * @returns
     */
    this.successEmpty = (res, statusCode = 200) => HttpResponser.#sendData(res, null, statusCode);
  }
  static {
    /**
     * @description Send error response with json data
     *
     * @param res
     * @param error
     * @param statusCode
     * @returns
     */
    this.errorJson = (res, error, statusCode = 500) => HttpResponser.#sendJson(res, { error: error.message }, statusCode);
  }
  static #sendJson = (res, data, statusCode) => res.status(statusCode).json(data);
  static #sendData = (res, data, statusCode) => res.status(statusCode).send(data);
}
var http_responser_default = HttpResponser;
//# sourceMappingURL=http.responser.js.map

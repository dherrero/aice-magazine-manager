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
var common_types_exports = {};
__export(common_types_exports, {
  FilterhMagazineType: () => FilterhMagazineType
});
module.exports = __toCommonJS(common_types_exports);
var FilterhMagazineType = /* @__PURE__ */ ((FilterhMagazineType2) => {
  FilterhMagazineType2[FilterhMagazineType2["GREATERTHAN"] = 1] = "GREATERTHAN";
  FilterhMagazineType2[FilterhMagazineType2["GREATERTHANEQUAL"] = 2] = "GREATERTHANEQUAL";
  FilterhMagazineType2[FilterhMagazineType2["LESSTHAN"] = 3] = "LESSTHAN";
  FilterhMagazineType2[FilterhMagazineType2["LESSTHANEQUAL"] = 4] = "LESSTHANEQUAL";
  FilterhMagazineType2[FilterhMagazineType2["EQUAL"] = 5] = "EQUAL";
  return FilterhMagazineType2;
})(FilterhMagazineType || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FilterhMagazineType
});
//# sourceMappingURL=common-types.js.map

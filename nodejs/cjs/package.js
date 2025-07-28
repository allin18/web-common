/**!

 cjs 版本 

*/
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// nodejs/package.js
var exports_package = {};
__export(exports_package, {
  versionPlusPlus: () => versionPlusPlus
});
module.exports = __toCommonJS(exports_package);
var import_node_fs = __toESM(require("node:fs"));
var import_node_path = __toESM(require("node:path"));
function versionPlusPlus() {
  const packagePath = import_node_path.default.join("./", "package.json");
  const packageJson = JSON.parse(import_node_fs.default.readFileSync(packagePath, "utf8"));
  const oldVersion = packageJson.version.split(".");
  const major = parseInt(oldVersion[0], 10);
  const minor = parseInt(oldVersion[1], 10);
  const patch = parseInt(oldVersion[2], 10) + 1;
  const newVersion = `${major}.${minor}.${patch}`;
  console.log("version ++", packageJson.version, "->", newVersion);
  packageJson.version = newVersion;
  import_node_fs.default.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), "utf8");
}

/**!

 cjs 版本 end 

*/

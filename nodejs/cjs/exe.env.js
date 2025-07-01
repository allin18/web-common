// cjs 版本
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

// nodejs/exe.env.js
var exports_exe_env = {};
__export(exports_exe_env, {
  workDir: () => workDir,
  mode: () => mode,
  isReleaseMode: () => isReleaseMode,
  isDebugMode: () => isDebugMode
});
module.exports = __toCommonJS(exports_exe_env);
var import_node_path = __toESM(require("node:path"));
var isReleaseMode = isRelease();
var isDebugMode = !isReleaseMode;
var mode = isReleaseMode ? "production" : "development";
function isRelease() {
  const v = process.execPath.indexOf("node.exe") === -1;
  console.log(v ? "Release 模式" : "Debug 模式");
  return v;
}
var workDir = isReleaseMode ? import_node_path.default.dirname(process.execPath) : import_node_path.default.join(process.cwd(), "dist");

// cjs 版本

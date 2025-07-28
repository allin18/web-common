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

// nodejs/print.js
var exports_print = {};
__export(exports_print, {
  startBuildTimer: () => startBuildTimer,
  printUpdateLine: () => printUpdateLine
});
module.exports = __toCommonJS(exports_print);
function printUpdateLine(content) {
  if (process.stdout.isTTY) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(content);
  } else {
    console.log(content);
  }
}
function startBuildTimer(label = "") {
  const startTime = Date.now();
  const timer = setInterval(() => {
    const now = Date.now();
    const diffSeconds = ((now - startTime) / 1000).toFixed(2);
    printUpdateLine(`${label}构建中: 已过 ${diffSeconds} 秒...`);
  }, 1000);
  return () => {
    clearInterval(timer);
    const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`${label}构建完成，共耗时 ${totalSeconds} 秒 ✅`);
  };
}

/**!

 cjs 版本 end 

*/

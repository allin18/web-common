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

// nodejs/nodejs_mock_timeout.js
var exports_nodejs_mock_timeout = {};
__export(exports_nodejs_mock_timeout, {
  startServer: () => startServer
});
module.exports = __toCommonJS(exports_nodejs_mock_timeout);
var http = __toESM(require("node:http"));
var import_node_url = require("node:url");
var server = http.createServer((req, res) => {
  const url = new import_node_url.URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/test-timeout") {
    const delayParam = url.searchParams.get("delay");
    const delay = parseInt(delayParam, 10) || 0;
    console.log(`收到请求 /test-timeout，延迟 ${delay} 毫秒响应...`);
    setTimeout(() => {
      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      res.end(`响应完成（延迟 ${delay} 毫秒）`);
    }, delay + 1000);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});
function startServer() {
  server.listen(3000, () => {
    console.log("服务运行中：http://localhost:3000");
  });
}

// cjs 版本

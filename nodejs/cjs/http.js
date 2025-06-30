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

// nodejs/http.js
var exports_http = {};
__export(exports_http, {
  requestGet: () => requestGet,
  postJson: () => postJson
});
module.exports = __toCommonJS(exports_http);
var http = __toESM(require("node:http"));
var https = __toESM(require("node:https"));
var import_node_url = require("node:url");
function postJson(url, data) {
  console.log(`\uD83D\uDCE1 发送 POST 请求: ${url} 数据: ${JSON.stringify(data)}`);
  return new Promise((resolve, reject) => {
    const parsedUrl = new import_node_url.URL(url);
    const isHttps = parsedUrl.protocol === "https:";
    const lib = isHttps ? https : http;
    const body = JSON.stringify(data);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    };
    const req = lib.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => raw += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(raw));
        } catch (err) {
          reject(new Error(`Invalid JSON: ${raw}`));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
function requestGet(url) {
  return new Promise((resolve, reject) => {
    const uri = new import_node_url.URL(url);
    const options = {
      hostname: uri.hostname,
      port: 443,
      path: uri.pathname,
      method: "GET"
    };
    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(data));
    });
    req.on("error", (e) => {
      console.error(e);
    });
    req.end();
  });
}

// cjs 版本

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

// nodejs/download.js
var exports_download = {};
__export(exports_download, {
  downloadFile: () => downloadFile
});
module.exports = __toCommonJS(exports_download);
var os = __toESM(require("node:os"));
var fs = __toESM(require("node:fs"));
var path = __toESM(require("node:path"));
var https = __toESM(require("node:https"));
var http = __toESM(require("node:http"));
function downloadFile(opts = {}) {
  return new Promise((resolve, reject) => {
    const url = opts.url;
    const config = {
      outputDir: opts.outputDir,
      filename: path.basename(url),
      showProgress: true,
      isSysDir: true,
      ...opts
    };
    let outputDirPath;
    if (config.isSysDir) {
      const exeName = path.basename(process.execPath);
      outputDirPath = fs.mkdtempSync(path.join(os.tmpdir(), `${exeName}-`));
    } else {
      if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir, { recursive: true });
      }
      outputDirPath = config.outputDir;
    }
    const outputPath = path.join(outputDirPath, config.filename);
    const fileStream = fs.createWriteStream(outputPath);
    console.log(`\uD83D\uDD04 开始下载: ${url}`);
    let httpCompat;
    if (url.startsWith("https://")) {
      httpCompat = https;
    } else {
      httpCompat = http;
    }
    httpCompat.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`❌ 下载失败 - HTTP ${response.statusCode}`);
        return;
      }
      const totalSize = parseInt(response.headers["content-length"], 10);
      let downloaded = 0;
      const updateProgress = (chunk) => {
        if (config.showProgress && totalSize) {
          downloaded += chunk.length;
          const percent = (downloaded / totalSize * 100).toFixed(2);
          process.stdout.write(`⬇️ 下载进度: ${percent}% (${(downloaded / 1024 / 1024).toFixed(2)}MB/${(totalSize / 1024 / 1024).toFixed(2)}MB)\r`);
        }
      };
      response.on("data", (chunk) => {
        fileStream.write(chunk);
        updateProgress(chunk);
      });
      response.on("end", () => {
        fileStream.end(() => {
          console.log("✅ 下载完成");
          console.log(`\uD83D\uDCC1 文件保存至: ${outputPath}`);
          resolve(outputPath);
        });
      });
    }).on("error", (err) => {
      console.error(`❌ 下载失败: ${err.message}`);
      fs.unlinkSync(outputPath);
      reject();
    });
    fileStream.on("error", (err) => {
      console.error(`❌ 文件写入失败: ${err.message}`);
      reject();
    });
  });
}

/**!

 cjs 版本 end 

*/

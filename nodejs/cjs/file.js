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

// nodejs/file.js
var exports_file = {};
__export(exports_file, {
  safeWriteFile: () => safeWriteFile,
  safeRemoveFile: () => safeRemoveFile,
  safeRemoveDirectory: () => safeRemoveDirectory,
  safeReadFile: () => safeReadFile,
  safeMoveFileToDirectory: () => safeMoveFileToDirectory,
  safeMoveFile: () => safeMoveFile,
  safeMoveDirectory: () => safeMoveDirectory,
  safeIsExists: () => safeIsExists,
  safeCreateDirectory: () => safeCreateDirectory,
  safeCopyFileToDirectory: () => safeCopyFileToDirectory,
  safeCopyFile: () => safeCopyFile,
  safeCopyDirectory: () => safeCopyDirectory,
  cleanDirectory: () => cleanDirectory
});
module.exports = __toCommonJS(exports_file);
var import_node_path = __toESM(require("node:path"));
var import_node_fs = __toESM(require("node:fs"));
function safeIsExists(path2) {
  return import_node_fs.default.existsSync(path2);
}
function cleanDirectory(dir) {
  if (import_node_fs.default.existsSync(dir)) {
    import_node_fs.default.rmSync(dir, { recursive: true, force: true });
    console.log("清理目录:", dir);
  }
}
function safeReadFile(path2) {
  return import_node_fs.default.readFileSync(path2, "utf8");
}
function safeWriteFile(path2, content) {
  import_node_fs.default.writeFileSync(path2, content, "utf8");
}
function safeRemoveFile(path2) {
  import_node_fs.default.unlinkSync(path2);
}
function safeCopyFile(source, target) {
  const targetDir = import_node_path.default.dirname(target);
  import_node_fs.default.mkdirSync(targetDir, { recursive: true });
  import_node_fs.default.copyFileSync(source, target);
  console.log(`已复制文件 "${source}" 到 "${target}"`);
}
function safeCopyFileToDirectory(source, targetDir) {
  const fileName = import_node_path.default.basename(source);
  const target = import_node_path.default.join(targetDir, fileName);
  import_node_fs.default.mkdirSync(targetDir, { recursive: true });
  return safeCopyFile(source, target);
}
function safeMoveFile(source, target) {
  import_node_fs.default.mkdirSync(import_node_path.default.dirname(target), { recursive: true });
  try {
    import_node_fs.default.renameSync(source, target);
    console.log("重命名成功:", source, "->", target);
  } catch (error) {
    console.log("重命名失败，尝试 copy + delete:", error.message);
    if (error.code === "EXDEV") {
      try {
        import_node_fs.default.copyFileSync(source, target);
        console.log("复制文件成功:", source, "->", target);
      } catch (err) {
        console.error("复制文件失败:", err.message);
        throw err;
      }
      try {
        import_node_fs.default.unlinkSync(source);
        console.log("删除原文件成功:", source);
      } catch (err) {
        console.warn("删除原文件失败（可能被占用）:", err.message);
      }
    } else {
      throw error;
    }
  }
}
function safeMoveFileToDirectory(source, targetDir) {
  const fileName = import_node_path.default.basename(source);
  const target = import_node_path.default.join(targetDir, fileName);
  import_node_fs.default.mkdirSync(targetDir, { recursive: true });
  return safeMoveFile(source, target);
}
function safeCreateDirectory(path2) {
  import_node_fs.default.mkdirSync(path2, { recursive: true });
  console.log(`已创建目录 "${path2}"`);
}
function safeRemoveDirectory(path2) {
  import_node_fs.default.rmSync(path2, { recursive: true, force: true });
}
function safeCopyDirectory(sourceDir, targetDir) {
  if (!import_node_fs.default.existsSync(sourceDir)) {
    throw new Error(`Source folder does not exist: ${sourceDir}`);
  }
  import_node_fs.default.mkdirSync(targetDir, { recursive: true });
  const entries = import_node_fs.default.readdirSync(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = import_node_path.default.join(sourceDir, entry.name);
    const destPath = import_node_path.default.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      safeCopyDirectory(srcPath, destPath);
    } else {
      import_node_fs.default.copyFileSync(srcPath, destPath);
    }
  }
}
function safeMoveDirectory(source, target) {
  import_node_fs.default.mkdirSync(import_node_path.default.dirname(target), { recursive: true });
  try {
    import_node_fs.default.renameSync(source, target);
    console.log("目录重命名成功:", source, "->", target);
  } catch (error) {
    console.log("目录重命名失败，尝试复制目录:", error.message);
    if (error.code === "EXDEV") {
      try {
        safeCopyDirectory(source, target);
        console.log("目录复制成功:", source, "->", target);
      } catch (err) {
        console.error("目录复制失败:", err.message);
        throw err;
      }
      try {
        safeRemoveDirectory(source);
        console.log("源目录删除成功:", source);
      } catch (err) {
        console.warn("源目录删除失败（可能被占用）:", err.message);
      }
    } else {
      throw error;
    }
  }
}

/**!

 cjs 版本 end 

*/

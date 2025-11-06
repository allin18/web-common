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

// nodejs/platform.js
var exports_platform = {};
__export(exports_platform, {
  platform: () => platform,
  isWindows: () => isWindows,
  isMac: () => isMac,
  isLinux: () => isLinux
});
module.exports = __toCommonJS(exports_platform);
var platform = process.platform;
var isWindows = platform === "win32";
var isMac = platform === "darwin";
var isLinux = platform === "linux";

// nodejs/process.js
var exports_process = {};
__export(exports_process, {
  runCommand2: () => runCommand2,
  runCommand: () => runCommand,
  createProcess: () => createProcess,
  cd_command: () => cd_command
});
module.exports = __toCommonJS(exports_process);
var import_node_child_process = require("node:child_process");
function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const cmd = import_node_child_process.spawn(command, args, { shell: true });
    cmd.stdout.on("data", (data) => {
      process.stdout.write(data);
    });
    cmd.stderr.on("data", (data) => {
      process.stderr.write(data);
    });
    cmd.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(0);
    });
  });
}
function runCommand2(command) {
  return new Promise((resolve, reject) => {
    import_node_child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve(0);
    });
  });
}
function createProcess(command, output) {
  return new Promise((resolve) => {
    console.log("createProcess", "command", command);
    const child = import_node_child_process.spawn(command, {
      shell: true
    });
    child.stdout.on("data", (data) => {
      if (typeof output === "function") {
        output({ type: "stdout", data });
      } else {
        process.stdout.write(`stdout: ${data}`);
      }
    });
    child.stderr.on("data", (data) => {
      if (typeof output === "function") {
        output({ type: "stderr", data });
      } else {
        process.stderr.write(`stderr: ${data}`);
      }
    });
    child.on("exit", (code) => {
      console.log(`子进程退出，退出码：${code}`);
      resolve();
    });
  });
}
var cd_command = (p) => {
  if (isWindows) {
    return `cd /d ${p}`;
  } else if (isMac) {
    return `cd ${p}`;
  }
  return "";
};

/**!

 cjs 版本 end 

*/

import path, { dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 获取调用者的路径
export function getCallerPath() {
  const origPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;

  const err = new Error();
  const stack = err.stack;

  Error.prepareStackTrace = origPrepareStackTrace;

  // stack[0] 是当前函数，stack[1] 是调用者
  const callerFile = stack[1].getFileName();

  return path.dirname(callerFile);
}

export function pathToVariableName(path) {
  return path
      .replace(/[^a-zA-Z0-9]/g, '_') // 将所有非字母数字字符替换为 _
      .replace(/^(\d)/, '_$1');      // 如果以数字开头，加 _
}
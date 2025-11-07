import { exec, spawn } from 'node:child_process'
import { isWindows, isMac } from './platform'

// 实时结果
export function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const cmd = spawn(command, args, { shell: true })
    // 监听标准输出 (stdout)
    cmd.stdout.on('data', (data) => {
      process.stdout.write(data) // 实时打印命令输出
    })
    // 监听标准错误输出 (stderr)
    cmd.stderr.on('data', (data) => {
      process.stderr.write(data) // 实时打印错误输出
    })
    // 监听命令执行结束
    cmd.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      resolve(0)
    })
  })
}

// 非实时结果
export function runCommand2(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      console.error(`stderr: ${stderr}`)
      resolve(0)
    })
  })
}

export function createProcess(command, output) {
  return new Promise((resolve) => {
    console.log("createProcess", "command", command);
    // 启动一个子进程，执行一个命令（如 Python 脚本）
    const child = spawn(command, {
      shell: true, // 使用 shell 启动命令
      // stdio: 'inherit', // 显式继承 stdio 继承主进程的终端连接，使其拥有 TTY 能力 但 child.stdout === null。
    });
    // 实时获取子进程的 stdout 输出
    child.stdout.on("data", (data) => {
      // 将子进程的输出打印到控制台
      if (typeof output === 'function') {
        output({ type: "stdout", data: data.toString('utf8').trim() });
      } else {
        process.stdout.write(`stdout: ${data}`);
      }
    });
    // 实时获取子进程的 stderr 输出
    child.stderr.on("data", (data) => {
      // 将子进程的错误输出打印到控制台
      if (typeof output === 'function') {
        output({ type: "stderr", data: data.toString('utf8').trim() });
      } else {
        process.stderr.write(`stderr: ${data}`);
      }
    });
    // 监听子进程退出
    child.on("exit", (code) => {
      console.log(`子进程退出，退出码：${code}`);
      resolve();
    });
  });
}

export const cd_command = (p) => {
    if (isWindows) {
        return `cd /d ${p}`
    } else if (isMac) {
        return `cd ${p}`
    }
    return ''
}
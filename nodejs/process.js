import { exec, spawn } from 'node:child_process'


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
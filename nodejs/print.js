// 打印并更新当前行
export function printUpdateLine(content) {
    if (process.stdout.isTTY) {
        // 当你在 Node.js 的子进程中调用另一个由 Node.js 编译的 .exe 文件（通常是通过 pkg、nexe 等工具打包的），
        // 但在那个 .exe 文件内部使用 process.stdout.clearLine() 报错为 undefined，
        // 这通常是因为 标准输出（stdout）不是一个 TTY（终端）。
        // 解决: spawn(..., { stdio: 'inherit' })
        // 这会将子进程的 stdin, stdout, stderr 继承主进程的终端连接，使其拥有 TTY 能力
        process.stdout.clearLine();     // 清除当前行
        process.stdout.cursorTo(0);  // 将光标移到行首
        process.stdout.write(content);  // 写入新的内容
    } else {
        console.log(content)
    }
}

/*
const stop = startBuildTimer();
// 模拟构建过程（比如 5 秒后停止）
setTimeout(() => {
    stop(); // 停止打印
}, 5000);
* */
export function startBuildTimer(label = '') {
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
import * as os from "node:os";
import * as fs from "node:fs";
import * as path from "node:path";
import * as https from "node:https";
import * as http from "node:http";

export function downloadFile(opts = {}) {
    return new Promise((resolve, reject) => {
        const url = opts.url
        // 配置参数
        const config = {
            outputDir: opts.outputDir,    // 保存目录
            filename: path.basename(url), // 保存文件名
            showProgress: true,// 显示进度条
            isSysDir: true,
            ...opts,
        };

        let outputDirPath
        if (config.isSysDir) {
            const exeName = path.basename(process.execPath)
            // 创建临时目录
            outputDirPath = fs.mkdtempSync(path.join(os.tmpdir(), `${exeName}-`));
        } else {
            // TODO 判断有没有值
            // 创建保存目录
            if (!fs.existsSync(config.outputDir)) {
                fs.mkdirSync(config.outputDir, {recursive: true});
            }
            outputDirPath = config.outputDir
        }

        const outputPath = path.join(outputDirPath, config.filename);
        const fileStream = fs.createWriteStream(outputPath);

        console.log(`🔄 开始下载: ${url}`);

        let httpCompat
        if (url.startsWith('https://')) {
            httpCompat = https
        } else {
            httpCompat = http
        }
        httpCompat.get(url, (response) => {
            // 处理 HTTP 错误状态码
            if (response.statusCode !== 200) {
                console.error(`❌ 下载失败 - HTTP ${response.statusCode}`);
                return;
            }

            // 获取文件总大小
            const totalSize = parseInt(response.headers['content-length'], 10);
            let downloaded = 0;

            // 进度条更新函数
            const updateProgress = (chunk) => {
                if (config.showProgress && totalSize) {
                    downloaded += chunk.length;
                    const percent = ((downloaded / totalSize) * 100).toFixed(2);
                    process.stdout.write(`⬇️ 下载进度: ${percent}% (${(downloaded / 1024 / 1024).toFixed(2)}MB/${(totalSize / 1024 / 1024).toFixed(2)}MB)\r`);
                }
            };

            // 数据接收
            response.on('data', (chunk) => {
                fileStream.write(chunk);
                updateProgress(chunk);
            });

            // 完成处理
            response.on('end', () => {
                fileStream.end(() => {
                    console.log('✅ 下载完成');
                    console.log(`📁 文件保存至: ${outputPath}`);
                    resolve(outputPath);
                });
            });

        }).on('error', (err) => { // 网络错误处理
            console.error(`❌ 下载失败: ${err.message}`);
            fs.unlinkSync(outputPath); // 删除不完整文件
            reject();
        });

        // 文件写入错误处理
        fileStream.on('error', (err) => {
            console.error(`❌ 文件写入失败: ${err.message}`);
            reject();
        });
    })
}

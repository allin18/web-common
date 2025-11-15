import path from "node:path";
import fs from "node:fs";

// 是否存在 文件、目录
export function safeIsExists(path) {
    return fs.existsSync(path)
}

// 清理目录
export function cleanDirectory(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, {recursive: true, force: true});
        console.log('清理目录:', dir);
    }
}



/*
* 文件
* */

export function safeReadFile(path) {
    return fs.readFileSync(path, 'utf8');
}

export function safeWriteFile(path, content) {
    fs.writeFileSync(path, content, 'utf8');
}

export function safeRemoveFile(path) {
    fs.unlinkSync(path);
}

export function safeCopyFile(source, target) {
    // const targetDir = path.dirname(target);
    // await fs.promises.mkdir(targetDir, { recursive: true });
    // await fs.promises.copyFile(source, target);
    const targetDir = path.dirname(target);
    fs.mkdirSync(targetDir, {recursive: true});
    fs.copyFileSync(source, target);
    console.log(`已复制文件 "${source}" 到 "${target}"`);
}

// 移动文件 safeMoveTempFile
export function safeMoveFile(source, target) {
    // // 确保目标目录存在（无论是否跨设备）
    // const targetDir = path.dirname(target);
    // if (!fs.existsSync(targetDir)) {
    //     fs.mkdirSync(targetDir, { recursive: true });
    // }
    fs.mkdirSync(path.dirname(target), {recursive: true});
    try {
        // 尝试直接重命名
        fs.renameSync(source, target);
        console.log('重命名成功:', source, '->', target);
    } catch (error) {
        console.warn('重命名失败，尝试 copy + delete:', error.message);
        if (error.code === 'EXDEV') {
            // 方案1 跨设备时使用复制+删除方式
            try {
                fs.copyFileSync(source, target);
                console.log('复制文件成功:', source, '->', target);
            } catch (err) {
                console.error('复制文件失败:', err.message);
                throw err; // 没复制成功就不继续
            }
            try {
                fs.unlinkSync(source);
                console.log('删除原文件成功:', source);
            } catch (err) {
                console.warn('删除原文件失败（可能被占用）:', err.message);
                // 可以选择不抛出异常，让流程继续
            }
            // 方案2 跨设备时使用流式复制
            // const readStream = fs.createReadStream(source);
            // const writeStream = fs.createWriteStream(target);
            // return new Promise((resolve, reject) => {
            //     readStream.on('error', reject);
            //     writeStream.on('error', reject);
            //     writeStream.on('finish', () => {
            //         fs.unlinkSync(source);
            //         resolve();
            //     });
            //     readStream.pipe(writeStream);
            // });
        } else {
            throw error;
        }
    }
}



/*
* 目录
* */

// 创建目录 递归
export function safeCreateDirectory(path) {
    fs.mkdirSync(path, { recursive: true });
    console.log(`已创建目录 "${path}"`);
}

// 移除目录 递归
export function safeRemoveDirectory(path) {
    fs.rmSync(path, { recursive: true, force: true });
}

/**
 * 复制目录 但不包含目录本身
 * 复制源文件夹的内容（而非源文件夹本身）到目标文件夹
 * @param {string} sourceDir - 源目录
 * @param {string} targetDir - 目标目录
 */
export function safeCopyDirectory(sourceDir, targetDir) {
    if (!fs.existsSync(sourceDir)) {
        throw new Error(`Source folder does not exist: ${sourceDir}`);
    }

    fs.mkdirSync(targetDir, {recursive: true});

    const entries = fs.readdirSync(sourceDir, {withFileTypes: true});

    for (const entry of entries) {
        const srcPath = path.join(sourceDir, entry.name);
        const destPath = path.join(targetDir, entry.name);

        if (entry.isDirectory()) {
            safeCopyDirectory(srcPath, destPath); // Recursively copy subfolders
        } else {
            fs.copyFileSync(srcPath, destPath); // Copy file
        }
    }
}

// 移动目录
export function safeMoveDirectory(source, target) {
    // 确保目标目录存在
    fs.mkdirSync(path.dirname(target), { recursive: true });
    try {
        // 尝试直接重命名
        fs.renameSync(source, target);
        console.log("目录重命名成功:", source, "->", target);
    } catch (error) {
        console.warn("目录重命名失败，尝试复制目录:", error.message);
        if (error.code === "EXDEV") {
            // 跨设备移动 → 递归复制 + 删除
            try {
                safeCopyDirectory(source, target);
                console.log("目录复制成功:", source, "->", target);
            } catch (err) {
                console.error("目录复制失败:", err.message);
                throw err; // 复制失败直接抛出
            }
            try {
                safeRemoveDirectory(source);
                console.log("源目录删除成功:", source);
            } catch (err) {
                console.warn("源目录删除失败（可能被占用）:", err.message);
                // 删除失败也不阻塞
            }
        } else {
            throw error;
        }
    }
}
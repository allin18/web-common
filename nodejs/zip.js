import path from "node:path";
import AdmZip from 'adm-zip';
import fs from "node:fs";
import * as tar from "tar"; // 没有 default

export function untar(input, output) {
    try {
        console.log('开始解压...');
        tar.x({
            file: input, // 'path/to/file.x64.tar.gz',
            C: output, // 'output/directory',  // 解压到这个目录
            sync: true // 同步解压
        });
        console.log('解压完成');
    } catch (err) {
        console.error('解压时发生错误:', err);
    }
}

export function unzip(input, output) {
    // 默认输出路径为输入文件的同级目录 fileNameWithoutExt
    const out = output || path.join(path.dirname(input), path.basename(input, path.extname(input)));
    const zip = new AdmZip(input, {});
    fs.mkdirSync(out, {recursive: true}); // 创建输出目录
    zip.extractAllTo(out, true); // 解压文件
    return out;
}

// 和 createZipArchiveWithFolder 重合 TODO 查看对不对
export function rezip(sourceFolder, outputPath) {
    try {
        const zip = new AdmZip();
        const addFiles = (folder, zipPath = '') => {
            const files = fs.readdirSync(folder);
            for (const file of files) {
                const fullPath = path.join(folder, file);
                const stat = fs.statSync(fullPath);
                const entryPath = path.join(zipPath, file);
                if (stat.isDirectory()) {
                    addFiles(fullPath, entryPath);
                } else {
                    zip.addLocalFile(fullPath, zipPath);
                }
            }
        };
        addFiles(sourceFolder);
        fs.mkdirSync(path.dirname(outputPath), {recursive: true});
        zip.writeZip(outputPath, (error) => {
            if (error) {
                console.error("写入 ZIP 文件时发生错误:", error);
            } else {
                console.log("ZIP 文件已成功写入到:", outputPath);
            }
        });
    } catch (error) {
        console.error('压缩文件失败:', error.message);
        process.exit(1);
    }
}

// 将单个文件压缩为zip TODO 可以支持为多个文件 [] for of 处理
export function createZipArchive(fileName, zipFileName) {
    const zip = new AdmZip();
    zip.addLocalFile(fileName); // /home/me/file.js
    // 写入zip文件
    zip.writeZip(zipFileName); // /home/me/files.zip
    // console.log('ZIP file created:', zipFileName);
}

// 将目录压缩为zip
export function createZipArchiveWithFolder(folderPath, outputZipPath) {
    const zip = new AdmZip();
    zip.addLocalFolder(folderPath);
    zip.writeZip(outputZipPath);
}